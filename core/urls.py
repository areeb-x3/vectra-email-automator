from django.contrib.auth import views as auth_views
from django.urls import path
from django.shortcuts import redirect
from . import views

app_name = "core"

urlpatterns = [
    path("", lambda request: redirect("home/", permanent=False)),
    path("home/", views.home, name="home"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),
    path("signup/", views.signup_user, name="signup"),
]