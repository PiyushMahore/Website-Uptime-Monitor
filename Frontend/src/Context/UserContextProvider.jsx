import { createContext, useContext, useState } from "react";
import axios from "axios";

const userContext = createContext();

export const UserContextProvider = (props) => {
    const [loading, setLoading] = useState(false)

    const signUp = async (fullName, userName, email, password, mobileNumber, coverImage) => {
        try {
            setLoading(true);

            // Create a FormData object
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('userName', userName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('mobileNumber', mobileNumber);
            formData.append('coverImage', coverImage);

            // Send the POST request with FormData
            const response = await axios.post('http://localhost:3000/api/v1/user/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // This is actually not necessary, Axios sets this automatically for FormData
                },
                withCredentials: true, // Ensure cookies are sent with the request
            });

            setTimeout(() => {
                setLoading(false)
            }, 500);
            return response.data;

        } catch (error) {
            setTimeout(() => {
                setLoading(false)
            }, 500);
            console.error('Error in SignUp:', error);
            // Optionally, handle the error, e.g., by setting an error state
            throw error; // Re-throwing the error might be useful for further handling
        }
    };


    const login = async (loginCredintial, password) => {
        try {
            setLoading(true)
            const response = await axios.post('http://localhost:3000/api/v1/user/login', {
                'loginCredintial': loginCredintial,
                'password': password
            }, {
                withCredentials: true, // Ensure cookies are sent with the request
            });
            setTimeout(() => {
                setLoading(false)
            }, 500);
            return response.data

        } catch (error) {
            setTimeout(() => {
                setLoading(false)
            }, 500);
            return "Password is Wrong"
        }
    };

    async function getCurrentUser() {
        setLoading(true)
        try {
            const response = await axios.get('http://localhost:3000/api/v1/user/current-user', {
                withCredentials: true, // This ensures cookies are sent with the request
            });
            setTimeout(() => {
                setLoading(false)
            }, 500);
            return response.data;
        } catch (error) {
            setTimeout(() => {
                setLoading(false)
            }, 500);
            console.log('You are not logged in please login for more features')
        }
    }

    async function generateOtp(email, message, subject) {
        setLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/generate-otp', {
                "email": email,
                "message": message,
                "subject": subject
            })
            setTimeout(() => {
                setLoading(false)
            }, 500);
            return response.data

        } catch (error) {
            setTimeout(() => {
                setLoading(false)
            }, 500);
            return 'invalid Crediantials'
        }
    }

    async function resetPassword(email, password) {
        setLoading(true)
        try {
            const response = await axios.patch(`http://localhost:3000/api/v1/user/reset-password`, {
                "email": email,
                "password": password
            })
            setTimeout(() => {
                setLoading(false)
            }, 500);
            return response.data

        } catch (error) {
            setTimeout(() => {
                setLoading(false)
            }, 500);
            return 'unable to change password'
        }
    }

    return (
        <userContext.Provider value={{ loading, setLoading, login, signUp, getCurrentUser, generateOtp, resetPassword }}>
            {props.children}
        </userContext.Provider>
    )
}

export const useUserContext = () => useContext(userContext)
