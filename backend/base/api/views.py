from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from django.db import models
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
User = get_user_model()
from .serializers import *
from datetime import datetime,timedelta
from materials.models import *
from rest_framework import serializers, status


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
    serializer = UserSerializer(items,many=True)
    return Response(serializer.data)

class getUsernameById(APIView):
    def get(self,request,id):
       
      
        user = UserSerializer(User.objects.get(id = id))
        user_data=user.data
        # user_data['age']=30
 
        return Response(user_data) 
    
@api_view(['GET','POST'])
def departmentData(request,id):
    try:
        dept = Department.objects.get(id = id)
    except:
        raise NotFound("Department not found")
    # dept = Department.objects.get(id = id)
    users=dept.user_set.all() 
    serializer = UserSerializer(users,many=True)
    res={}
    res["users"] = serializer.data
    res["department_name"]=dept.department_name
    return Response(res)

class PurchasesBetweenDates(APIView):
    def get(self, request, start_date, end_date):
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        purchases = Purchase.objects.filter(date_time__range=[start_date, end_date + timedelta(days=1)])
        serializer = PurchaseSerializer(purchases, many=True)

        return Response(serializer.data)



