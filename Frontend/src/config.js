import axios from "axios";
// Vite only exposes variables prefixed with VITE_ to client-side code.
const configuredApiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const API_TARGET_ORIGIN = new URL(configuredApiUrl).origin;

// Call the backend directly; its development CORS policy allows local frontend origins.
const apiUrl = configuredApiUrl;

// Keep endpoint paths consistent whether the configured URL ends in a slash or not.
export const API_BASE_URL = apiUrl.replace(/\/+$/, "");
let refreshPromise;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config;
        const requestUrl = request?.url || "";
        const skipRefresh = ["/login", "/signup", "/refresh-token", "/reset-password", "/generate-otp"].some((path) => requestUrl.includes(path));
        if (error.response?.status !== 401 || !request || request._retriedAfterRefresh || skipRefresh) {
            return Promise.reject(error);
        }

        request._retriedAfterRefresh = true;
        try {
            refreshPromise ||= axios.post(API_BASE_URL + "/api/v1/user/refresh-token", {}, { withCredentials: true });
            await refreshPromise;
            return axios(request);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        } finally {
            refreshPromise = undefined;
        }
    }
);
