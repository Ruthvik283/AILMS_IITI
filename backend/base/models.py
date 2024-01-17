from django.db import models

# from django.db import models
# from django.contrib.auth.models import AbstractUser
# from django.conf import settings
# from rest_framework.authtoken.models import Token
# from django.contrib.auth.models import AbstractUser, Group, Permission
# #from django.db import models

# class BaseUser(AbstractUser):
#     # Your other fields and methods here
#     base_groups = models.ManyToManyField(Group, related_name='base_user_set')
#     base_user_permissions = models.ManyToManyField(Permission, related_name='base_user_set_permissions')

# class User(BaseUser):
#     # Your other fields and methods here
#     user_groups = models.ManyToManyField(Group, related_name='user_set')
#     user_user_permissions = models.ManyToManyField(Permission, related_name='user_set_permissions')


# class User(AbstractUser):
#     ROLE_CHOICES = (
#         ('administrator', 'Administrator'),
#         ('teacher', 'Teacher'),
#         ('student', 'Student'),
#         ('staff', 'Staff'),
#     )

#     role = models.CharField(max_length=15, choices=ROLE_CHOICES)
