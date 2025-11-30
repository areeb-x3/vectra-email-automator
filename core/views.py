from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required

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
def dashboard(request):
    avatar = request.user.first_name[0].upper() + request.user.last_name[0].upper()
    full_name = request.user.first_name + request.user.last_name
    return render(request, "dashboard.html", {"full_name": full_name, "avatar": avatar})