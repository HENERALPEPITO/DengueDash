from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from core.models import BaseModel
from dru.models import DRU


class BlacklistedUsers(models.Model):
    email = models.EmailField(
        max_length=255,
        unique=True,
        blank=False,
        null=False,
    )
    dru = models.ForeignKey(
        DRU,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="blacklisted_users",
    )
    date_added = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.email


class UserManager(BaseUserManager):
    def create_user(
        self,
        email,
        password=None,
        **extra_fields,
    ):

        user = self.model(
            email=self.normalize_email(email),
            **extra_fields,
        )

        user.set_password(password)
        extra_fields.setdefault("is_superuser", False)
        user.save(using=self._db)

        return user

    def create_superuser(
        self,
        email,
        password,
        **extra_fields,
    ):

        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_verified", True)
        extra_fields.setdefault("is_legacy", True)
        extra_fields.setdefault("dru", DRU.objects.get(id=1))

        return self.create_user(
            email,
            password,
            **extra_fields,
        )


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    email = models.EmailField(
        max_length=255,
        unique=True,
        blank=False,
        null=False,
    )
    last_name = models.CharField(
        max_length=50,
        blank=True,
        null=False,
    )
    first_name = models.CharField(
        max_length=100,
        blank=False,
        null=False,
    )
    middle_name = models.CharField(
        max_length=50,
        blank=True,
        null=False,
    )
    sex_choices = [
        ("M", "Male"),
        ("F", "Female"),
        ("N/A", "Not Applicable"),
    ]
    sex = models.CharField(
        max_length=3,
        choices=sex_choices,
        blank=False,
        null=False,
    )
    dru = models.ForeignKey(
        DRU,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="user",
    )
    is_admin = models.BooleanField(default=False)
    is_legacy = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "first_name",
        "middle_name",
        "last_name",
        "sex",
    ]

    objects = UserManager()

    def __str__(self):
        return self.email
