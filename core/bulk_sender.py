# Importing modules
import base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
import os

class bulk_sender:
    # Generate Token
    @staticmethod
    def generate_token():
        flow = InstalledAppFlow.from_client_secrets_file(
            'credential.json',
            'https://www.googleapis.com/auth/gmail.send'
        )

        creds = flow.run_local_server(
            access_type='offline',
            prompt='consent'
        )

        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    # Delete Token
    @staticmethod
    def delete_token():
        if os.path.exists("token.json"):
            os.remove("token.json")
    
    # Load credentials
    @staticmethod
    def get_gmail_service():
        creds = Credentials.from_authorized_user_file("token.json", ["https://www.googleapis.com/auth/gmail.send"])
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
    def send_bulk_emails(cls, recipients, subject, body):
        cls.generate_token()
        service = cls.get_gmail_service()
        cls.delete_token()

        for r in recipients:
            msg = cls.create_message(r, subject, body)
            cls.send_email(service, "me", msg)
            print(f"Sent to {r}")