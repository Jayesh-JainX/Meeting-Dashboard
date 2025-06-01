from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeetingViewSet, UserCreateView, login_view, logout_view

router = DefaultRouter()
router.register(r'meetings', MeetingViewSet, basename='meeting')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserCreateView.as_view(), name='user-register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
]