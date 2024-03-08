from django.contrib import admin
from .models import *
from django.contrib.auth import get_user_model
User = get_user_model()

admin.site.register(Material)
admin.site.register(Purchase)
admin.site.register(Sanction)
admin.site.register(Department)
admin.site.register(Category)
admin.site.register(Role)
admin.site.register(User)
