from django.core.management.base import BaseCommand
from dru.models import DRU, DRUType


class Command(BaseCommand):
    help = "Seed initial DRU data"

    def handle(self, *args, **kwargs):
        drus = [
            {
                "name": "Western Visayas Regional Epedemiology and Surveillance Unit",
                "address": "MHAM Building, Iloilo City",
                "type": DRUType.objects.get(id=1),
                "unit": None,
            },
            {
                "name": "Iloilo Provincial Epedemiology and Surveillance Unit",
                "address": "Provincial Capitol, Iloilo City",
                "type": DRUType.objects.get(id=2),
                "unit": "Iloilo Province",
            },
            {
                "name": "Iloilo City Epedemiology and Surveillance Unit",
                "address": "City Hall, Iloilo City",
                "type": DRUType.objects.get(id=2),
                "unit": "Iloilo City",
            },
            {
                "name": "Molo District Health Center",
                "address": "Locsin Street, Molo",
                "type": DRUType.objects.get(id=4),
                "unit": "Iloilo City",
            },
            {
                "name": "Jaro 1 Health Center",
                "address": "Washington Street, Jaro",
                "type": DRUType.objects.get(id=4),
                "unit": "Iloilo City",
            },
            {
                "name": "Saint Paul's Hospital",
                "address": "General Luna Street",
                "type": DRUType.objects.get(id=6),
                "unit": "Iloilo City",
            },
        ]

        for dru in drus:
            DRU.objects.get_or_create(
                dru=dru["name"],
                address=dru["address"],
                dru_type=dru["type"],
                surveillance_unit=dru["unit"],
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully seeded DRU data",
            )
        )
