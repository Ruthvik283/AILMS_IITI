# Generated by Django 4.1.13 on 2024-04-03 06:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0024_registerrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='material',
            name='quantity_A',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='material',
            name='quantity_B',
            field=models.IntegerField(default=0),
        ),
    ]
