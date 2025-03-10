import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from dru.models import DRU, DRUType
from faker import Faker

User = get_user_model()


class Command(BaseCommand):
    help = "Seed initial DRU data"

    def handle(self, *args, **kwargs):
        fake = Faker()
        drus = [
            {
                "name": "Philippine Integrated Disease Surveillance and Response",
                "address": "DOH Building, Sta. Cruz, Manila",
                "type": DRUType.objects.get(id=1),
                "unit": None,
                "region": None,
                "email": "pidsr@gmail.com",
                "contact_number": "09123456785",
            },
            {
                "name": "Western Visayas Regional Epedemiology and Surveillance Unit",
                "address": "MHAM Building, Iloilo City",
                "type": DRUType.objects.get(id=2),
                "unit": None,
                "region": "Western Visayas",
                "email": "iloiloresu@gmail.com",
                "contact_number": "09123456789",
            },
            {
                "name": "Iloilo Provincial Epedemiology and Surveillance Unit",
                "address": "Provincial Capitol, Iloilo City",
                "type": DRUType.objects.get(id=3),
                "unit": "Iloilo Province",
                "region": "Western Visayas",
                "email": "iloilopesu@gmail.com",
                "contact_number": "09123456780",
            },
            {
                "name": "Iloilo City Epedemiology and Surveillance Unit",
                "address": "City Hall, Iloilo City",
                "type": DRUType.objects.get(id=3),
                "unit": "Iloilo City",
                "region": "Western Visayas",
                "email": "iloilocesu@gmail.com",
                "contact_number": "09123456781",
            },
            {
                "name": "Molo District Health Center",
                "address": "Locsin Street, Molo",
                "type": DRUType.objects.get(id=5),
                "unit": "Iloilo City",
                "region": "Western Visayas",
                "email": "molodistricthealth@gmail.com",
                "contact_number": "09123456782",
            },
            {
                "name": "Jaro 1 Health Center",
                "address": "Washington Street, Jaro",
                "type": DRUType.objects.get(id=5),
                "unit": "Iloilo City",
                "region": "Western Visayas",
                "email": "jaro1health@gmail.com",
                "contact_number": "09123456783",
            },
            {
                "name": "Saint Paul's Hospital",
                "address": "General Luna Street",
                "type": DRUType.objects.get(id=7),
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
                region=dru["region"],
                email=dru["email"],
                contact_number=dru["contact_number"],
            )
            # Make one admin and one encoder
            User.objects.create_user(
                email=dru["email"],
                password="testpassword",
                first_name=dru["name"],
                middle_name="",
                last_name="",
                sex="N/A",
                is_admin=True,
                is_verified=True,
                is_legacy=True,
                dru=DRU.objects.get(dru_name=dru["name"]),
            )
            User.objects.create_user(
                email=fake.email(),
                password="testpassword",
                first_name=fake.first_name(),
                middle_name=fake.last_name(),
                last_name=fake.last_name(),
                sex=random.choice(["M", "F"]),
                is_admin=False,
                is_verified=True,
                is_legacy=False,
                dru=DRU.objects.get(dru_name=dru["name"]),
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully seeded DRU data",
            )
        )
