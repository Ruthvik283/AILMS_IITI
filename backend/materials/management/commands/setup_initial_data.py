# myapp/management/commands/setup_initial_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from materials.models import *

class Command(BaseCommand):
    help = 'Create initial Department and Category, and assign admin to Default department'

    def handle(self, *args, **options):
        # Create or get the Default department
        default_department, created_dept = Department.objects.get_or_create(department_name="Default",is_main=True)
        if created_dept:
            self.stdout.write(self.style.SUCCESS('Created Department: Default'))
        else:
            self.stdout.write(self.style.WARNING('Department "Default" already exists'))

        # Create or get the All Materials category
        all_materials_category, created_cat = Category.objects.get_or_create(category_name="All Materials")
        if created_cat:
            self.stdout.write(self.style.SUCCESS('Created Category: All Materials'))
        else:
            self.stdout.write(self.style.WARNING('Category "All Materials" already exists'))

        # Create or get the Manager role
        manager_role, created_manager_role = Role.objects.get_or_create(role_name="Manager")
        if created_manager_role:
            self.stdout.write(self.style.SUCCESS('Created Role: Manager'))
        else:
            self.stdout.write(self.style.WARNING('Role "Manager" already exists'))

        # Create or get the Engineer role
        engineer_role, created_engineer_role = Role.objects.get_or_create(role_name="Engineer")
        if created_engineer_role:
            self.stdout.write(self.style.SUCCESS('Created Role: Engineer'))
        else:
            self.stdout.write(self.style.WARNING('Role "Engineer" already exists'))

        # Get the admin user
        User = get_user_model()
        try:
            admin_user = User.objects.get(is_superuser=True)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Admin user not found. Please ensure an admin user exists with email admin@example.com'))
            return

        # Assign the admin user to the Default department
        admin_user.department = default_department
        admin_user.role = manager_role
        admin_user.save()
        self.stdout.write(self.style.SUCCESS(f'Assigned admin user {admin_user.email} to Default department'))
