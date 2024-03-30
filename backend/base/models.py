from django.db import models

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AbstractUser, Group, Permission
# from materials.models import Department

# from django.db import models

# class BaseUser(AbstractUser):
#     # Your other fields and methods here
#     base_groups = models.ManyToManyField(Group, related_name='base_user_set')
#     base_user_permissions = models.ManyToManyField(Permission, related_name='base_user_set_permissions')

# class User(BaseUser):
#     # Your other fields and methods here
#     user_groups = models.ManyToManyField(Group, related_name='user_set')
#     user_user_permissions = models.ManyToManyField(Permission, related_name='user_set_permissions')


class User(AbstractUser):

    # from materials.models import Department
    
    department = models.ForeignKey('materials.Department', on_delete=models.CASCADE, null=True, blank=True)
    role = models.ForeignKey('materials.Role', on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    def __str__(self):
        return self.username

    # ROLE_CHOICES = (
    #     ('administrator', 'Administrator'),
    #     ('technician', 'Tecnician'),
    #     ('engineer', 'Engineer'),
    #     ('student', 'Student'),
    # )

    # role = models.OneToOneField(
    #     Role,
    #     on_delete=models.CASCADE,
    #     default=None,
    #     null=True,
    # )
    
    
    # role = models.ForeignKey(Role, on_delete=models.SET_NULL)
    # department=models.ForeignKey()
