from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models.user import UserClassification

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    # Convert the primary key to string
    classification = serializers.StringRelatedField()
    dru = serializers.StringRelatedField()

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "sex",
            "classification",
            "dru",
        ]


class UserClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClassification
        fields = "__all__"
