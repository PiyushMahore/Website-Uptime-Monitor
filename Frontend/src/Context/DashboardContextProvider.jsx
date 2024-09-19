import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyAjrn96MtSm4m7jYvnpS3Z6Wd_kd6e9mFM",
    authDomain: "uptime-monitor-23aa0.firebaseapp.com",
    projectId: "uptime-monitor-23aa0",
    storageBucket: "uptime-monitor-23aa0.appspot.com",
    messagingSenderId: "432276213303",
    appId: "1:432276213303:web:509679754f57b56cc539b2",
    measurementId: "G-PNTNHXN9GP",
    vapidKey: "Zz3rDiYsJK-VVIZFxWKpeKkarCS8YOdDfimEUJMhzSo"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

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
            const token = await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });
            const response = await axios.post('http://localhost:3000/api/v1/webUrls/alert', {
                receiversdata: userData,
                token: token
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