import React, { useEffect, useState } from 'react'
import BollingerChart from '../components/UrlStatusChart.jsx'
import { useDashboardContext } from '../Context/DashboardContextProvider.jsx'
import { useParams } from 'react-router'
import Loading from '../components/Loading.jsx'
import { AiOutlineSend } from "react-icons/ai";
import DeleteUrlMenu from '../components/DeleteUrlMenu.jsx'

function WebUrlDashboard() {
    const { urlId } = useParams()
    const useDashboard = useDashboardContext()
    const [url, setUrl] = useState([])
    const [lastUpdatedAt, setLastUpdatedAt] = useState()
    const [deleteForm, setDeleteForm] = useState(false)

    useEffect(() => {
        const setData = () => {
            useDashboard.getSingleUrl(urlId)
                .then((data) => setUrl(data))
        }
        setData()
        const intervalId = setInterval(() => {
            useDashboard.getSingleUrl(urlId)
                .then((data) => setUrl(data))
        }, 60000);

        return () => clearInterval(intervalId);
    }, [url]);

    let addedSinceTime = new Date() - new Date(url.data?.createdAt);
    addedSinceTime = Math.floor(addedSinceTime / 1000);
    const days = Math.floor(addedSinceTime / (24 * 60 * 60));
    const hours = Math.floor((addedSinceTime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((addedSinceTime % (60 * 60)) / 60);

    useEffect(() => {
        if (!url.data?.updatedAt) return;

        const intervalId = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const lastUpdated = Math.floor(new Date(url.data.updatedAt).getTime() / 1000);
            const elapsedSeconds = now - lastUpdated;

            const adjustedLastUpdatedAt = 180 - elapsedSeconds;

            if (adjustedLastUpdatedAt >= 0) {
                const displayMinutes = Math.floor(adjustedLastUpdatedAt / 60);
                const displaySeconds = adjustedLastUpdatedAt % 60;

                if (displayMinutes < 1) {
                    setLastUpdatedAt(`${displaySeconds} seconds`);
                } else {
                    setLastUpdatedAt(`${displayMinutes} minutes`);
                }
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [url.data?.updatedAt]);

    const sendAlert = async () => {
        const result = await useDashboard.sendTestAlert(url.data, `Dear Website user,\n\nI hope you’re doing well. I’m writing to share the results from the website test conducted on ${Date.now()}. I’m pleased to report that everything is functioning smoothly, and no issues were found.`, "Website Test Results\n\nIf you have any questions or need further information, feel free to reach out!\n\nBest,\nUptime Monitor")
        console.log(result)
    }

    if (url.length < 1) return <Loading />

    return (
        <div className='dark:bg-[#1F2433] overflow-hidden sm:px-32 p-8 px-4'>
            <div className='flex items-center gap-4 my-8'>
                <div className={`w-4 h-4 ${url.data?.statusCode < 400 ? "bg-green-600" : "bg-red-600"} rounded-full p-2 relative z-20`}></div>
                <div className={`w-4 h-4 ${url.data?.statusCode < 400 ? "bg-green-300" : "bg-red-300"} rounded-full p-2 absolute shrink-animation1 z-10`}></div>
                <div className='overflow-hidden break-words'>
                    <p className='text-3xl font-semibold'>{url.data?.Urls}</p>
                    <p className='mt-2'><span className={`font-semibold ${url.data?.statusCode < 400 ? "text-green-600" : "text-red-600"}`}>{url.data?.statusCode < 400 ? "Up" : "Down"}  </span>·  Checked every 3 minutes</p>
                </div>
            </div>
            <div className='my-8 flex gap-6'>
                <button className='bg-red-500 py-2 px-5 rounded-lg font-semibold' onClick={() => setDeleteForm(!deleteForm)}>Delete</button>
                <button className='border border-gray-500 py-2 px-5 rounded-lg flex items-center gap-3' onClick={sendAlert}><AiOutlineSend size={25} /> Send Test Alert</button>
            </div>
            <div className='flex sm:flex-row flex-col gap-6'>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Added Since</p>
                    <p className='text-xl font-semibold'>{days} days {hours} hours {minutes} mins</p>
                </div>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Last checked at</p>
                    <p className='text-xl font-semibold'>{lastUpdatedAt ? lastUpdatedAt : "0 seconds"} ago</p>
                </div>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Incidents</p>
                    <p className='text-xl font-semibold'>0</p>
                </div>
            </div>
            <div className='my-8 w-full'>
                <div className='dark:border-gray-600 border p-2 rounded-tr-md rounded-tl-md'>
                    Response Time
                </div>
                {
                    url.data && <BollingerChart initialData={url.data?.statusCodes} initialLabels={url.data?.statusCodes} />
                }
            </div>
            {deleteForm ? <DeleteUrlMenu cancel={setDeleteForm} url={url.data?._id} getBack={true} /> : ""}
        </div>
    )
}

export default WebUrlDashboard
