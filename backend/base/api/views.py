from django.core.exceptions import ObjectDoesNotExist
from django.template.loader import render_to_string
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
from rest_framework import serializers, status
from materials.models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from django.db import models
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import F
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponse, FileResponse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.shortcuts import render
from django.template import Context, Engine
from django.core.mail import EmailMultiAlternatives
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
User = get_user_model()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
        return token

    # def validate(self, attrs):
    #     data = super().validate(attrs)
    #     email = attrs.get("email", None)
    #     if email:
    #         data["email"] = email
    #     return data


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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def testData(request):
    items = User.objects.all()
    serializer = UserSerializer(items, many=True)
    return Response(serializer.data)


class getUsernameById(APIView):
    def get(self, request, id):
        try:
            x = User.objects.get(id=id)
        except User.DoesNotExist:
            raise NotFound("User not found")

        user = UserSerializer(x)
        user_data = user.data
        dept = x.department

        if dept is None:
            return Response({"detail": "User does not have a department"}, status=status.HTTP_400_BAD_REQUEST)

        res = {}
        sub_departments = Department.objects.filter(parentDepartment=dept)
        res["id"] = dept.id
        res["department_name"] = dept.department_name
        res["sub_departments"] = DepartmentSerializer(
            sub_departments, many=True).data
        user_data['department'] = res
        user_data['role'] = user_data['role_name']
        user_data.pop("password")
        user_data.pop("role_name")

        return Response(user_data)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_related_categories(request, category_id):
    # Retrieve the current category
    current_category = Category.objects.get(pk=category_id)
    related_categories = Category.objects.filter(
        parent_category=current_category)
    related_categories_data = list(related_categories.values())
    # related_materials = Material.objects.filter(category=current_category)
    related_materials_data = MaterialSerializer(
        Material.objects.filter(category=current_category), many=True).data
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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def AllMaterials(request):
    materials = MaterialSerializer(Material.objects.all(), many=True)
    return Response(materials.data)


@api_view(['GET', 'POST'])
def MaterialbyID(request, material_id):
    materials = MaterialSerializer(
        Material.objects.filter(material_id=material_id)[0])
    return Response(materials.data)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def EditMaterial(request):
    try:
        data = request.data
        required_fields = ['material_id', 'material_name',
                           'price', 'quantity_A', 'quantity_B', 'critical_quantity']
        for field in required_fields:
            if field not in data:
                return Response({"error": f"Field '{field}' is required."}, status=status.HTTP_400_BAD_REQUEST)

        mat_id = data['material_id']
        obj = Material.objects.filter(material_id=mat_id).first()
        if obj is None:
            return Response({"error": "Material not found."}, status=status.HTTP_404_NOT_FOUND)

        # Handling category field
        category_id = data.get('category')  # Get category ID from request data
        if category_id is not None:
            # Check if the provided category ID exists
            category = Category.objects.filter(id=category_id).first()
            if category is None:
                return Response({"error": "Invalid category ID."}, status=status.HTTP_400_BAD_REQUEST)
            obj.category = category
        else:
            # If category field is not provided, set it to None
            obj.category = None

        # Update other fields
        for field, value in data.items():
            if field not in ['material_id', 'category']:
                setattr(obj, field, value)

        obj.save()

        return Response({"success": True})

    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def SendMail(request):
    # materials = Material.objects.all()  # Retrieve all materials
    data = request.data
    # Check if 'selected_materials' and 'email' keys exist in the data
    if 'selected_materials' not in data or 'email' not in data:
        return Response({'message': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    # Filter materials with critical quantity
    critical_materials = []
    # for x in data["selected_materials"]:
    #     material=Material.objects.get(material_id=x)
    #     if material.quantity<=material.critical_quantity:
    #         critical_materials.append(material)
    try:
        for material_id in data["selected_materials"]:
            material = Material.objects.get(material_id=material_id)
            if material.quantity <= material.critical_quantity:
                critical_materials.append(material)
    except Material.DoesNotExist:
        return Response({'message': 'One or more materials not found.'}, status=status.HTTP_404_NOT_FOUND)

    if critical_materials:
        subject = "Critical Quantity Alert for Materials"
        from_email = settings.EMAIL_HOST_USER
        to_email = [data["email"]]

        # Define the HTML content as a string
        html_content = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Critical Quantity Alert for Materials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Critical Quantity Alert for Materials</h1>
        <table>
            <thead>
                <tr>
                    <th>Material Name</th>
                    <th>Current Quantity</th>
                    <th>Critical Quantity</th>
                </tr>
            </thead>
            <tbody>
                {% for material in critical_materials %}
                <tr>
                    <td>{{ material.material_name }}</td>
                    <td>{{ material.quantity }}</td>
                    <td>{{ material.critical_quantity }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
    </div>
</body>
</html>
"""

        # Render the HTML content with the material data
        engine = Engine.get_default()
        context = Context({
            'critical_materials': critical_materials,
        })
        rendered_html = engine.from_string(html_content).render(context)

        # Create the email message with HTML content
        email = EmailMultiAlternatives(
            subject,
            rendered_html,
            from_email,
            to_email,
        )
        email.attach_alternative(rendered_html, "text/html")
        email.send()

        return Response({'message': 'Email sent for materials with critical quantity.'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'No materials with critical quantity.'}, status=status.HTTP_200_OK)


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
        parent_department = None
        parent_department_name = None

        if department.is_main == False:
            parent_department = department.parentDepartment.id
            parent_department_name = department.parentDepartment.department_name

        department_data.append({
            "department_id": department.id,
            "id": department.id,
            "parent_department": parent_department,
            "parent_department_name": parent_department_name,
            "department_name": department.department_name,
            "is_main": department.is_main,
            "sub_departments": DepartmentSerializer(Department.objects.filter(parentDepartment=department), many=True).data,
            "users": user_serializer.data,
        })

    return Response(department_data)


class PurchasesBetweenDates(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, start_date, end_date):
        purchases = Purchase.objects.all()
        serializer = PurchaseSerializer(purchases, many=True)
        # print(serializer)
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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def sanction_material(request):
    data_list = request.data
    # print(data_list)

    invalid_sanctions = []
    valid_sanctions = []

    for data in data_list:
        if data['ticket_id'] == "":
            ticket1 = 0
        else:
            ticket1 = data['ticket_id']

        try:
            department_obj = Department.objects.get(id=int(data["department"]))
            technician_obj = Technician.objects.get(id=data['technician_id'])
            material_obj = Material.objects.get(
                material_id=data['material_id'])

            sct = Sanction(
                ticket_id=ticket1,
                description=data['description'],
                department=department_obj,
                engineer_id=data['engineer_id'],
                technician=technician_obj,
                material=material_obj,
                quantity_sanctioned=int(data['quantity_sanctioned']),
                sanct_type=data['sanct_type']
            )

            is_valid = sct.is_valid()

            if is_valid[0]:
                valid_sanctions.append(sct)
            else:
                invalid_sanctions.append({
                    "data": data,
                    "message": f"Amount of Material to be Sanctioned not available. (Requested {is_valid[1]}, available {is_valid[2]})"
                })

        except ObjectDoesNotExist as e:
            invalid_sanctions.append({
                "data": data,
                "error": str(e)
            })

        except Exception as e:
            print(e)
            invalid_sanctions.append({
                "data": data,
                "error": "Invalid Sanction Details"
            })

    if invalid_sanctions:
        return Response(
            {
                "success": False,
                "invalid_sanctions": invalid_sanctions
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    # print(valid_sanctions)
    for sct in valid_sanctions:
        sct.save()

    return Response(
        {
            "success": True,
            "message": "All valid sanctions saved successfully"
        }
    )


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def purchase_material(request):
    # print(request.data)
    try:
        data = request.data

        # print(data['material_id'])
        # print(data['quantity_purchased'])
        # print(data['vendor_details'])
        # print(data['purchase_type'])

        p = Purchase(
            material=Material.objects.filter(
                material_id=int(data['material_id'])).first(),
            quantity_purchased=int(data['quantity_purchased']),
            vendor_details=data['vendor_details'],
            purchase_type=data['purchase_type'],
        )
        # print(p.purchase_type)

        """
        (To be added) add feature to automatically handle
        materials not yet present in models.Material
        """

        p.save()
        p.pdf_file = request.FILES['invoice_pdf']
        p.raw_save()
        print(p.purchase_id)

        return Response(
            {
                "success": True
            }
        )
    except Exception as e:
        print(e)
        return Response(
            {
                "success": False,
                "message": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

# class PurchaseAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request, *args, **kwargs):
#         serializer = PurchaseSerializer(data=request.data)
#         if serializer.is_valid():
#             print("here")
#             serializer.save()
#         else:
#             print(serializer.errors)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def sanctionsData(request):

    data = request.data
    if (data["role"] == "Manager"):
        res = SanctionSerializer(Sanction.objects.all(), many=True)
        return Response(res.data if res else [])
    else:
        res = SanctionSerializer(
            Sanction.objects.filter(engineer_id=data["id"]), many=True)
        return Response(res.data if res else [])


@api_view(['GET', 'POST'])
def sanctionsDataId(request, sanct_id):
    res = SanctionSerializer(Sanction.objects.filter(sanction_id=sanct_id)[0])
    return Response(res.data)


class CategoryCreateView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def techniciansData(request):
    techs = Technician.objects.all()
    return Response(TechnicianSerializer(techs, many=True).data)


class MaterialCreateView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


# class DepartmentCreateView(generics.CreateAPIView):
#     queryset = Department.objects.all()
#     serializer_class = DepartmentSerializer


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def modify_sanction(request):
    try:
        data = request.data
        quantity = data['quantity']
        sanction_id = data['sanct_id']
        type = data['type']
        to_type = data['to_type']

        print(data)

        sanct = Sanction.objects.filter(sanction_id=sanction_id)[0]
        # print(sanct)
        succ = True
        if type == 'add':
            succ = succ and sanct.sanction_add(quantity)
        elif type == 'return':
            succ = succ and sanct.sanction_return(quantity, to_type)
        elif type == 'close':
            succ = succ and sanct.sanction_close()
        if succ:
            return Response(
                {
                    "success": True
                }
            )
        else:
            print("Insufficient materials")
            return Response(
                {
                    "success": False
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    except:
        return Response({"success": False, "message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)


@xframe_options_exempt
@api_view(['GET', 'POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def PurchasePDF(request, purchase_id):
    try:
        try:
            filename = f"purchase_{purchase_id}"
            pdf = open(f"files/{filename}.pdf", "rb")
        except:
            return HttpResponse("<h1>PDF not found</h1>", status=status.HTTP_404_NOT_FOUND)
        response = FileResponse(
            pdf, content_type='application/pdf', filename=f"{filename}.pdf")
        response['Content-Disposition'] = f"inline; filename={filename}.pdf"
        return response
    except Exception as e:
        return Response({"success": False}, status=status.HTTP_404_NOT_FOUND)


def test(request):
    pdf = open("files/bill.pdf", "rb")
    response = FileResponse(
        pdf, content_type='application/pdf', filename='bill.pdf')
    response['Content-Disposition'] = 'inline; filename=bill.pdf'
    return response


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request):
    data = request.data
    pk = data.get('id')
    if pk is None:
        return Response({"error": "User ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user.username = data.get('username', user.username)
    # user.email = data['email']
    new_email = data.get('email')
    if new_email is not None and new_email != user.email:
        if User.objects.filter(email=new_email).exclude(pk=pk).exists():
            print(UserSerializer(User.objects.filter(
                email=new_email).exclude(pk=pk), many=True).data)
            return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user.email = new_email
    department_id = data.get('department')
    if department_id is not None:
        try:
            user.department = Department.objects.get(id=department_id)
        except Department.DoesNotExist:
            return Response({"error": "Department not found"}, status=status.HTTP_400_BAD_REQUEST)

    role_id = data.get('role')
    if role_id is not None:
        try:
            user.role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return Response({"error": "Role not found"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user.save()
    except ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"success": True})


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data)


@api_view(['GET'])
def get_roles(request):
    roles = Role.objects.all()
    return Response(RoleSerializer(roles, many=True).data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_registerRequests(request):
    reqs = RegisterRequest.objects.all()
    return Response(RegisterRequestSerializer(reqs, many=True).data)


@api_view(['POST'])
def add_register_request(request):
    if request.method == 'POST':
        serializer = RegisterRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def edit_register_request(request):
    try:
        pk = request.data.get('id')
        register_request = RegisterRequest.objects.get(pk=pk)
    except RegisterRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        serializer = RegisterRequestSerializer(
            register_request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_register_request(request, pk):
    try:
        register_request = RegisterRequest.objects.get(pk=pk)
    except RegisterRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        register_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_department(request):
    department_name = request.data.get('department_name')
    is_main = request.data.get('is_main')
    parent_department_id = None
    if not is_main:
        parent_department_id = request.data.get('parent_department')
    if is_main is False and parent_department_id is None:
        return Response({"error": "non main depts parent id is required"}, status=status.HTTP_400_BAD_REQUEST)

    if department_name is None and is_main is False:
        return Response({"error": "Department name is required for non-main departments"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        parent_department = Department.objects.get(pk=parent_department_id)
    except Department.DoesNotExist:
        parent_department = None

    new_department = Department(
        department_name=department_name,
        is_main=is_main,
        parentDepartment=parent_department
    )
    new_department.save()

    return Response({"message": "Department added successfully", "data": DepartmentSerializer(new_department).data}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def edit_department(request):
    # department_id = request.data.get('department_id')
    department_id = request.data.get('id')
    department_name = request.data.get('department_name')
    is_main = request.data.get('is_main')
    parent_department_id = None
    if not is_main:
        parent_department_id = int(request.data.get('parent_department'))

    if is_main is False and parent_department_id is None:
        return Response({"error": "non main depts parent id is required"}, status=status.HTTP_400_BAD_REQUEST)

    if department_id is None:
        return Response({"error": "Department ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        department = Department.objects.get(pk=department_id)
    except Department.DoesNotExist:
        return Response({"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND)

    if department_name is not None:
        department.department_name = department_name
    if is_main is not None:
        department.is_main = is_main
    if not department.is_main:
        try:
            parent_department = Department.objects.get(pk=parent_department_id)
            department.parentDepartment = parent_department
        except Department.DoesNotExist:
            return Response({"error": "Parent department not found"}, status=status.HTTP_404_NOT_FOUND)

    department.save()

    return Response({"message": "Department updated successfully", "data": DepartmentSerializer(department).data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_technician(request):
    try:
        serializer = TechnicianSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def edit_technician(request, pk):
    try:
        technician = Technician.objects.get(pk=pk)
        serializer = TechnicianSerializer(technician, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Technician.DoesNotExist:
        return Response({'error': 'Technician does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_technician(request, pk):
    try:
        technician = Technician.objects.get(pk=pk)
        print(technician)
        technician.delete()
        return Response({'message': 'Technician deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Technician.DoesNotExist:
        return Response({'error': 'Technician does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print({'error': str(e)})
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# emailverification/views.py

# @api_view(['POST'])
# def SendVerificationEmailView(request):
#     email

@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def send_verification_email(request):

    data = request.data

    if 'email' not in data:
        return Response({'detail': 'Email field is missing'}, status=status.HTTP_400_BAD_REQUEST)

    email = data['email']

    if not email:
        return Response({'detail': 'Email field is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        model_instance = EmailVerificationCode.objects.get(email=email)
        model_instance.code = secrets.randbelow(899999)+100000
        model_instance.save()
    except EmailVerificationCode.DoesNotExist:
        model_instance = EmailVerificationCode(email=email)
        model_instance.save()

        # Create the email message
    message = f"Your email verification code is: {model_instance.code}"

    # Send the verification email
    send_mail(
        'Email Verification',
        message,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )

    return Response({'detail': f'Verification email sent to {email}'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def verify_email(request):
    if request.method == 'POST':
        data = request.data
        # print("here",data)
        email = data.get('email', '')
        code = data.get('code', '')

        # Check if email and code are provided
        if not email or not code:
            return Response({'detail': 'Email and code fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email and code match in the database
        try:
            verification_entry = EmailVerificationCode.objects.get(
                email=email, code=code)
            verification_entry.delete()  # Optionally, you can delete the entry after verification
            return Response({'detail': 'Email verified successfully'}, status=status.HTTP_200_OK)
        except EmailVerificationCode.DoesNotExist:
            return Response({'detail': 'Invalid email or code'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def editPurchasePDF(request):
    data = request.data
    purchase_id = data["purchase_id"]
    pdf = request.FILES["invoice_pdf"]
    # print(request.FILES)
    # print(data)
    # return Response(status=status.HTTP_200_OK)
    try:
        obj = Purchase.objects.filter(purchase_id=purchase_id)[0]
        obj.pdf_file = pdf
        obj.raw_save()
        return Response({
            "success": True
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response(
            {
                "message": "Invalid Details"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def change_password(request):
    try:
        print(request.data)
        user_id = request.data['user_id']
        old_password = request.data['oldPassword']
        new_password = request.data['newPassword']

        usr = User.objects.get(id = user_id)
        
        if not usr.check_password(old_password):
            return Response(
                {
                    "success" : False,
                }
                , status=status.HTTP_401_UNAUTHORIZED
            )
        
        usr.set_password(new_password)
        usr.save()

        return Response(
            {
                "success" : True
            }
        )
    
    except Exception as e:
        print(e)

        return Response(
            {
                "success" : False,
            },
            status=status.HTTP_400_BAD_REQUEST
        )