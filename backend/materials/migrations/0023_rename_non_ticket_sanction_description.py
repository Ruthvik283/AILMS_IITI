# Generated by Django 5.0.1 on 2024-03-30 15:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0022_sanction_non_ticket_alter_sanction_date_time_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sanction',
            old_name='non_ticket',
            new_name='description',
        ),
    ]
