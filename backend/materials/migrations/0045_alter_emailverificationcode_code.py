# Generated by Django 4.2.7 on 2024-08-14 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0044_alter_emailverificationcode_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailverificationcode',
            name='code',
            field=models.CharField(default=190952, max_length=6),
        ),
    ]
