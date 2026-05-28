from django.urls import path
from . import views

app_name = 'org_manager'

urlpatterns = [
    # Organisation list URL
    path("organisations/", views.get_organisations, name="get_organisations"),

    # Organisation URLs
    path("create-organisation/", views.create_organisation, name="create_organisation"),
    path("modify-organisation/", views.modify_organisation, name="modify_organisation"),
    path("delete-organisation/", views.delete_organisation, name="delete_organisation"),
    
    # Group URLs
    path("create-group/", views.create_group, name="create_group"),
    path("modify-group/", views.modify_group, name="modify_group"),
    path("delete-group/", views.delete_group, name="delete_group"),
]