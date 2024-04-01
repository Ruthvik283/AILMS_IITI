from django.urls import path
from . import views
from .views import *

# --------

from rest_framework_simplejwt.views import (
    TokenRefreshView,

)

urlpatterns = [
    path('', views.getRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterAPI.as_view(), name='register'),
    path('test/', views.testData, name='test'),
    path('get_username/<int:id>',
         views.getUsernameById.as_view(), name='get_username'),
    path('get_department/<int:id>', views.departmentData, name='get_dept'),
    path('departments', views.departments_data, name='get_depts'),
    path('purchases/<str:start_date>/<str:end_date>/',
         PurchasesBetweenDates.as_view(), name='purchases-between-dates'),
    path('sanction/', views.sanction_material, name='sanction-material'),
    path('sanctions/', views.sanctionsData, name='sanction-data'),
    path('technicians/', views.techniciansData, name='technician-data'),
    path('sanctions/<int:sanct_id>',
         views.sanctionsDataId, name='sanction-data-id'),
    path('add_purchase/', views.purchase_material, name='purchase-material'),
    path('materials/', views.AllMaterials, name='all materials'),
    path('materials/<int:material_id>',
         views.MaterialbyID, name='material-by-id'),
    path('categories/<int:category_id>/related/',
         get_related_categories, name='related_categories'),
    path('belowCritical/', views.BelowCriticalQuantity,
         name='below critical quantity materials'),
    path('sendmail/', views.SendMail, name='send email'),
    path('create-category/', CategoryCreateView.as_view(), name='create-category'),
    path('create-material/', MaterialCreateView.as_view(), name='create-material'),
    path('modifysanction/', views.modify_sanction, name='modify-sanction'),
    path('create-department/', DepartmentCreateView.as_view(),
         name='create-department'),
    path('api_test/', views.test, name='apitest'),
    path('update_user/', views.update_user, name='update_user'),
    path('get_users/', views.get_users, name='get_users'),
    path('edit_material/', views.EditMaterial, name='edit-material'),
]
