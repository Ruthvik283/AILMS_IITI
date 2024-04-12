from django.contrib import admin
from .models import *
from django.contrib.auth import get_user_model
User = get_user_model()

admin.site.register(Material)
admin.site.register(Technician)
admin.site.register(Purchase)

# class SanctionAdmin(admin.ModelAdmin):
#     # readonly_fields = ['date_time']  # Add the date_time field to readonly_fields
#     fields = ['date_time', 'sanction_id', 'ticket_id', 'department', 'engineer_id', 'technician', 'material', 'quantity_sanctioned', 'log', 'closed']


class SanctionAdmin(admin.ModelAdmin):
    # Exclude date_time from fields
    exclude = ('date_time',)

    # Override get_readonly_fields method to include date_time
    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj)
        return readonly_fields + ['date_time']


admin.site.register(Sanction)
admin.site.register(Department)
admin.site.register(Category)
admin.site.register(Role)
admin.site.register(User)
admin.site.register(RegisterRequest)
admin.site.register(EmailVerificationCode)
