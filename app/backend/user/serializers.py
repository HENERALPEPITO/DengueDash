from rest_framework import serializers
from django.contrib.auth import get_user_model

# from user.models import UserClassification

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    # classification = serializers.StringRelatedField()
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
            # "classification",
            "dru",
        ]

    def get_sex_display(self, obj):
        return obj.get_sex_display()


# class UserClassificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserClassification
#         fields = "__all__"
