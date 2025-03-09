from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from api.custom_exceptions.custom_validation_exception import CustomValidationException

# from user.models import UserClassification
from dru.models import DRU, DRUType


User = get_user_model()

class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        if request := self.context.get("request"):
            attrs["username"] = request.data.get("email")

        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            raise CustomValidationException(
                "No active account found with the given credentials"
            )
        except Exception:
            raise CustomValidationException(
                "An unexpected error occurred during login."
            )
        user = self.user
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        access_token = AccessToken.for_user(user)
        is_user_admin = user.is_admin
        # Additional data appended to the token
        access_token["is_admin"] = is_user_admin
        data["access"] = str(access_token)
        return data
