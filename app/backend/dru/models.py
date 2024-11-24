from django.db import models


class DRUType(models.Model):

    dru_classification = models.CharField(
        max_length=20,
    )

    def __str__(self):
        return self.dru_classification


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
        unique=True,
        max_length=100,
        blank=False,
        null=False,
    )
    address = models.TextField(
        blank=False,
        null=False,
    )

    dru_type = models.ForeignKey(
        DRUType,
        on_delete=models.SET_NULL,
        blank=False,
        null=True,
        related_name="dru_type",
    )

    def __str__(self):
        return self.dru
