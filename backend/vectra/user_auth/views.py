from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import json


# Create your views here.
@csrf_exempt
def login_user(request):
    if request.user.is_authenticated:
        if request.content_type == 'application/json':
            return JsonResponse({
                "status": "success",
                "user": {
                    "id": request.user.id,
                    "email": request.user.email,
                    "first_name": request.user.first_name,
                    "last_name": request.user.last_name
                }
            })
        return redirect("/dashboard")

    if request.method == "POST":
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                email = data.get("email")
                password = data.get("password")
            except Exception:
                return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        else:
            email = request.POST.get("loginEMail")
            password = request.POST.get("loginPassword")

        user = authenticate(request, username=email, password=password)
        if user is None:
            if request.content_type == 'application/json':
                return JsonResponse({"status": "error", "message": "Invalid email or password"}, status=400)
            messages.error(request, "Invalid email or password")
            return redirect("/login/?show=login")

        login(request, user)
        if request.content_type == 'application/json':
            return JsonResponse({
                "status": "success",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            })
        return redirect("/dashboard/")

    return render(request, "login.html")


@csrf_exempt
@login_required
def logout_user(request):
    # Accept POST (recommended) or GET (convenience)
    if request.method == "POST" or request.method == "GET":
        logout(request)
        if request.content_type == 'application/json':
            return JsonResponse({"status": "success", "message": "Logged out successfully"})
        return redirect("/login/")
    # fallback
    return redirect("/login/")


@csrf_exempt
def signup_user(request):
    if request.method == "POST":
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                first = data.get("firstName")
                last = data.get("lastName")
                email = data.get("email")
                password = data.get("password")
                confirm = data.get("confirmPassword")
            except Exception:
                return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        else:
            first = request.POST.get("firstNameValue")
            last = request.POST.get("lastName")
            email = request.POST.get("signupEmail")
            password = request.POST.get("signupPassword")
            confirm = request.POST.get("confirmPassword")

        if password != confirm:
            if request.content_type == 'application/json':
                return JsonResponse({"status": "error", "message": "Passwords do not match"}, status=400)
            messages.error(request, "Passwords do not match")
            return redirect("/login/?show=signup")
        
        if User.objects.filter(username=email).exists():
            if request.content_type == 'application/json':
                return JsonResponse({"status": "error", "message": "Email already exists"}, status=400)
            messages.error(request, "Email already exists")
            return redirect("/login/?show=signup")
        
        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=first,
                last_name=last,
                password=password
            )
            if request.content_type == 'application/json':
                login(request, user) # Automatically login after signup
                return JsonResponse({
                    "status": "success",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    }
                })
        except Exception as e:
            if request.content_type == 'application/json':
                return JsonResponse({"status": "error", "message": str(e)}, status=500)
            print("ERROR")
        return redirect("/login/?show=login")

    return render(request, "login.html")


@ensure_csrf_cookie
def get_current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "status": "success",
            "user": {
                "id": request.user.id,
                "email": request.user.email,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name
            }
        })
    return JsonResponse({"status": "anonymous", "user": None})
