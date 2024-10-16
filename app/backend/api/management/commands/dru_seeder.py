from django.core.management.base import BaseCommand
from ...models.dru import DRU


class Command(BaseCommand):
    help = "Seed initial DRU data"

    def handle(self, *args, **kwargs):
        drus = [
            {
                "name": "Iloilo Epidemiology and Surveillance Unit",
                "address": "Plaza Libertad",
                "type": "CHO/MHO/PHO",
            },
            {
                "name": "Molo District Health Center",
                "address": "Locsin Street, Molo",
                "type": "CHO/MHO/PHO",
            },
            {
                "name": "Jaro 1 Health Center",
                "address": "Washington Street, Jaro",
                "type": "CHO/MHO/PHO",
            },
            {
                "name": "Saint Paul's Hospital",
                "address": "General Luna Street",
                "type": "priv_hsptl",
            },
        ]

        for dru in drus:
            DRU.objects.get_or_create(
                dru=dru["name"],
                address=dru["address"],
                dru_type=dru["type"],
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully seeded DRU data",
            )
        )
