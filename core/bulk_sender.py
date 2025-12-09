# Importing modules
import base64, os
from django.contrib.auth.models import User
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from core.token_handler import token_handler

class bulk_sender:
    # Load credentials
    @staticmethod
    def get_gmail_service(token_data):
        creds = Credentials.from_authorized_user_info(
            token_data,
            scopes = ["https://www.googleapis.com/auth/gmail.send"]
        )
        service = build("gmail", "v1", credentials=creds)
        return service

    # Create email message
    @staticmethod
    def create_message(to, subject, body):
        msg = MIMEText(body)
        msg["to"] = to
        msg["from"] = " "
        msg["subject"] = subject
        raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
        return {"raw": raw}

    # Send email
    @staticmethod
    def send_email(service, user_id, message):
        return service.users().messages().send(userId=user_id, body=message).execute()
    
    # Bulk send
    @classmethod
    def send_bulk_emails(cls, user, recipients, subject, body):
        if not hasattr(user, "gmail_token"):
            token_handler.generate_token(user) 

        token_data = token_handler.fetch_token(user)
        service = cls.get_gmail_service(token_data)

        for r in recipients:
            msg = cls.create_message(r, subject, body)
            cls.send_email(service, "me", msg)
            print(f"Sent to {r}")