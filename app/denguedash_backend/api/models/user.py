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


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        max_length=150,
        unique=True,
    )
    email = (
        models.EmailField(
            unique=True,
        ),
    )
    last_name = (
        models.CharField(
            max_length=100,
            blank=False,
            null=False,
        ),
    )
    first_name = (
        models.CharField(
            max_length=100,
            blank=False,
            null=False,
        ),
    )
    middle_name = (
        (
            models.CharField(
                max_length=100,
                blank=True,
                null=True,
            ),
        ),
    )
    sex_choices = (
        [
            ("male", "Male"),
            ("female", "Female"),
        ],
    )
    sex = (
        models.CharField(
            max_length=6,
            choices=sex_choices,
            blank=False,
            null=False,
        ),
    )
    dru = models.ForeignKey(
        DRU,
        on_delete=models.SET_NULL,
        blank=False,
        null=True,
        related_name="users",
    )
    classification = models.ForeignKey(
        UserClassification,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="users",
    )
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "sex",
        "classification",
    ]


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
        classification = UserClassification.objects.get(id=classification)

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            last_name=last_name,
            first_name=first_name,
            middle_name=middle_name,
            sex=sex,
            classification=classification,
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

        # Make sure classification is correctly passed
        classification = extra_fields.get("classification", None)
        if not classification:
            raise ValueError("Superuser must have a classification")

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
