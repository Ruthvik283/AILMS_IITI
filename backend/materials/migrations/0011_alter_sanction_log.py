# Generated by Django 4.1.13 on 2024-03-11 19:14

from django.db import migrations
import picklefield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0010_alter_sanction_log'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sanction',
            name='log',
            field=picklefield.fields.PickledObjectField(default=list, editable=False),
        ),
    ]
