
import { Logger } from "@/util/Logger";

export abstract class BaseApi {

    static url = `${process.env.NEXT_PUBLIC_API_URL}`;

	static async get<T>(url: string, options: RequestInit = {}): Promise<T | undefined> {
		try {
			const response = await fetch(url, { ...options, method: 'GET' });
			if (!response.ok) {
				const res = await response.json();
				BaseApi.handleStatusCode(res);
				return undefined;
			}
			return response.json();
		} catch (err) {
			Logger.logError("A network error occurred.", err);
			return undefined;
		}
	}

	static async post<T>(url: string, data?: any, options: RequestInit = {}): Promise<T | undefined> {
		try {
			const response = await fetch(url, {
				...options,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(options.headers || {})
				},
				body: JSON.stringify(data)
			});
			if (!response.ok) {
				const res = await response.json();
                this.handleStatusCode(res);
                return undefined;
			}
			return response.json();
		} catch (err) {
			Logger.logError("A network error occurred.", err);
			return undefined;
		}
	}

	static async put<T>(url: string, data?: any, options: RequestInit = {}): Promise<T | undefined> {
		try {
			const response = await fetch(url, {
				...options,
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					...(options.headers || {})
				},
				body: JSON.stringify(data)
			});
			if (!response.ok) {
				const res = await response.json();
				Logger.logError("An error occurred while updating data.", res);
				return undefined;
			}
			return response.json();
		} catch (err) {
			Logger.logError("A network error occurred.", err);
			return undefined;
		}
	}

	static async delete<T>(url: string, options: RequestInit = {}): Promise<T | undefined> {
		try {
			const response = await fetch(url, { ...options, method: 'DELETE' });
			if (!response.ok) {
				const res = await response.json();
				Logger.logError("An error occurred while deleting data.", res);
				return undefined;
			}
			return response.json();
		} catch (err) {
			Logger.logError("A network error occurred.", err);
			return undefined;
		}
	}

    private static handleStatusCode(response: Response) {
        switch (response.status) {
            case 400:
                Logger.logError("Bad Request", response);
                break;
            case 401:
                Logger.logError("Unauthorized", response);
                break;
            case 403:
                Logger.logError("Forbidden", response);
            case 404:
                Logger.logError("Not Found", response);
                break;
            case 500:
                Logger.logError("Internal Server Error", response);
                break;
            case 429:
                Logger.logError("Too Many Requests", response);
                break;
            case 408:
                Logger.logError("Request Timeout", response);
                break;
            case 500:
                Logger.logError("Internal Server Error", response);
            default:
                Logger.logError("An error occurred", response);
        }
    }
}