from django.db import models


class Patient(models.Model):
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
        max_length=5,
        blank=True,
        null=True,
    )
    date_of_birth = models.DateField(
        blank=False,
        null=False,
    )
    sex_choices = [
        ("M", "Male"),
        ("F", "Female"),
    ]
    sex = models.CharField(
        max_length=1,
        choices=sex_choices,
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
    ca_city = models.CharField(
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
    p_city = models.CharField(
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
        ("S", "Single"),
        ("M", "Married"),
        ("W", "Widowed"),
        ("SEP", "Separated"),
    ]
    civil_status = models.CharField(
        max_length=3,
        choices=civil_status_choices,
        blank=False,
        null=False,
    )
    date_first_vax = models.DateField(
        blank=False,
        null=True,
    )
    date_last_vax = models.DateField(
        blank=False,
        null=True,
    )

    def __str__(self):
        return f"{self.first_name} {self.middle_name} {self.last_name}"
