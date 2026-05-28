from .bulk_sender import bulk_sender
from .token_handler import token_handler

from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from vectra.org_manager.models import Group
from .models import SentMail, EmailTemplate
import json

OAUTH_REDIRECT_URI_NAME = "email_handler:gmail_oauth_callback"


def _build_redirect_uri(request: HttpRequest) -> str:
    from django.conf import settings
    path = "/gmail/callback/"
    if settings.DEBUG:
        # Google requires the redirect URI to match exactly one of the authorized redirect URIs.
        # Loopback ports on localhost / 127.0.0.1 are allowed.
        # We determine the hostname based on the request referer or request host to match the user's active session cookie domain.
        referer = request.META.get('HTTP_REFERER', '')
        host = "127.0.0.1:8000"
        if "localhost" in referer or "localhost" in request.get_host():
            host = "localhost:8000"
        return f"http://{host}{path}"
    return request.build_absolute_uri(path)


# Compose Mail For Groups
@csrf_exempt
def send_bulk_mail(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "status": "error",
            "message": "Authentication required. Please log in again."
        }, status=401)

    # If no Gmail token yet, kick off the OAuth flow
    if not token_handler.has_token(request.user):
        redirect_uri = _build_redirect_uri(request)
        auth_url, state = token_handler.get_auth_url(redirect_uri)

        # Stash the state + where to go after auth so the callback can resume
        request.session["gmail_oauth_state"] = state
        
        if request.path.startswith('/api/'):
            # For React SPA, redirect back to React's dashboard after auth
            next_url = "/app/dashboard/"
            referer = request.META.get('HTTP_REFERER', '')
            if settings.DEBUG and "5173" in referer:
                if "localhost" in referer:
                    next_url = "http://localhost:5173/app/dashboard/"
                else:
                    next_url = "http://127.0.0.1:5173/app/dashboard/"
            request.session["gmail_oauth_next"] = next_url
            return JsonResponse({
                "status": "oauth_required",
                "auth_url": auth_url
            })
        
        request.session["gmail_oauth_next"] = request.get_full_path()
        return redirect(auth_url)

    if request.method == "POST":
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                subject = data.get("subject")
                body = data.get("body")
                group_ids = data.get("group_ids", [])
            except Exception:
                return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        else:
            subject = request.POST.get("subject")
            body = request.POST.get("body")
            group_ids = request.POST.getlist("group_ids")

        try:
            for group_id in group_ids:
                group = Group.objects.filter(id=group_id).first()
                if not group:
                    continue

                recipients = list(group.emails.values_list("email", flat=True))
                if not recipients:
                    continue

                bulk_sender.send_bulk_emails(request.user, recipients, subject, body, group.name)

                SentMail.objects.create(
                    group=group,
                    subject=subject,
                    body=body,
                    recipients=", ".join(recipients),
                    sender=request.user
                )
        except Exception as e:
            # If Google API credentials are invalid/expired, clean them up to force re-authentication
            if "token" in str(e).lower() or "refresh" in str(e).lower() or "credential" in str(e).lower() or "grant" in str(e).lower():
                from .models import GmailToken
                GmailToken.objects.filter(user=request.user).delete()
            
            if request.path.startswith('/api/'):
                return JsonResponse({
                    "status": "error",
                    "message": f"Gmail sending failed: {str(e)}"
                }, status=400)
            raise e

        if request.path.startswith('/api/'):
            return JsonResponse({
                "status": "success",
                "message": "Emails sent successfully"
            })

        return redirect("core:dashboard_tab", tab="organisation")


# Gmail OAuth callback — Google redirects the user's browser here after granting access
@login_required
def gmail_oauth_callback(request):
    state = request.session.get("gmail_oauth_state")
    next_url = request.session.pop("gmail_oauth_next", None)

    redirect_uri = _build_redirect_uri(request)

    token_handler.exchange_and_save_token(
        user=request.user,
        redirect_uri=redirect_uri,
        state=state,
        auth_response_url=request.build_absolute_uri()
    )

    # Return the user to where they were originally headed, or fall back to dashboard
    if next_url:
        return redirect(next_url)
    from django.urls import reverse
    return redirect(reverse("core:dashboard_tab", kwargs={"tab": "organisation"}))


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def create_email_template(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        subject = data.get('subject')
        body = data.get('body')

        if not all([name, subject, body]):
            return JsonResponse({'status': 'error', 'message': 'Missing required fields (name, subject, body)'}, status=400)

        template = EmailTemplate.objects.create(
            user=request.user,
            name=name,
            subject=subject,
            body=body
        )
        return JsonResponse({'status': 'success', 'template_id': template.id}, status=201)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

