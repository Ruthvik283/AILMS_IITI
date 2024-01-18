from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()
from .serializers import *


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterAPI(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()


@api_view(['GET', 'POST'])
def getRoutes(request):
    routes = [
        '/api/token',
        'api/token/refresh'
    ]

    return Response(routes)

@api_view(['GET'])
def testData(request):
    items = User.objects.all()
    serializer = TestSerializer(items,many=True)
    return Response(serializer.data)
