import React, { useEffect, useState } from 'react'
import BollingerChart from '../components/UrlStatusChart.jsx'
import { useDashboardContext } from '../Context/DashboardContextProvider.jsx'
import { useParams } from 'react-router'
import Loading from '../components/Loading.jsx'

function WebUrlDashboard() {
    const { urlId } = useParams()
    const useDashboard = useDashboardContext()
    const [url, setUrl] = useState([])

    useEffect(() => {
        useDashboard.getSingleUrl(urlId)
            .then((data) => setUrl(data))
    }, [])

    let lastUpdated = new Date() - new Date(url.data?.updatedAt);
    lastUpdated = Math.floor(lastUpdated / 1000);
    console.log(lastUpdated);
    let lastUpdatedAt = Math.floor((lastUpdated % (60 * 60)) / 60);

    setInterval(() => {
        useDashboard.getSingleUrl(urlId)
            .then((data) => setUrl(data))
    }, 60000);

    let addedSinceTime = new Date() - new Date(url.data?.createdAt)
    addedSinceTime = Math.floor(addedSinceTime / 1000);
    const days = Math.floor(addedSinceTime / (24 * 60 * 60));
    const hours = Math.floor((addedSinceTime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((addedSinceTime % (60 * 60)) / 60);

    setInterval(() => {
        let lastUpdated = new Date() - new Date(url.data?.updatedAt);
        lastUpdated = Math.floor(lastUpdated / 1000);
        console.log(lastUpdated, "form Interval");
        lastUpdatedAt = Math.floor((lastUpdated % (60 * 60)) / 60);
    }, 60000);

    if (url.length < 1) return <Loading />

    return (
        <div className='dark:bg-[#1F2433] overflow-hidden sm:px-32 p-8 px-4'>
            <div className='flex items-center gap-4 my-8'>
                <div className={`w-4 h-4 ${url.data?.statusCode < 400 ? "bg-green-600" : "bg-red-600"} rounded-full p-2`}></div>
                <div className='overflow-hidden break-words'>
                    <p className='text-3xl font-semibold'>{url.data?.Urls}</p>
                    <p className='mt-2'><span className={`font-semibold ${url.data?.statusCode < 400 ? "text-green-600" : "text-red-600"}`}>{url.data?.statusCode < 400 ? "Up" : "Down"}  </span>·  Checked every 3 minutes</p>
                </div>
            </div>
            <div className='flex sm:flex-row flex-col gap-6'>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Added Since</p>
                    <p className='text-xl font-semibold'>{days} days {hours} hours {minutes} mins</p>
                </div>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Last checked at</p>
                    <p className='text-xl font-semibold'>{lastUpdatedAt} minutes ago</p>
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
        </div>
    )
}

export default WebUrlDashboard
