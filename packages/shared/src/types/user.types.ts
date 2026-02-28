export interface UserBase {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: UserBase;
}
