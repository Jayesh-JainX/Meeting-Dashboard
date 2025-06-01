from django.contrib import admin
from .models import Meeting

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('agenda', 'status', 'date_of_meeting', 'start_time', 'meeting_url')
    list_filter = ('status', 'date_of_meeting')
    search_fields = ('agenda', 'meeting_url')