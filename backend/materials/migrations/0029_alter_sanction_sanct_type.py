# Generated by Django 5.0.1 on 2024-04-09 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0028_remove_material_quantity_material_quantity_a_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sanction',
            name='sanct_type',
            field=models.CharField(choices=[('A', 'A'), ('B', 'B')], default='A', max_length=1),
        ),
    ]