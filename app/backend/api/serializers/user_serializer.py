from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models.user import UserClassification

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    classification = serializers.StringRelatedField()

    class Meta:
        model = User
        exclude = [
            "password",
            "last_login",
            "is_active",
            "is_staff",
            "is_superuser",
        ]


class UserClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClassification
        fields = "__all__"
