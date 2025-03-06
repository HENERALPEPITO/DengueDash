from datetime import timedelta
from .models import Case


def fetch_cases_for_week(start_date):
    end_date = start_date + timedelta(days=6)
    cases = Case.objects.filter(
        clncl_class="W" or "S",
        date_con__gte=start_date,
        date_con__lte=end_date,
    ).count()
    return cases
