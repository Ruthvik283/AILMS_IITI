# Generated by Django 4.1.13 on 2024-03-11 19:02

from django.db import migrations
import picklefield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0008_log'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Log',
        ),
        migrations.AddField(
            model_name='sanction',
            name='log',
            field=picklefield.fields.PickledObjectField(editable=False, null=True),
        ),
    ]
