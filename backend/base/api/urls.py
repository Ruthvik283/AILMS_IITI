from django.urls import path
from . import views
from .views import *

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
]
