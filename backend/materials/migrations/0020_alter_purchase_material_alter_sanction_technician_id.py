# Generated by Django 5.0.1 on 2024-03-30 11:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0019_technician_alter_sanction_department_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchase',
            name='material',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='materials.material'),
        ),
        migrations.AlterField(
            model_name='sanction',
            name='technician_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='materials.technician'),
        ),
    ]
