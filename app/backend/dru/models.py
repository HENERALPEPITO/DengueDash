from django.db import models
from core.models import BaseModel


class DRUType(BaseModel):

    dru_classification = models.CharField(
        max_length=20,
    )

    def __str__(self):
        return self.dru_classification


class DRU(BaseModel):

    region = models.CharField(
        max_length=50,
        blank=False,
        null=False,
    )
    surveillance_unit = models.CharField(
        max_length=50,
        blank=False,
        null=True,
    )
    dru_name = models.CharField(
        unique=True,
        max_length=100,
        blank=False,
        null=False,
    )
    address = models.TextField(
        blank=False,
        null=False,
    )
    email = models.EmailField(
        unique=True,
        blank=False,
        null=False,
    )
    contact_number = models.CharField(
        max_length=20,
        unique=True,
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
        return self.dru_name
