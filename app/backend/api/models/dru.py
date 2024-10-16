from django.db import models


class DRU(models.Model):

    region = models.CharField(
        max_length=50,
        blank=False,
        null=False,
        default="Western Visayas",
    )
    province = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        default="Iloilo",
    )
    municipality = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        default="Iloilo City",
    )
    dru = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    address = models.TextField(
        blank=False,
        null=False,
    )
    dru_types = [
        ("rhu", "RHU"),
        ("ho", "CHO/MHO/PHO"),
        ("government_hospital", "Government Hospital"),
        ("private_hospital", "Private Hospital"),
        ("clinic", "Clinic"),
        ("priv_lab", "Private Laboratory"),
        ("pub_lab", "Public Laboratory"),
        ("sea_air", "Seaport/Airport"),
    ]
    dru_type = models.CharField(
        max_length=20,
        choices=dru_types,
        blank=False,
        null=False,
    )

    def __str__(self):
        return self.dru
