from django.core.management.base import BaseCommand
from user.models import UserClassification


class Command(BaseCommand):
    help = "Seed initial classification data"

    def handle(self, *args, **kwargs):
        classifications = [
            "Admin",
            "Doctor",
            "Nurse",
            "Pharmacist",
            "Cashier",
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
