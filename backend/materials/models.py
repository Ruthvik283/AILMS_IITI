import secrets
import os
from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model
from picklefield.fields import PickledObjectField
from datetime import datetime
User = get_user_model()


def pdf_path(instance, filename):
    path = f'files/purchase_{instance.purchase_id}.pdf'
    if os.path.exists(path):
        os.remove(path)
    return f'files/purchase_{instance.purchase_id}.pdf'

# Create your models here.


class Category(models.Model):
    category_name = models.CharField(max_length=128)
    parent_category = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.category_name


class Material(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, related_name='materials', null=True, blank=True)
    material_id = models.AutoField(primary_key=True)
    material_name = models.CharField(max_length=255, default="Un-named")
    price = models.IntegerField(null=False)
    critical_quantity = models.IntegerField(null=False, default=5)
    rack_number = models.CharField(max_length=255, null=True, blank=True)
    row_number = models.CharField(max_length=255, null=True, blank=True)
    quantity_A = models.IntegerField(null=False, default=0)
    quantity_B = models.IntegerField(null=False, default=0)

    def _str_(self):
        return self.material_name

    def belowcriticalquantity(self):
        return self.quantity_A + self.quantity_B < self.critical_quantity

    @property
    def quantity(self):
        return self.quantity_A + self.quantity_B


class Purchase(models.Model):
    purchase_id = models.AutoField(primary_key=True)
    material = models.ForeignKey(Material, on_delete=models.PROTECT)
    purchase_type = models.TextField(blank=True, null=True)
    quantity_purchased = models.IntegerField(null=False)
    vendor_details = models.TextField(blank=True, null=True)
    date_time = models.DateTimeField(auto_now=True)
    pdf_file = models.FileField(upload_to=pdf_path, blank=True, null=True)

    def raw_save(self, *args, **kwargs):
        super().save()

    def save(self, *args, **kwargs):
        # Call the original save method
        super().save(*args, **kwargs)

        # Update the quantity of the associated material
        self.material.quantity_A += self.quantity_purchased
        self.material.save()

    def __str__(self):
        # print(self.material.quantity)
        return self.material.material_name + '  ' + str(self.purchase_id)+'  ' + str(self.date_time.date())


class Department(models.Model):
    department_name = models.CharField(max_length=255, default="Un-named")
    is_main = models.BooleanField(default=False)
    parentDepartment = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='sub_departments')

    def __str__(self):
        return self.department_name


class Technician(models.Model):
    technician_name = models.CharField(max_length=255)
    department = models.ForeignKey(
        Department, on_delete=models.PROTECT, null=True, blank=True)
    technician_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.technician_name


class Sanction(models.Model):
    sanction_id = models.AutoField(primary_key=True)
    ticket_id = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    engineer_id = models.IntegerField(null=False)
    technician = models.ForeignKey(
        Technician, on_delete=models.PROTECT, null=True, blank=True)
    material = models.ForeignKey(Material, on_delete=models.PROTECT)
    date_time = models.DateTimeField(default=timezone.now)
    quantity_sanctioned = models.IntegerField(null=False, default=0)
    sanct_type = models.CharField(null=False, choices=(
        ('A', 'A'),
        ('B', 'B')
    ), default='A', max_length=1)
    log = PickledObjectField(default=list)
    closed = models.BooleanField(default=False)

    def sanction_return(self, quantity: int, to_type: str):
        if self.quantity_sanctioned <= quantity and quantity > 0:
            return False
        if self.sanct_type == 'A':
            if to_type == 'A':
                self.quantity_sanctioned -= quantity
                self.material.quantity_A += quantity
                self.log = self.log + [[str(datetime.now()), 'A', -quantity]]
            else:
                self.quantity_sanctioned -= quantity
                self.material.quantity_B += quantity
                self.log = self.log + [[str(datetime.now()), 'B', -quantity]]
        else:
            self.quantity_sanctioned -= quantity
            self.material.quantity_B += quantity
            self.log = self.log + [[str(datetime.now()), 'B', -quantity]]

        super().save()
        self.material.save()
        return True

    def sanction_add(self, quantity: int):
        if self.sanct_type == 'A':
            if self.material.quantity_A >= quantity and quantity > 0:
                self.material.quantity_A -= quantity
                self.quantity_sanctioned += quantity
                self.log = self.log + [[str(datetime.now()), quantity]]
            else:
                return False
        else:
            if self.material.quantity_B >= quantity and quantity > 0:
                self.material.quantity_B -= quantity
                self.quantity_sanctioned += quantity
                self.log = self.log + [[str(datetime.now()), quantity]]
            else:
                return False
        super().save()
        self.material.save()
        return True

    def sanction_close(self):
        if self.closed:
            return False
        self.closed = True
        self.log = self.log + [[str(datetime.now()), 0]]
        super().save()

    def is_valid(self):
        if self.sanct_type == 'A':
            if self.quantity_sanctioned <= self.material.quantity_A:
                return [True]
            else:
                return [False, self.quantity_sanctioned, self.material.quantity_A]
        else:
            if self.quantity_sanctioned <= self.material.quantity_B:
                return [True]
            else:
                return [False, self.quantity_sanctioned, self.material.quantity_B]

    def raw_save(self, *args, **kwargs):
        super().save()

    def save(self, *args, **kwargs):
        # Call the original save method
        super().save(*args, **kwargs)
        self.log = self.log + [
            [
                str(self.date_time),
                int(self.quantity_sanctioned)
            ]
        ]
        super().save(*args, **kwargs)

        # Update the quantity of the associated material
        if self.sanct_type == 'A':
            self.material.quantity_A -= self.quantity_sanctioned
            self.material.save()
        else:
            self.material.quantity_B -= self.quantity_sanctioned
            self.material.save()


class Role(models.Model):
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    role_name = models.CharField(max_length=255, default="Student")

    def __str__(self):
        # print(self.material.quantity)
        return self.role_name


class RegisterRequest(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField(max_length=254)
    department = models.ForeignKey(
        Department, on_delete=models.PROTECT, null=True, blank=True)
    role = models.ForeignKey(
        Role, on_delete=models.PROTECT, null=True, blank=True)
    password = models.CharField(max_length=255)


class EmailVerificationCode(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(
        max_length=6, default=secrets.randbelow(899999)+100000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Verification Code for {self.email}"
