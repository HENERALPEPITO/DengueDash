from rest_framework import serializers
from django.contrib.auth import get_user_model
from user.models import BlacklistedUsers
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class BaseUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    sex_display = serializers.SerializerMethodField()
    dru_type = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.middle_name} {obj.last_name}".strip()

    def get_role(self, obj):
        return "Admin" if obj.is_admin else "Encoder"

    def get_sex_display(self, obj):
        return obj.get_sex_display()

    def get_dru_type(self, obj):
        return obj.dru.dru_type.dru_classification if obj.dru else None

    class Meta:
        model = User
        # Default fields for user serialization.
        fields = [
            "id",
            "email",
            "full_name",
            "sex_display",
            "role",
            "dru",
            "dru_type",
        ]


class UserFullInfoSerializer(BaseUserSerializer):
    dru = serializers.StringRelatedField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d-%H-%M-%S")
    updated_at = serializers.DateTimeField(format="%Y-%m-%d-%H-%M-%S")
    last_login = serializers.DateTimeField(format="%Y-%m-%d-%H-%M-%S")

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + [
            "created_at",
            "updated_at",
            "last_login",
        ]


class PasswordUpdateSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context.get("request").user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate_new_password(self, value):
        try:
            validate_password(value, self.context.get("request").user)
        except Exception as e:
            raise serializers.ValidationError(e)
        return value

    def save(self):
        user = self.context.get("request").user
        user.set_password(self.validated_data["new_password"])
        user.save()


class UsersListSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        # Only return a subset of the fields.
        fields = [
            "id",
            "full_name",
            "email",
            "sex_display",
            "role",
        ]


class UsersUnverifiedListSerializer(BaseUserSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d")

    class Meta(BaseUserSerializer.Meta):
        # Use a subset of fields, including created_at.
        fields = [
            "id",
            "full_name",
            "email",
            "sex_display",
            "created_at",
        ]


class BlacklistedUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlacklistedUsers
        fields = [
            "id",
            "email",
            "date_added",
        ]


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)
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

        request = self.context.get("request")
        # If not an authenticated admin, perform DRU type validation.
        if not (request and request.user.is_authenticated and request.user.is_admin):
            dru = attrs.get("dru")
            if dru:
                # Blacklisted DRU types for non-admin registrations.
                DRU_TYPE_BLACKLIST_FOR_UNAUTH_USERS = [
                    "National",
                    "RESU",
                    "PESU",
                    "CESU",
                ]
                if (
                    dru.dru_type.dru_classification
                    in DRU_TYPE_BLACKLIST_FOR_UNAUTH_USERS
                ):
                    raise serializers.ValidationError(
                        {"dru": "You are not authorized to register with this DRU."}
                    )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        validated_data["is_verified"] = False
        validated_data["is_admin"] = False

        # todo: delete this
        # request = self.context.get("request")
        # if request and request.user.is_authenticated and request.user.is_admin:
        #     validated_data.setdefault("is_verified", True)
        # else:
        #     validated_data["is_verified"] = False
        #     validated_data["is_admin"] = False

        return User.objects.create_user(password=password, **validated_data)


class VerifyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        field = [
            "is_verified",
        ]
