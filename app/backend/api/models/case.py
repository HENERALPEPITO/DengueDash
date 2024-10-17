from django.db import models
from ..models.patient import Patient
from ..models.user import User


class Case(models.Model):
    case = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="patient",
    )
    date_first_con = models.DateField(
        blank=False,
        null=True,
        default=None,
    )
    place_con = models.CharField(
        max_length=100,
        blank=False,
        null=True,
    )
    date_admt = models.DateField(
        blank=False,
        null=True,
        default=None,
    )
    date_onset = models.DateField(
        blank=False,
        null=False,
    )
    clinical_class_choices = [
        ("N", "No warning signs"),
        ("W", "With warning signs"),
        ("S", "Severe dengue"),
    ]
    clncl_class = models.CharField(
        max_length=100,
        choices=clinical_class_choices,
        blank=False,
        null=False,
    )
    lab_result_choices = [
        ("P", "Positive"),
        ("N", "Negative"),
        ("E", "Equivocal"),
        ("PR", "Pending Result"),
    ]
    ns1_result = models.CharField(
        max_length=100,
        choices=lab_result_choices,
        blank=False,
        null=False,
    )
    date_ns1 = models.DateField(
        blank=False,
        null=True,
        default=None,
    )
    igg_elisa = models.CharField(
        max_length=2,
        choices=lab_result_choices,
        blank=False,
        null=False,
    )
    date_igg_elisa = models.DateField(
        blank=False,
        null=True,
        default=None,
    )
    igm_elisa = models.CharField(
        max_length=2,
        choices=lab_result_choices,
        blank=False,
        null=False,
    )
    date_igm_elisa = models.DateField(
        blank=False,
        null=True,
        default=None,
    )
    pcr = models.CharField(
        max_length=2,
        choices=lab_result_choices,
        blank=False,
        null=False,
    )
    date_pcr = models.DateField(
        blank=False,
        null=True,
        default=None,
    )
    case_class_choices = [
        ("S", "Suspect"),
        ("P", "Probable"),
        ("C", "Confirmed"),
    ]
    case_class = models.CharField(
        max_length=1,
        choices=case_class_choices,
        blank=False,
        null=False,
    )
    outcome_choices = [
        ("A", "Alive"),
        ("D", "Dead"),
    ]
    outcome = models.CharField(
        max_length=1,
        choices=outcome_choices,
        blank=False,
        null=False,
    )
    date_death = models.DateField(
        blank=False,
        null=True,
        default=None,
    )
    interviewer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=False,
        null=True,
        related_name="user",
    )
