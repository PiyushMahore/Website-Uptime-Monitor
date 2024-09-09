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

            setLoading(false);
            return response.data;

        } catch (error) {
            setLoading(false);
            console.error('Error in SignUp:', error);
            // Optionally, handle the error, e.g., by setting an error state
            throw error; // Re-throwing the error might be useful for further handling
        }
    };


    const login = async (email, password) => {
        try {
            setLoading(true)
            const response = await axios.post('http://localhost:3000/api/v1/user/login', {
                'email': email,
                'password': password
            }, {
                withCredentials: true, // Ensure cookies are sent with the request
            });
            setLoading(false)
            return response.data

        } catch (error) {
            setLoading(false)
            console.log("Error in Login", error)
        }
    };

    async function getCurrentUser() {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/user/current-user', {
                withCredentials: true, // This ensures cookies are sent with the request
            });
            return response.data;
        } catch (error) {
            console.log('Erro While getting user', error)
            return null;
        }
    }

    return (
        <userContext.Provider value={{ loading, login, signUp, getCurrentUser }}>
            {props.children}
        </userContext.Provider>
    )
}

export const useProvider = () => useContext(userContext)
