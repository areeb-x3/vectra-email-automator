from django.shortcuts import render

import csv, io
from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import JsonResponse
from .models import Organisation, Group, GroupEmail


# Create Organisation Popup From
@login_required
def create_organisation(request):
    if request.method == "POST":
        name = request.POST.get("name")
        description = request.POST.get("description")
        csv_file = request.FILES.get("csv_file")

        # Creating Organisation
        organisation = Organisation.objects.create(
            user=request.user,
            name=name,
            description=description
        )

        # If User provided CSV then add groups
        if csv_file:
            decoded = csv_file.read().decode("utf-8")
            reader = csv.reader(io.StringIO(decoded))

            # Skipping the first row because it contains column names
            next(reader, None)
            for row in reader:
                if len(row) < 2:
                    continue
                group_name = row[0].strip()
                email = row[1].strip()

                if not group_name or not email:
                    continue
                # Creating Group with emails
                group_obj, _ = Group.objects.get_or_create(organisation=organisation, name=group_name)
                GroupEmail.objects.get_or_create(group=group_obj,email=email)

        if request.path.startswith('/api/'):
            return JsonResponse({
                "status": "success",
                "organisation": {
                    "id": organisation.id,
                    "name": organisation.name,
                    "description": organisation.description,
                }
            })

        return redirect("core:dashboard_tab", tab="organisation")

# Modify Existing Organisation
@login_required
def modify_organisation(request):
    if request.method == "POST":
        org_id = request.POST.get("org_id")   # You need to send this hidden input
        org = get_object_or_404(Organisation, id=org_id)

        org.name = request.POST.get("name", "").strip()
        org.description = request.POST.get("description", "").strip()
        org.save()

        if request.path.startswith('/api/'):
            return JsonResponse({
                "status": "success",
                "organisation": {
                    "id": org.id,
                    "name": org.name,
                    "description": org.description,
                }
            })

    url = reverse("core:dashboard_tab", kwargs={"tab": "organisation"})
    url = f"{url}?popup=editOrganisationPopup&id={org_id}"
    return redirect(url)

# Delete an Organisation
@login_required
def delete_organisation(request):
    org_id = request.POST.get("organisation_id")
    organisation = get_object_or_404(
        Organisation,
        id=org_id,
        user=request.user
    )

    if request.method == "POST":
        organisation.delete()
        if request.path.startswith('/api/'):
            return JsonResponse({"status": "success", "message": "Organisation deleted"})
        return redirect("core:dashboard_tab", tab="organisation")

    if request.path.startswith('/api/'):
        return JsonResponse({"status": "error", "message": "Invalid method"}, status=400)
    return redirect("core:dashboard_tab", tab="organisation")

# Group Popup forms
@login_required
def create_group(request):
    if request.method == "POST":
        name = request.POST.get("name")
        recipients_raw = request.POST.get("recipients")
        org_id = request.POST.get("org_id")

        try:
            organisation = Organisation.objects.get(id=org_id, user=request.user)
        except Organisation.DoesNotExist:
            if request.path.startswith('/api/'):
                return JsonResponse({"status": "error", "message": "Invalid organisation."}, status=400)
            messages.error(request, "Invalid organisation.")
            return redirect("core:dashboard")

        if Group.objects.filter(organisation=organisation, name=name).exists():
            if request.path.startswith('/api/'):
                return JsonResponse({"status": "error", "message": "A group with that name already exists."}, status=400)
            messages.error(request, "A group with that name already exists.")
            return redirect("core:dashboard")

        group = Group.objects.create(
            organisation=organisation,
            name=name,
            description=None
        )
        emails = []
        if recipients_raw:
            emails = [e.strip() for e in recipients_raw.split(",") if e.strip()]

            for email in emails:
                if "@" in email:
                    parts = email.split("@")
                    if len(parts) == 2:
                        local, domain = parts
                        if local and domain and "." in domain and " " not in email:
                            GroupEmail.objects.create(group=group, email=email)

        if request.path.startswith('/api/'):
            return JsonResponse({
                "status": "success",
                "group": {
                    "id": group.id,
                    "name": group.name,
                    "recipients": emails
                }
            })

        url = reverse("core:dashboard_tab", kwargs={"tab": "organisation"})
        url = f"{url}?popup=editOrganisationPopup&id={org_id}"
        return redirect(url)

# Modify Group
@login_required
def modify_group(request):
    if request.method == "POST":
        org_id = request.POST.get("org_id")
        group_id = request.POST.get("group_id")
        name = request.POST.get("name")
        recipients_raw = request.POST.get("recipients", "")

        try:
            group = Group.objects.get(id=group_id, organisation__user=request.user)
        except Group.DoesNotExist:
            if request.path.startswith('/api/'):
                return JsonResponse({"status": "error", "message": "Group not found"}, status=404)
            return redirect("core:dashboard")

        group.name = name
        group.save()

        emails = [
            email.strip()
            for email in recipients_raw.split(",")
            if email.strip() != ""
        ]

        GroupEmail.objects.filter(group=group).delete()
        group_emails = [
            GroupEmail(email=email, group=group)
            for email in emails
        ]
        GroupEmail.objects.bulk_create(group_emails)

        if request.path.startswith('/api/'):
            return JsonResponse({
                "status": "success",
                "group": {
                    "id": group.id,
                    "name": group.name,
                    "recipients": emails
                }
            })

    url = reverse("core:dashboard_tab", kwargs={"tab": "organisation"})
    url = f"{url}?popup=editOrganisationPopup&id={org_id}"
    return redirect(url)

# Delete Group
@login_required
def delete_group(request):
    org_id = request.POST.get("org_id")
    group_id = request.POST.get("group_id")
    group = Group.objects.filter(id=group_id, organisation__user=request.user).first()

    if not group:
        if request.path.startswith('/api/'):
            return JsonResponse({"status": "error", "message": "Group not found."}, status=404)
        messages.error(request, "Group not found.")
        return redirect("core:dashboard")

    group.delete()
    if request.path.startswith('/api/'):
        return JsonResponse({"status": "success", "message": "Group deleted"})

    url = reverse("core:dashboard_tab", kwargs={"tab": "organisation"})
    url = f"{url}?popup=editOrganisationPopup&id={org_id}"
    return redirect(url)


# Get All Organisations (API only)
@login_required
def get_organisations(request):
    try:
        organisations = Organisation.objects.filter(user=request.user)
        data = []
        for org in organisations:
            groups_data = []
            for group in org.groups.all():
                emails = list(group.emails.values_list('email', flat=True))
                groups_data.append({
                    "id": str(group.id),
                    "name": group.name,
                    "recipients": emails
                })
            data.append({
                "id": str(org.id),
                "name": org.name,
                "description": org.description or "",
                "groups": groups_data
            })
        return JsonResponse({"status": "success", "organisations": data})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)