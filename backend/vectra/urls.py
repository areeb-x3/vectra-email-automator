from django.contrib import admin
from django.urls import path, include
from .core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # Homepage and Dashboard URLs
    path('', include('vectra.core.urls')),
    # User Authentication And Management URLs
    path('', include('vectra.user_auth.urls')),
    # Organisation Management URLs
    path('', include('vectra.org_manager.urls')),
    # Email Handling URLs
    path('', include('vectra.email_handler.urls')),
    # Schedular URLs
    path('', include('vectra.schedular.urls')),
    # Forum URLs
    path('', include('vectra.forum.urls')),
    
    # React SPA API Routing (mirrors root routes under /api/ prefix)
    path('api/', include('vectra.user_auth.urls')),
    path('api/', include('vectra.org_manager.urls')),
    path('api/', include('vectra.email_handler.urls')),
    path('api/', include('vectra.schedular.urls')),
    path('api/', include('vectra.forum.urls')),
    
    # React SPA Routing (serves the built React app index.html)
    path('app/', views.serve_react, name='react_app'),
    path('app/<path:path>', views.serve_react, name='react_app_subpath'),
]
