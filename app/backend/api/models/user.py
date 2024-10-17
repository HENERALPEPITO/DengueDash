from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from .dru import DRU


class UserClassification(models.Model):
    classification = models.CharField(
        max_length=50,
    )

    def __str__(self):
        return self.classification


class UserManager(BaseUserManager):
    def create_user(
        self,
        username,
        email,
        last_name,
        first_name,
        middle_name,
        sex,
        password=None,
        **extra_fields,
    ):
        classification = extra_fields.pop("classification", None)
        classification = UserClassification.objects.get(
            classification=classification,
        )

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            last_name=last_name,
            first_name=first_name,
            middle_name=middle_name,
            sex=sex,
            classification=classification,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(
        self,
        username,
        email,
        last_name,
        first_name,
        middle_name,
        sex,
        password,
        **extra_fields,
    ):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        # Set the classification_id that links to admin
        extra_fields.setdefault(
            "classification_id",
            UserClassification.objects.filter(classification="Admin")
            .values_list("id", flat=True)
            .first(),
        )

        return self.create_user(
            username,
            email,
            last_name,
            first_name,
            middle_name,
            sex,
            password,
            **extra_fields,
        )


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        max_length=150,
        unique=True,
    )
    email = models.EmailField(
        max_length=255,
        unique=True,
        blank=False,
    )
    last_name = models.CharField(
        max_length=50,
        blank=False,
        null=False,
    )
    first_name = models.CharField(
        max_length=50,
        blank=False,
        null=False,
    )
    middle_name = models.CharField(
        max_length=50,
        blank=False,
        null=False,
    )
    sex_choices = [
        ("M", "Male"),
        ("F", "Female"),
    ]
    sex = models.CharField(
        max_length=6,
        choices=sex_choices,
        blank=False,
        null=False,
    )
    dru = models.ForeignKey(
        DRU,
        on_delete=models.SET_NULL,
        blank=False,
        null=True,
        related_name="user",
    )
    classification = models.ForeignKey(
        UserClassification,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="user",
    )
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "email",
        "first_name",
        "middle_name",
        "last_name",
        "sex",
        "classification",
    ]

    objects = UserManager()

    def __str__(self):
        return self.username
