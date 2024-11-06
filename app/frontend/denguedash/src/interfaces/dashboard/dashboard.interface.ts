export interface CurrentCaseCount {
  total_cases: number;
  total_deaths: number;
  weekly_cases: number;
  weekly_deaths: number;
}

export interface ComboCountDeaths {
  label: string;
  case_count: number;
  death_count: number;
}
