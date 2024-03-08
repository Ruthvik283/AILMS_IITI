from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=128)
    parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Material(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='materials',null=True,blank=True)
    material_id = models.AutoField(primary_key=True)
    material_name = models.CharField(max_length=255, default="Un-named")
    price = models.IntegerField(null=False)
    quantity = models.IntegerField(null=False)
    rack_number = models.CharField(max_length=255, null=True, blank=True)
    row_number = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.material_name


class Purchase(models.Model):
    purchase_id = models.AutoField(primary_key=True)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantity_purchased = models.IntegerField(null=False)
    vendor_details = models.TextField(blank=True, null=True)
    date_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Call the original save method
        super().save(*args, **kwargs)

        # Update the quantity of the associated material
        self.material.quantity += self.quantity_purchased
        self.material.save()

    def __str__(self):
        # print(self.material.quantity)
        return self.material.material_name + '  ' + str(self.purchase_id)+'  ' + str(self.date_time.date())


class Department(models.Model):
    department_name = models.CharField(max_length=255, default="Un-named")

    def __str__(self):
        # print(self.material.quantity)
        return self.department_name
    # extras to be asked


class Sanction(models.Model):
    sanction_id = models.AutoField(primary_key=True)
    ticket_id = models.IntegerField(null=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    engineer_id = models.IntegerField(null=False)
    technician_id = models.IntegerField(null=False)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_now=True)
    quantity_sanctioned = models.IntegerField(null=False)

    def is_valid(self):
        if (self.quantity_sanctioned <= self.material.quantity):
            return [True]
        return [False, self.material.quantity, self.quantity_sanctioned]

    def save(self, *args, **kwargs):
        # Call the original save method
        super().save(*args, **kwargs)

        # Update the quantity of the associated material
        self.material.quantity -= self.quantity_sanctioned
        self.material.save()


class Role(models.Model):
    # department = models.ForeignKey(Department, on_delete=models.CASCADE)
    role_name = models.CharField(max_length=255, default="Student")
    def __str__(self):
        # print(self.material.quantity)
        return self.role_name   
