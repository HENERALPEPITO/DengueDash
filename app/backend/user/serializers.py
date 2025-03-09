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


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
    )

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
        ]

    """
    Todo: Super Admins should register Admins
    Todo: Admins should register Users

    Todo: Admins should register nominated DRUs
    """

    def validate(self, attrs):

        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        return attrs

        # Todo: Refactor in the future
        # if attrs["classification"] == UserClassification.objects.get(
        #     classification="super_admin"
        # ):
        #     raise serializers.ValidationError(
        #         {"classification": "Invalid Classification."}
        #     )

        # Appropriate Classification for DRU type
        # if attrs["classification"] == UserClassification.objects.get(
        #     classification="admin_region"
        # ) and attrs["dru"].dru_type != DRUType.objects.get(
        #     dru_classification="RESU",
        # ):
        #     raise serializers.ValidationError(
        #         {
        #             "dru": "Invalid DRU type for Regional Admin Account",
        #         }
        #     )

        # if attrs["classification"] == UserClassification.objects.get(
        #     classification="admin_local"
        # ) and attrs["dru"].dru_type != DRUType.objects.get(
        #     dru_classification="PESU/CESU",
        # ):
        #     raise serializers.ValidationError(
        #         {"dru": "Invalid DRU type for PESU/CESU Admin Account"},
        #     )

        # Todo: Save for future use
        # if attrs["classification"] == UserClassification.objects.get(
        #     classification="encoder"
        # ) and (
        #     attrs["dru"].dru_type == DRUType.objects.get(dru_classification="PESU/CESU")
        #     or attrs["dru"].dru_type == DRUType.objects.get(dru_classification="RESU")
        # ):
        #     raise serializers.ValidationError(
        #         {"dru": "Invalid DRU type for Encoder Account"},
        #     )

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        return User.objects.create_user(
            password=password,
            **validated_data,
        )
