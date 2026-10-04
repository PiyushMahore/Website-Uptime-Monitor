import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_TARGET_ORIGIN } from "../config";
import PropTypes from "prop-types";

const userContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState()

    const signUp = async (fullName, userName, email, password, mobileNumber, coverImage) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('userName', userName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('mobileNumber', mobileNumber);
            if (coverImage instanceof File) formData.append('coverImage', coverImage);

            const response = await axios.post(`${API_BASE_URL}/api/v1/user/signup`, formData, {
                withCredentials: true,
            });
            if (response.data?.success && response.data?.data?._id) {
                setUser(response.data.data);
            }

            return response.data;

        } catch (error) {
            console.error("Signup request failed:", error);
            return error.response?.data ?? {
                success: false,
                message: `Couldn't reach the API at ${API_TARGET_ORIGIN} from ${window.location.origin}. Check that the backend is running and inspect the browser network error.`,
            };
        } finally {
            setLoading(false);
        }
    };


    const login = async (loginCredintial, password) => {
        try {
            setLoading(true)
            const response = await axios.post(`${API_BASE_URL}/api/v1/user/login`, {
                'loginCredintial': loginCredintial,
                'password': password
            }, {
                withCredentials: true, // Ensure cookies are sent with the request
            });
            if (response.data?.success && response.data?.data?._id) {
                setUser(response.data.data);
            }
            return response.data

        } catch (error) {
            return error.response?.data ?? {
                success: false,
                message: "Unable to sign in. Check your connection and try again.",
            };
        } finally {
            setLoading(false)
        }
    };

    async function getCurrentUser() {
        setLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/user/current-user`, {
                withCredentials: true, // This ensures cookies are sent with the request
            })
            if (response.data?.data) setUser(response.data.data)
            return response.data;
        } catch {
            return null
        } finally {
            setLoading(false)
        }
    }

    async function generateOtp(email) {
        setLoading(true)
        try {
            const response = await axios.post(API_BASE_URL + "/api/v1/user/generate-otp", { email })
            return response.data
        } catch (error) {
            return error.response?.data || null
        } finally {
            setLoading(false)
        }
    }

    async function resetPassword(email, otp, password) {
        setLoading(true)
        try {
            const response = await axios.patch(API_BASE_URL + "/api/v1/user/reset-password", { email, otp, password })
            return response.data
        } catch (error) {
            return error.response?.data || null
        } finally {
            setLoading(false)
        }
    }

    async function updateUser(userName, password, newPassword, email, mobileNumber, fullName, profilePicture) {
        const formData = new FormData();
        formData.append('userName', userName);
        if (password) formData.append('password', password);
        if (newPassword) formData.append('newPassword', newPassword);
        formData.append('email', email);
        formData.append('mobileNumber', mobileNumber);
        formData.append('fullName', fullName);
        if (profilePicture instanceof File) formData.append('profilePicture', profilePicture);

        try {
            const response = await axios.patch(`${API_BASE_URL}/api/v1/user/update-user`, formData, {
                withCredentials: true,
            });

            if (response.data?.data) setUser(response.data.data);
            return response.data;
        } catch (error) {
            return error.response?.data ?? { success: false, message: 'Unable to update your profile. Check your connection and try again.' };
        }
    }

    async function logOut() {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/user/logout`, {}, {
                withCredentials: true
            })
            setUser(undefined)
            return response.data;

        } catch (error) {
            return error.response?.data ?? { success: false, message: 'Unable to sign out. Please try again.' }
        }
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <userContext.Provider value={{ loading, setLoading, login, signUp, getCurrentUser, generateOtp, resetPassword, updateUser, logOut, user }}>
            {children}
        </userContext.Provider>
    )
}

UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const useUserContext = () => useContext(userContext)
