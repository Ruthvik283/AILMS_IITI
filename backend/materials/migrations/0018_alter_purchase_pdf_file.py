# Generated by Django 5.0.1 on 2024-03-29 22:59

import materials.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0017_department_is_main'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchase',
            name='pdf_file',
            field=models.FileField(blank=True, null=True, upload_to=materials.models.pdf_path),
        ),
    ]