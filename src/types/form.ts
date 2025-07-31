export interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface FormRequestData {
    email: string;
    password: string;
}

export interface FormResponseData {
    success: boolean;
    message?: string;
    access_token?: string;
    access_token_expires_at?: string; // ISO string
    refresh_token?: string;
    refresh_token_expires_at?: string; // ISO string
    user?: UserModel;
}

export interface UserModel {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    age: number;
    gender: "male" | "female";
    created_at: string;
    updated_at: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    message?: string;
    access_token?: string;
    access_token_expires_at?: string; // ISO string
    refresh_token?: string;
    refresh_token_expires_at?: string; // ISO string
}