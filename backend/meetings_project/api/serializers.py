from rest_framework import serializers
from .models import Meeting
from django.contrib.auth.models import User

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['id', 'agenda', 'status', 'date_of_meeting', 'start_time', 'meeting_url']
        # If owner is added to model and needs to be part of API:
        # fields = ['id', 'agenda', 'status', 'date_of_meeting', 'start_time', 'meeting_url', 'owner']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user