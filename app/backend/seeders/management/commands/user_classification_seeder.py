from django.core.management.base import BaseCommand
from user.models import UserClassification


class Command(BaseCommand):
    help = "Seed initial classification data"

    def handle(self, *args, **kwargs):
        classifications = [
            "super_admin",  # System Admins
            "admin_region",  # RESU
            "admin_local",  # PESU/CESU
            "admin_dru",  # Hospitals
            "encoder",  # Data Encoders
        ]

        for classification in classifications:
            UserClassification.objects.get_or_create(
                classification=classification,
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully seeded classification data",
            )
        )
