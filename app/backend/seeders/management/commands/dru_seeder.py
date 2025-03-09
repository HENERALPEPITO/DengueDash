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
                "region": "Western Visayas",
                "email": "iloiloresu@gmail.com",
                "contact_number": "09123456789",
            },
            {
                "name": "Iloilo Provincial Epedemiology and Surveillance Unit",
                "address": "Provincial Capitol, Iloilo City",
                "type": DRUType.objects.get(id=2),
                "unit": "Iloilo Province",
                "region": "Western Visayas",
                "email": "iloilopesu@gmail.com",
                "contact_number": "09123456780",
            },
            {
                "name": "Iloilo City Epedemiology and Surveillance Unit",
                "address": "City Hall, Iloilo City",
                "type": DRUType.objects.get(id=2),
                "unit": "Iloilo City",
                "region": "Western Visayas",
                "email": "iloilocesu@gmail.com",
                "contact_number": "09123456781",
            },
            {
                "name": "Molo District Health Center",
                "address": "Locsin Street, Molo",
                "type": DRUType.objects.get(id=4),
                "unit": "Iloilo City",
                "region": "Western Visayas",
                "email": "molodistricthealth@gmail.com",
                "contact_number": "09123456782",
            },
            {
                "name": "Jaro 1 Health Center",
                "address": "Washington Street, Jaro",
                "type": DRUType.objects.get(id=4),
                "unit": "Iloilo City",
                "region": "Western Visayas",
                "email": "jaro1health@gmail.com",
                "contact_number": "09123456783",
            },
            {
                "name": "Saint Paul's Hospital",
                "address": "General Luna Street",
                "type": DRUType.objects.get(id=6),
                "unit": "Iloilo City",
                "region": "Western Visayas",
                "email": "saintpaul@gmail.com",
                "contact_number": "09123456784",
            },
        ]

        for dru in drus:
            DRU.objects.get_or_create(
                dru_name=dru["name"],
                address=dru["address"],
                dru_type=dru["type"],
                surveillance_unit=dru["unit"],
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully seeded DRU data",
            )
        )
