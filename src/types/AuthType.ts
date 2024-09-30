export interface ILoginResponse {
  value: {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiryTime: string;
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  success: boolean;
  code: number;
  message: string;
}
