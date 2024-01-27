# Generated by Django 5.0.1 on 2024-01-18 11:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
        ('materials', '0002_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='materials.role'),
        ),
    ]