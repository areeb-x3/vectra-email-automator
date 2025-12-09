from django.db import models
from django.contrib.auth.models import User


class Organisation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'name')

    def __str__(self):
        return self.name


class Group(models.Model):
    organisation = models.ForeignKey(
        Organisation,
        on_delete=models.CASCADE,
        related_name='groups',
        null=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('organisation', 'name')

    def __str__(self):
        return self.name


class GroupEmail(models.Model):
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='emails'
    )
    email = models.EmailField()

    class Meta:
        unique_together = ('group', 'email')

    def __str__(self):
        return self.email

class SentMail(models.Model):
    group = models.ForeignKey('Group', on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    recipients = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} ({self.group.name})"

class GmailToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="gmail_token")
    token = models.TextField()
    refresh_token = models.TextField()
    client_id = models.CharField(max_length=255)
    client_secret = models.CharField(max_length=255)
    expiry = models.CharField(max_length=255)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Gmail Token for {self.user.username}"