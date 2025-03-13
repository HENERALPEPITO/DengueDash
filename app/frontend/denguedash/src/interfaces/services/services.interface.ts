interface SuccessResponse {
  success: string;
}

export interface BaseServiceResponse extends SuccessResponse {
  message: string;
}

export interface BaseErrorResponse extends SuccessResponse {
  message: string | { [key: string]: string[] };
}
