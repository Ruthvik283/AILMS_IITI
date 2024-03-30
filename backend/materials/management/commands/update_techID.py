from django.core.management.base import BaseCommand
from materials.models import Sanction

class Command(BaseCommand):
    help = 'Update technician_id for all instances of Sanction'

    def handle(self, *args, **options):
        # Retrieve all instances of Sanction
        all_sanctions = Sanction.objects.all()

        # Iterate through each instance and set technician_id to 1
        for sanction in all_sanctions:
            sanction.technician_id = 1
            sanction.save()

        self.stdout.write(self.style.SUCCESS('Successfully updated technician_id for all Sanctions'))
