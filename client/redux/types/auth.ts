export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  isVerified: boolean;
  hasPassword?: boolean;
  courses: Array<{ courseId: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse extends ApiResponse {
  activationToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse {
  user: User;
  accessToken: string;
}

export interface SocialAuthRequest {
  name: string;
  email: string;
  avatar?: string;
}

export interface SocialAuthResponse extends ApiResponse {
  user: User;
  accessToken: string;
}

export interface ActivateRequest {
  activationToken: string;
  activationCode: string;
}

export interface GetMeResponse extends ApiResponse {
  user: User;
}

export interface RefreshTokenResponse {
  success?: boolean;
  sucess?: boolean;
  accessToken: string;
}

export interface UpdateUserInfoRequest {
  name?: string;
  email?: string;
}

export interface UpdatePasswordRequest {
  oldPassword?: string;
  newPassword: string;
}

export interface UpdateProfilePictureRequest {
  avatar: string;
}

export interface UpdateUserResponse extends ApiResponse {
  user: User;
}

export interface UpdatePasswordResponse extends ApiResponse {
  message: string;
  user?: User;
}

export interface GetAllUsersResponse extends ApiResponse {
  users: User[];
}

export interface UpdateUserRoleRequest {
  id: string;
  role: string;
}

export interface DeleteUserResponse extends ApiResponse {}
