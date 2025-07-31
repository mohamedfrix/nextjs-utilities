'use client';



import { useEffect, useState } from "react";
import { FormData } from "@/types/form";
import { Toaster } from "@/components/ui/sonner";
import { AuthApi } from "@/api/auth";
import { register } from "module";
import { Logger } from "@/util/Logger";
import { useAuth } from "@/hooks/useAuth";


export default function UtilPage() {
    const [formData, setFormData] = useState<{ email: string; password: string }>({
        email: '',
        password: ''
    });
    const { user, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, isAuthenticated, login, logout, refresh, setTokens } = useAuth();

    const [loading, setLoading] = useState<{ id: number | string}>({ id: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Call AuthApi.login with formData
        const result = await AuthApi.login(formData);
        if (result?.success) {
            // You can show a success toast or redirect here
            Logger.logSuccess("Login successful!");
            console.log("Login successful", result);
        } else {
            // Error handling is already done in BaseApi/Logger
            Logger.logError(result?.message || "Login failed", result);
        }
    };

    return (
        <>
            <Toaster />
            <div className="w-full h-full flex flex-col justify-center items-center min-h-screen">
                <h1 className="text-4xl font-bold mb-8">Util Page</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded shadow">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
                </form>
                <div className={`mt-4 w-[150px] h-[40px] bg-amber-300 flex justify-center items-center rounded-[8px]`}
                    onClick={() => {loading.id = Logger.registerLoading("Loading...")}}
                >
                    <p>register loading</p>
                </div>
                <div className={`mt-4 w-[150px] h-[40px] bg-amber-300 flex justify-center items-center rounded-[8px]`}
                    onClick={() => {Logger.clearLoading(loading.id)}}
                >
                    <p>dispatch loading</p>
                </div>
            </div>
        </>
    );
}