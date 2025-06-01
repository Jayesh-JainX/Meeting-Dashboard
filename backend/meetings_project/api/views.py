from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Meeting
from .serializers import MeetingSerializer, UserSerializer

class MeetingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows meetings to be viewed or edited.
    """
    queryset = Meeting.objects.all().order_by('-date_of_meeting', '-start_time')
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated] # Require authentication for meeting operations

    # If you want to associate meetings with the logged-in user:
    # def get_queryset(self):
    #     return Meeting.objects.filter(owner=self.request.user).order_by('-date_of_meeting', '-start_time')

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # Anyone can register

@api_view(['POST'])
@permission_classes([AllowAny]) # Anyone can attempt to login
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Login successful', 'user_id': user.id, 'username': user.username})
    else:
        return Response({'error': 'Invalid Credentials'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated]) # Only authenticated users can logout
def logout_view(request):
    logout(request)
    return Response({'message': 'Logout successful'})