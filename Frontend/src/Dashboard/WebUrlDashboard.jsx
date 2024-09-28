import React, { useEffect, useState } from 'react'
import BollingerChart from '../components/UrlStatusChart.jsx'
import { useDashboardContext } from '../Context/DashboardContextProvider.jsx'
import { useParams } from 'react-router'

function WebUrlDashboard() {
    const { urlId } = useParams()
    const useDashboard = useDashboardContext()
    const [url, setUrl] = useState([])

    useEffect(() => {
        const gettingUrlData = async () => {
            const data = await useDashboard.getSingleUrl(urlId)
            setUrl(data)
        }

        gettingUrlData()
    }, [])

    let diff = new Date().getTime() - url.data?.statusCodes[url.data?.statusCodes.length - 1].time

    diff = Math.floor(diff / (1000 * 60));

    return (
        <div className='dark:bg-[##1F2433] sm:px-32 mt-8 px-4'>
            <div className='flex items-center gap-4 my-8'>
                <div className={`w-4 h-4 ${url.data?.statusCode < 400 ? "bg-green-600" : "bg-red-600"} rounded-full p-2`}></div>
                <div>
                    <h3 className='text-3xl font-semibold'>{url.data?.Urls}</h3>
                    <p className='mt-2'><span className={`font-semibold ${url.data?.statusCode < 400 ? "text-green-600" : "text-red-600"}`}>{url.data?.statusCode < 400 ? "Up" : "Down"}  </span>·  Checked every 3 minutes</p>
                </div>
            </div>
            <div className='flex sm:flex-row flex-col gap-6'>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Currently up for</p>
                    <p className='text-xl font-semibold'>29 days 8 hours 13 mins</p>
                </div>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Last checked at</p>
                    <p className='text-xl font-semibold'>{diff} minutes ago</p>
                </div>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Incidents</p>
                    <p className='text-xl font-semibold'>0</p>
                </div>
            </div>
            <div className='my-8 w-full'>
                <div className='border-black border p-2 rounded-tr-md rounded-tl-md'>
                    Response Time
                </div>
                {/* {url.data && <BollingerChart
                    initialData={url.data?.statusCodes.urlCheckStatus}
                    initialLabels={url.data?.statusCodes.urlCheckStatus}
                />} */}
            </div>
        </div>
    )
}

export default WebUrlDashboard