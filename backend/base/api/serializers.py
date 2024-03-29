from materials.models import *
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    department_name = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'department_name', 'role_name', 'password']

    def get_department_name(self, obj):
        return obj.department.department_name if obj.department else None

    def get_role_name(self, obj):
        return obj.role.role_name if obj.role else None

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class PurchaseSerializer(serializers.ModelSerializer):
    material_name = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Purchase
        fields = ['purchase_id', 'material', 'quantity_purchased',
                  'vendor_details', 'date_time', 'material_name', 'price']

    def get_material_name(self, obj):
        return obj.material.material_name if obj.material else None

    def get_price(self, obj):
        return obj.material.price if obj.material else None


class SanctionSerializer(serializers.ModelSerializer):

    material_name = serializers.SerializerMethodField()
    engineer_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    log = serializers.SerializerMethodField()

    class Meta:
        model = Sanction
        fields = [
            "sanction_id",
            "ticket_id",
            "department",
            "department_name",
            "engineer_id",
            "engineer_name",
            "technician_id",
            "material",
            "date_time",
            "quantity_sanctioned",
            "material_name",
            "price",
            "log",
            "closed"
        ]

    def get_material_name(self, obj):
        return obj.material.material_name if obj.material else None

    def get_engineer_name(self, obj):
        return User.objects.filter(id=obj.engineer_id)[0].get_username() if obj.engineer_id else None
    
    def get_department_name(self, obj):
        return obj.department.department_name if obj.department else None
    
    def get_price(self, obj):
        return obj.material.price if obj.material else None

    def get_log(self, obj):
        return obj.log


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ['purchase_id', 'material', 'quantity_purchased',
                  'vendor_details', 'pdf_file', 'date_time']
        read_only_fields = ['purchase_id', 'date_time']
