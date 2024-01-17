from django.db import models

# Create your models here.
class Material(models.Model):
    material_id = models.AutoField(primary_key=True)
    material_name = models.CharField(max_length=255, default="Un-named")
    price = models.IntegerField(null = False)
    quantity = models.IntegerField(null = False)
    rack_number = models.CharField(max_length=255, null = True, blank=True)
    row_number = models.CharField(max_length=255, null = True, blank=True)
    

    def __str__(self):
        return self.material_name
    
class Purchase(models.Model):
    purchase_id = models.AutoField(primary_key=True)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantity_purchased = models.IntegerField(null = False)
    vendor_details = models.TextField(blank=True, null=True)
    date_time = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        # Call the original save method
        super().save(*args, **kwargs)

        # Update the quantity of the associated material
        self.material.quantity += self.quantity_purchased
        self.material.save()

        
    def __str__(self):
        # print(self.material.quantity)
        return self.material.material_name + ' ' + str(self.purchase_id)
    
       