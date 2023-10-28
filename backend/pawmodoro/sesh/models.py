from django.db import models
from django.core.validators import MinValueValidator


# Create your models here.
class User(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=20)
    experience = models.IntegerField()


class MusicTrack(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)


class Sesh(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    session_duration = models.IntegerField()
    expires_in = models.DateTimeField()
    status = models.CharField(max_length=20) #completed, pending, ongoing, terminated


class Task(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    task = models.CharField(max_length=100)
    sesh = models.ForeignKey(Sesh, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
