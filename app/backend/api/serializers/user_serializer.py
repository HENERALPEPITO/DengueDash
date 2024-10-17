from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models.user import UserClassification

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    # Convert the primary key to string
    classification = serializers.StringRelatedField()
    dru = serializers.StringRelatedField()
    # Show the proper name instead of abbreviated value in tuple
    sex_display = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "sex_display",
            "classification",
            "dru",
        ]

    def get_sex_display(self, obj):
        return obj.get_sex_display()


class UserClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClassification
        fields = "__all__"
