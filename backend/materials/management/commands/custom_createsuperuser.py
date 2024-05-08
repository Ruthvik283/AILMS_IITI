from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create a superuser without a username'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Superuser email address')
        parser.add_argument('password', type=str, help='Superuser password')

    def handle(self, *args, **options):
        User = get_user_model()
        email = options['email']
        password = options['password']

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists'))
            return

        User.objects.create_superuser(username=email, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'Successfully created superuser with email {email}'))