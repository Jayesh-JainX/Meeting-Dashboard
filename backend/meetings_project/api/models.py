from django.db import models
from django.contrib.auth.models import User

class Meeting(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('in_review', 'In Review'),
        ('cancelled', 'Cancelled'),
        ('overdue', 'Overdue'),
        ('published', 'Published'),
        # Add other statuses as needed from the design
    ]

    agenda = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    date_of_meeting = models.DateField()
    start_time = models.TimeField()
    meeting_url = models.URLField(max_length=200)
    # owner = models.ForeignKey(User, related_name='meetings', on_delete=models.CASCADE, null=True, blank=True) # Optional: if we want to associate meetings with users

    def __str__(self):
        return self.agenda