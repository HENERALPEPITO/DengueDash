from django.db import models


class Patient(models.Model):
    case_id = models.BigIntegerField(
        editable=False,
    )
    last_name = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    first_name = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    middle_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    suffix = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    date_of_birth = models.DateField(
        blank=False,
        null=False,
    )
    sex_choices = [
        ("m", "Male"),
        ("f", "Female"),
    ]
    sex = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    ca_house_no = (
        models.IntegerField(
            blank=False,
            null=False,
        ),
    )
    ca_street = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    ca_barangay = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    ca_municipality = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    ca_province = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    p_house_no = models.IntegerField(
        blank=False,
        null=False,
    )
    p_street = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    p_barangay = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    p_municipality = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    p_province = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    civil_status_choices = [
        ("single", "Single"),
        ("married", "Married"),
        ("widowed", "Widowed"),
        ("separated", "Separated"),
    ]
    civil_status = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    is_indigent = models.IntegerField(
        blank=False,
        null=False,
        default=0,
    )
    date_first_vax = models.DateField(
        blank=False,
        null=False,
    )
    date_last_vax = models.DateField(
        blank=False,
        null=False,
    )