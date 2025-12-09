# Importing modules
import json, os
from django.db import models
from django.contrib.auth.models import User
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from .models import GmailToken

class token_handler:
    # Generate Token
    @staticmethod
    def generate_token(user):
        flow = InstalledAppFlow.from_client_secrets_file(
            'credential.json',
            'https://www.googleapis.com/auth/gmail.send'
        )

        creds = flow.run_local_server(
            access_type='offline',
            prompt='consent'
        )

        GmailToken.objects.update_or_create(
        user=user,
        defaults={
            "token": creds.token,
            "refresh_token": creds.refresh_token or "",
            "client_id": creds.client_id,
            "client_secret": creds.client_secret,
            "expiry": creds.expiry.isoformat() if creds.expiry else ""
        })
    
    @staticmethod
    def fetch_token(user):
        token_obj = user.gmail_token
        
        return {
            "token": token_obj.token,
            "refresh_token": token_obj.refresh_token,
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_id": token_obj.client_id,
            "client_secret": token_obj.client_secret,
            "scopes": "https://www.googleapis.com/auth/gmail.send",
            "universe_domain": "googleapis.com",
            "account": "",
            "expiry": token_obj.expiry
        }
