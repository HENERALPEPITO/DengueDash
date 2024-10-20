from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)


class JWTAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get("access_token")
        if access_token:
            # Log the token to confirm it’s being extracted
            logger.info(f"Access token found: {access_token}")

            # Add the token to the Authorization header
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {access_token}"
        else:
            logger.warning("No access token found in cookies.")
