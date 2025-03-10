import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const dashboardContext = createContext()

export const DashboardContextProvider = (props) => {
    const [allUrls, setAllUrls] = useState([])

    const addUrl = async (Url, notificationType) => {
        try {
            const url = await axios.post("http://localhost:3000/api/v1/webUrls/add-website-url", {
                "url": Url,
                "notificationType": notificationType
            }, {
                withCredentials: true, // Ensure cookies are sent with the request
            })
            return url.data

        } catch (error) {
            console.log("somthing went wrong while adding urls", error)
        }
    }

    const getAllUrls = async () => {
        try {
            await axios.get("http://localhost:3000/api/v1/webUrls/get-website-url", {
                withCredentials: true, // This ensures cookies are sent with the request
            })
                .then((data) => setAllUrls(data.data.data))

        } catch (error) {
            console.log("somthing went wrong while getting urls", error)
        }
    }

    const deleteUrl = async (urlId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/v1/webUrls/remove-website-url`, {
                data: { urlId },
                withCredentials: true,
            });
            return response.data;

        } catch (error) {
            console.log("Something went wrong while deleting the URL", error);
        }
    }

    const getSingleUrl = async (urlId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/webUrls/get-single-url/${urlId}`)
            return response.data;

        } catch (error) {
            console.log("somthing went wrong while getting single url")
        }
    }

    const sendTestAlert = async (urlDesc, message, subject) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/webUrls/send-url-alert`, {
                "urlDesc": urlDesc,
                "message": message,
                "subject": subject
            })
            return response.data

        } catch (error) {
            console.log("somthing went wrong while sending test alert")
        }
    }

    const checkUrl = async (url) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/webUrls/check-url', {
                "url": url
            })
            return response.data

        } catch (error) {
            console.log("somthing went wrong while checking url")
        }
    }

    return (
        <dashboardContext.Provider value={{ addUrl, allUrls, deleteUrl, getAllUrls, getSingleUrl, sendTestAlert, checkUrl }}>
            {props.children}
        </dashboardContext.Provider>
    )
}

export const useDashboardContext = () => useContext(dashboardContext)
