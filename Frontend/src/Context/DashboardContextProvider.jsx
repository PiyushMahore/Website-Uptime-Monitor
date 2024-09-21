import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const dashboardContext = createContext()

export const DashboardContextProvider = (props) => {
    const [notWorkingUrls, setNotWorkingUrls] = useState([])
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

    const fetchUrl = async (url) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/webUrls/fetch-url', {
                url // send the url as a query parameter
            })
            return response.data

        } catch (error) {
            console.log("somthing went wrong while fetching url", error)
        }
    }

    const alertSender = async (userData) => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/webUrls/alert', {
                receiversdata: userData,
            });
            return response.data;

        } catch (error) {
            console.log("something went wrong sending alert", error);
        }
    };

    return (
        <dashboardContext.Provider value={{ addUrl, allUrls, deleteUrl, fetchUrl, getAllUrls, notWorkingUrls, setNotWorkingUrls, alertSender }}>
            {props.children}
        </dashboardContext.Provider>
    )
}

export const useDashboardContext = () => useContext(dashboardContext)