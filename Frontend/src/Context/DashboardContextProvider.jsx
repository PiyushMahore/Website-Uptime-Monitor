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
            const urls = await axios.get("http://localhost:3000/api/v1/webUrls/get-website-url", {
                withCredentials: true, // This ensures cookies are sent with the request
            })
            setAllUrls(urls.data.data)

        } catch (error) {
            console.log("somthing went wrong while getting urls", error)
        }
    }

    useEffect(() => {
        getAllUrls()
    }, [])

    const deleteUrl = async (urlId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/v1/webUrls/remove-website-url`, {
                data: { urlId },
                withCredentials: true, // Ensure cookies are sent with the request
            });
            return response.data;

        } catch (error) {
            console.log("Something went wrong while deleting the URL", error);
        }
    }

    const fetchUrls = async (urlDesc) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/webUrls/check-urls`, {
                "urlDesc": urlDesc
            })
            return response.data;

        } catch (error) {
            console.log("Somthing went wrong while fetching URLs", error)
        }
    }

    return (
        <dashboardContext.Provider value={{ addUrl, allUrls, deleteUrl, getAllUrls, fetchUrls }}>
            {props.children}
        </dashboardContext.Provider>
    )
}

export const useDashboardContext = () => useContext(dashboardContext)
