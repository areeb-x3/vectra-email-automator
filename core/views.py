from core.bulk_sender import bulk_sender 

import csv, io,json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.serializers.json import DjangoJSONEncoder
from django.db import IntegrityError
from django.urls import reverse
from .models import Organisation, Group, GroupEmail, SentMail

def home(request):
    return render(request, "home.html")

def login_user(request):
    if request.user.is_authenticated:
        return redirect("/dashboard")

    if request.method == "POST":
        email = request.POST.get("loginEMail")
        password = request.POST.get("loginPassword")

        user = authenticate(request, username=email, password=password)
        if user is None:
            messages.error(request, "Invalid email or password")
            return redirect("/login/?show=login")

        login(request, user)
        return redirect("/dashboard/")

    return render(request, "login.html")

@login_required
def logout_user(request):
    # Accept POST (recommended) or GET (convenience)
    if request.method == "POST" or request.method == "GET":
        logout(request)
        return redirect("/login/")
    # fallback
    return redirect("/login/")

def signup_user(request):
    if request.method == "POST":
        first = request.POST.get("firstNameValue")
        last = request.POST.get("lastName")
        email = request.POST.get("signupEmail")
        password = request.POST.get("signupPassword")
        confirm = request.POST.get("confirmPassword")

        if password != confirm:
            messages.error(request, "Passwords do not match")
            return redirect("/login/?show=signup")
        
        if User.objects.filter(username=email).exists():
            messages.error(request, "Email already exists")
            return redirect("/login/?show=signup")
        
        try:
            User.objects.create_user(
                username=email,
                email=email,
                first_name=first,
                last_name=last,
                password=password
            )
        except:
            print("ERROR")
        return redirect("/login/?show=login")

    return render(request, "login.html")

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

        return redirect("core:dashboard_tab", tab="organisation")
        # I might write comments to explain the code in the future

# Modify Existing Organisation
@login_required
def modify_organisation(request):
    if request.method == "POST":
        org_id = request.POST.get("org_id")   # You need to send this hidden input
        org = get_object_or_404(Organisation, id=org_id)

        org.name = request.POST.get("name", "").strip()
        org.description = request.POST.get("description", "").strip()
        org.save()

    url = reverse("core:dashboard_tab", kwargs={"tab": "organisation"})
    url = f"{url}?popup=editOrganisationPopup&id={org_id}"
    return redirect(url)

# Delete an Organisation
@login_required
def delete_organisation(request):
    organisation = get_object_or_404(
        Organisation,
        id=organisation_id,
        user=request.user
    )

    if request.method == "POST":
        organisation.delete()
        return redirect("core:dashboard_tab", tab="organisation")

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
            messages.error(request, "Invalid organisation.")
            return redirect("core:dashboard")

        if Group.objects.filter(organisation=organisation, name=name).exists():
            messages.error(request, "A group with that name already exists.")
            return redirect("core:dashboard")

        group = Group.objects.create(
            organisation=organisation,
            name=name,
            description=None
        )
        if recipients_raw:
            emails = [e.strip() for e in recipients_raw.split(",") if e.strip()]

            for email in emails:
                if "@" in email:
                    parts = email.split("@")
                    if len(parts) == 2:
                        local, domain = parts
                        if local and domain and "." in domain and " " not in email:
                            GroupEmail.objects.create(group=group, email=email)

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
        messages.error(request, "Group not found.")
        return redirect("core:dashboard")

    group.delete()
    url = reverse("core:dashboard_tab", kwargs={"tab": "organisation"})
    url = f"{url}?popup=editOrganisationPopup&id={org_id}"
    return redirect(url)

# Compose Mail For Groups
@login_required
def send_bulk_mail(request):
    if request.method == "POST":
        subject = request.POST.get("subject")
        body = request.POST.get("body")
        group_ids = request.POST.getlist("group_ids")

        for group_id in group_ids:
            group = Group.objects.filter(id=group_id).first()
            if not group:
                continue

            recipients = list(group.emails.values_list("email", flat=True))

            bulk_sender.send_bulk_emails(request.user, recipients, subject, body)

            SentMail.objects.create(
                group=group,
                subject=subject,
                body=body,
                recipients=", ".join(recipients),
                sender=request.user
            )
        return redirect("core:dashboard_tab", tab="organisation")