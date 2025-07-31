import { BaseApi } from "./base";
import { FormRequestData, FormResponseData, RefreshTokenRequest, RefreshTokenResponse } from "@/types/form";

export class AuthApi extends BaseApi {
    static async login(data: FormRequestData): Promise<FormResponseData | undefined> {

        const request_url = `${this.url}/login`;

        const response = this.post<FormResponseData>(request_url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response;
    }

    static async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse | undefined> {
        const request_url = `${this.url}/refresh-token`;

        const response = this.post<RefreshTokenResponse>(request_url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response;
    }
}