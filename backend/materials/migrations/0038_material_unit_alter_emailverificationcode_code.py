# Generated by Django 4.2.7 on 2024-05-17 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0037_alter_department_parentdepartment_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='material',
            name='unit',
            field=models.CharField(default='unit', max_length=255),
        ),
        migrations.AlterField(
            model_name='emailverificationcode',
            name='code',
            field=models.CharField(default=956483, max_length=6),
        ),
    ]