from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    dru = serializers.StringRelatedField()
    sex_display = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "sex_display",
            "dru",
        ]

    def get_sex_display(self, obj):
        return obj.get_sex_display()


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
    )

    # Optional fields [These fields are used by the admin]
    is_verified = serializers.BooleanField(required=False)
    is_admin = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "password_confirm",
            "first_name",
            "middle_name",
            "last_name",
            "sex",
            "dru",
            "is_verified",
            "is_admin",
        ]

    def validate(self, attrs):

        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        request = self.context.get("request")
        if request and request.user and request.user.is_admin:
            validated_data.setdefault("is_verified", True)
        else:
            validated_data["is_verified"] = False
            validated_data["is_admin"] = False

        return User.objects.create_user(
            password=password,
            **validated_data,
        )
