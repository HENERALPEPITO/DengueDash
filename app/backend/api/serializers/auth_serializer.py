from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
from ..models.user import UserClassification

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
    )
    classification = serializers.PrimaryKeyRelatedField(
        queryset=UserClassification.objects.all(),
        required=True,
    )

    class Meta:
        model = User
        exclude = [
            "password",
            "last_login",
            "is_active",
            "is_staff",
            "is_superuser",
        ]

    def validate(self, attrs):
        # Registering an admin via API is not allowed
        if attrs["classification"] == UserClassification.objects.get(
            classification="Admin"
        ):
            raise serializers.ValidationError(
                {"classification": "Invalid Classification."}
            )

        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        return User.objects.create_user(
            password=password,
            **validated_data,
        )


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
        return data
