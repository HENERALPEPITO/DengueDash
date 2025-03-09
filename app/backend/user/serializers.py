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
