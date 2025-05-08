from django.db import models

# Create your models here.

class Task(models.Model):
    title = models.charField(max_length=255)
    duration = models.IntegerField(default=25)
    completed = models.BooleanField(default=false)
    created_at = models.DateTimeField(auto_now_add=True)