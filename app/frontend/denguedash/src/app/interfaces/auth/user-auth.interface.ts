export interface BaseLoginReponse {
  success: boolean;
  message: string;
}

export interface UserLoggedIn extends BaseLoginReponse {
  access_token: string;
  refresh_token: string;
}
