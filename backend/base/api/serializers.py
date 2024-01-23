from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
from materials.models import *
class UserSerializer(serializers.ModelSerializer):
    
    department_name = serializers.SerializerMethodField()
    class Meta: 
        model = User
        fields = ['id','username', 'email','department_name']
    
    def get_department_name(self, obj):
        return obj.department.department_name if obj.department else None

    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user 

    
class MaterialSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['id','username', 'email', 'password']

    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user 

class PurchaseSerializer(serializers.ModelSerializer):
    material_name = serializers.SerializerMethodField()

    class Meta:
        model = Purchase
        fields = ['purchase_id', 'material', 'quantity_purchased', 'vendor_details', 'date_time', 'material_name']

    def get_material_name(self, obj):
        return obj.material.material_name if obj.material else None
    