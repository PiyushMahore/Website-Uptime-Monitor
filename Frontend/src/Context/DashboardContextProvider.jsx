import { createContext, useCallback, useContext, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import PropTypes from "prop-types";

const dashboardContext = createContext()

export const DashboardContextProvider = ({ children }) => {
    const [allUrls, setAllUrls] = useState([])

    const addUrl = useCallback(async (Url, notificationType) => {
        try {
            const url = await axios.post(`${API_BASE_URL}/api/v1/webUrls/add-website-url`, {
                "url": Url,
                "notificationType": notificationType
            }, {
                withCredentials: true, // Ensure cookies are sent with the request
            })
            if (url.data?.success && url.data?.data?._id) {
                setAllUrls((current) => [url.data.data, ...current.filter((monitor) => monitor._id !== url.data.data._id)])
            }
            return url.data

        } catch (error) {
            return error.response?.data ?? { success: false, message: "Could not add this monitor. Please try again." }
        }
    }, [])

    const getAllUrls = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/webUrls/get-website-url`, {
                withCredentials: true, // This ensures cookies are sent with the request
            })
            const urls = Array.isArray(response.data?.data) ? response.data.data : []
            setAllUrls(urls)
            return response.data

        } catch (error) {
            return error.response?.data ?? { success: false, message: "Could not load your monitors. Please refresh and try again." }
        }
    }, [])

    const deleteUrl = useCallback(async (urlId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/v1/webUrls/remove-website-url`, {
                data: { urlId },
                withCredentials: true,
            });
            if (response.data?.success) setAllUrls((current) => current.filter((monitor) => monitor._id !== urlId))
            return response.data;

        } catch (error) {
            return error.response?.data ?? { success: false, message: "Could not delete this monitor. Please try again." }
        }
    }, [])

    const getSingleUrl = useCallback(async (urlId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/webUrls/get-single-url/${urlId}`, { withCredentials: true })
            return response.data;

        } catch (error) {
            return error.response?.data ?? { success: false, message: "Could not load this monitor. Check your connection and try again." }
        }
    }, [])

    const sendTestAlert = useCallback(async (urlId, subject, message) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/webUrls/send-url-alert`, {
                urlId,
                subject,
                message,
            }, { withCredentials: true })
            return response.data

        } catch (error) {
            return error.response?.data ?? {
                success: false,
                message: "The test email could not be sent. Check your connection and try again.",
            }
        }
    }, [])

    const checkUrl = useCallback(async (url) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/webUrls/check-url`, {
                "url": url
            })
            return response.data

        } catch (error) {
            return error.response?.data ?? { success: false, message: "Could not check the website right now." }
        }
    }, [])

    const clearUrls = useCallback(() => setAllUrls([]), [])

    const contextValue = useMemo(
        () => ({ addUrl, allUrls, clearUrls, deleteUrl, getAllUrls, getSingleUrl, sendTestAlert, checkUrl }),
        [addUrl, allUrls, clearUrls, deleteUrl, getAllUrls, getSingleUrl, sendTestAlert, checkUrl]
    )

    return (
        <dashboardContext.Provider value={contextValue}>
            {children}
        </dashboardContext.Provider>
    )
}

DashboardContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const useDashboardContext = () => useContext(dashboardContext)
