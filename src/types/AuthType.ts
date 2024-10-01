export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export interface ILogin {
  emailOrUserName: string;
  password: string;
  isRememberMe?: boolean;
}

export interface IRegisterResponse {
  success: boolean;
  code: number;
  message: string;
}

export interface IRegister {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phonenumber: string;
  role: number;
}
