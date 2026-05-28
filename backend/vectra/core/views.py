import json
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from vectra.org_manager.models import Organisation, Group
from vectra.email_handler.models import SentMail, EmailTemplate
from vectra.schedular.models import EmailSchedule
from django.contrib.auth.models import User


def home(request):
    return render(request, "home.html")

@login_required
def dashboard(request, tab="home"):
    popup = request.GET.get("popup")
    popup_id = request.GET.get("id")
    
    avatar = request.user.first_name[0].upper() + request.user.last_name[0].upper()
    full_name = request.user.first_name + " " + request.user.last_name

    organisations = Organisation.objects.filter(user=request.user)

    groups = Group.objects.filter(
        organisation__user=request.user
    ).prefetch_related('emails')

    history = SentMail.objects.filter(
        sender=request.user
    ).select_related('group').order_by('-created_at')


    org_groups = {}

    for org in organisations:
        groups_list = []
        for g in org.groups.all():
            emails = g.emails.values_list("email", flat=True)
            recipients = ",".join(emails)

            groups_list.append({
                "id": g.id,
                "name": g.name,
                "recipients": recipients
            })
        org_groups[org.id] = groups_list

    org_details = {
        org.id: { "name": org.name, "description": org.description or ""}
        for org in organisations
    }

    return render(request, "dashboard.html", {
        "current_tab": tab,
        "current_popup": popup,
        "popup_id": popup_id,
        "full_name": full_name,
        "avatar": avatar,
        "organisations": organisations,
        "groups": groups,
        "history": history,
        "org_groups": json.dumps(org_groups, cls=DjangoJSONEncoder),
        "org_details": json.dumps(org_details, cls=DjangoJSONEncoder)
    })

def test_page(request):
    # For simplicity, we'll use the first user.
    # In a real app, you would use request.user
    user = User.objects.first()
    if not user:
        # Handle case where there are no users, maybe create one or return an error
        return render(request, "test.html", {"user_id": None})
    
    templates = EmailTemplate.objects.filter(user=user)
    schedules = EmailSchedule.objects.filter(user=user)
    groups = Group.objects.filter(organisation__user=user)

    return render(request, "test.html", {
        "user_id": user.id,
        "templates": templates,
        "schedules": schedules,
        "groups": groups
    })

def forum_test_page(request):
    from vectra.forum.models import Thread
    threads = Thread.objects.all().prefetch_related('comments')
    return render(request, "test_forums.html", {'threads': threads})


import os
from django.conf import settings
from django.http import HttpResponse

def serve_react(request, path=None):
    try:
        dist_path = os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'index.html')
        with open(dist_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse(
            """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>React App Not Built</title>
                <style>
                    body {
                        font-family: 'Inter', system-ui, sans-serif;
                        background: #0f172a;
                        color: #f1f5f9;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        max-width: 600px;
                        padding: 2.5rem;
                        background: #1e293b;
                        border-radius: 12px;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                        text-align: center;
                    }
                    h2 { color: #f43f5e; margin-top: 0; }
                    code { background: #334155; padding: 0.2rem 0.4rem; border-radius: 4px; color: #38bdf8; font-family: monospace; }
                    a { color: #38bdf8; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>React Frontend Not Built Yet</h2>
                    <p>To connect and serve the React application through Django, you must build the frontend assets.</p>
                    <p>Run the following command in the <code>frontend/</code> directory:</p>
                    <p><code>npm run build</code></p>
                    <p style="margin-top: 1.5rem; font-size: 0.9rem; color: #94a3b8;">
                        Alternatively, run the separate frontend development server: <br/>
                        <code>npm run dev</code> inside <code>frontend/</code>
                    </p>
                </div>
            </body>
            </html>
            """,
            status=501,
        )