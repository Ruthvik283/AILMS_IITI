from datetime import datetime, timedelta
from rest_framework import serializers, status
from materials.models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from django.db import models
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import F
from django.core.mail import send_mail
from django.conf import settings
User = get_user_model()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
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
    serializer = UserSerializer(items, many=True)
    return Response(serializer.data)


class getUsernameById(APIView):
    def get(self, request, id):

        user = UserSerializer(User.objects.get(id=id))
        user_data = user.data
        # user_data['age']=30

        return Response(user_data)


@api_view(['GET', 'POST'])
def get_related_categories(request, category_id):
    # Retrieve the current category
    current_category = Category.objects.get(pk=category_id)
    related_categories = Category.objects.filter(
        parent_category=current_category)
    related_categories_data = list(related_categories.values())
    related_materials = Material.objects.filter(category=current_category)
    related_materials_data = list(related_materials.values())
    return Response({'related_categories': related_categories_data, 'related_materials': related_materials_data})


@api_view(['GET', 'POST'])
def departmentData(request, id):
    try:
        dept = Department.objects.get(id=id)
    except:
        raise NotFound("Department not found")
    # dept = Department.objects.get(id = id)
    users = dept.user_set.all()
    serializer = UserSerializer(users, many=True)
    res = {}
    sub_departments = Department.objects.filter(parentDepartment=dept)
    # sub_departments = dept.parentDepartment_set.all()
    res["department_name"] = dept.department_name
    res["sub_departments"] = DepartmentSerializer(
        sub_departments, many=True).data
    res["users"] = serializer.data
    return Response(res)


@api_view(['GET', 'POST'])
def AllMaterials(request):
    materials = MaterialSerializer(Material.objects.all(), many=True)
    return Response(materials.data)


@api_view(['GET', 'POST'])
def MaterialbyID(request, material_id):
    materials = MaterialSerializer(
        Material.objects.filter(material_id=material_id)[0])
    return Response(materials.data)


@api_view(['GET', 'POST'])
def BelowCriticalQuantity(request):
    # quantity__lt: This is a field lookup. It specifies that we're comparing the quantity field of the Material model.
    # F('critical_quantity'): This is a Django F() expression that references the critical_quantity field of the same model. F() expressions allow us to reference the values of model fields within queries.
    materials = MaterialSerializer(Material.objects.filter(
        quantity__lt=F('critical_quantity')), many=True)
    return Response(materials.data)


@api_view(['GET', 'POST'])
def SendMail(request):
    materials = Material.objects.all()  # Retrieve all materials

    # Iterate over materials and check if quantity is below critical level
    for material in materials:
        if material.quantity < material.critical_quantity:
            subject = f' {material.material_name}\'s Critical Quantity Alert'
            message = f'The quantity of {material.material_name} is below the critical level. Current quantity: {material.quantity}'
            from_email = settings.EMAIL_HOST_USER
            # Specify the recipient email address
            to_email = ['ailmsiiti123@gmail.com']
            send_mail(subject, message, from_email, to_email)

    return Response({'message': 'Emails sent for materials with critical quantity.'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def departments_data(request):
    try:
        departments = Department.objects.all()
    except Department.DoesNotExist:
        raise NotFound("Departments not found")

    department_data = []

    for department in departments:
        users = department.user_set.all()
        user_serializer = UserSerializer(users, many=True)
        department_data.append({
            "department_id": department.id,
            "department_name": department.department_name,
            "is_main": department.is_main,
            "sub_departments": DepartmentSerializer(Department.objects.filter(parentDepartment=department), many=True).data,
            "users": user_serializer.data,
        })

    return Response(department_data)


class PurchasesBetweenDates(APIView):
    def get(self, request, start_date, end_date):
        """
        settings.USE_TZ set to False to prevent 

        'RuntimeWarning: DateTimeField Purchase.date_time
        received a naive datetime (YYYY-MM-DD HH:MM:SS)
        while time zone support is active' 

        warning in API calls.

        Please fix this if you know how to...
        """

        if start_date == "NULL":
            start_date = "1970-01-01"

        if end_date == "NULL":
            end_date = datetime.now().date().__str__()

        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        purchases = Purchase.objects.filter(
            date_time__range=[start_date, end_date + timedelta(days=1)])
        serializer = PurchaseSerializer(purchases, many=True)
        # adding price to PurchaseData
        x = serializer.data
        z = 0
        for y in x:
            y["price"] = purchases[z].material.price
            y["material_name"] = purchases[z].material.material_name
            z += 1
            # y["price"] = 1
        return Response(x)


@api_view(['POST'])
def sanction_material(request):
    data = request.data

    try:
        sct = Sanction(
            ticket_id=data['ticket_id'],
            department=User.objects.filter(
                id=data['engineer_id'])[0].department,
            engineer_id=data['engineer_id'],
            technician_id=data['technician_id'],
            material=Material.objects.filter(
                material_id=data['material_id'])[0],
            quantity_sanctioned=int(data['quantity_sanctioned']),
        )

        is_valid = sct.is_valid()

        if (is_valid[0]):
            sct.save()
            return Response(
                {
                    "success": True
                }
            )

        return Response(
            {
                "success": False,
                "message": f"Amount of Material to be Sanctioned not available. (Requested {is_valid[2]}, available {is_valid[1]})"
            }
        )

    except Exception as e:
        print(e)
        return Response(
            {
                "error": "Invalid Sanction Details"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# @api_view(['POST'])
# def purchase_material(request):
#     try:
#         data = request.data

#         p = Purchase(
#             material=Material.objects.filter(
#                 material_id=data['material']).first(),
#             quantity_purchased=data['quantity_purchased'],
#             vendor_details=data['vendor_details']
#         )

#         """
#         (To be added) add feature to automatically handle
#         materials not yet present in models.Material
#         """

#         p.save()

#         return Response(
#             {
#                 "success": True
#             }
#         )
#     except Exception as e:
#         return Response(
#             {
#                 "success": False,
#                 "message": str(e)
#             }
#         )

class PurchaseAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = PurchaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def sanctionsData(request):
    res = SanctionSerializer(Sanction.objects.all(), many=True)

    return Response(res.data)


@api_view(['GET', 'POST'])
def sanctionsDataId(request, sanct_id):
    res = SanctionSerializer(Sanction.objects.filter(sanction_id=sanct_id)[0])
    return Response(res.data)


class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class MaterialCreateView(generics.CreateAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class DepartmentCreateView(generics.CreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


@api_view(['POST'])
def modify_sanction(request):
    data = request.data
    print(data)
    # return Response(
    #     {
    #         "success": True
    #     }
    # )
    quantity = data['quantity']
    sanction_id = data['sanct_id']
    type = data['type']

    sanct = Sanction.objects.filter(sanction_id=sanction_id)[0]

    if type == 'add':
        sanct.sanction_add(quantity)
    elif type == 'return':
        sanct.sanction_return(quantity)
    elif type == 'close':
        sanct.sanction_close()
    return Response(
        {
            "success": True
        }
    )
