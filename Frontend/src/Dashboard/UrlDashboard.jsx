import React, { useEffect, useState } from 'react'
import { useDashboardContext } from '../Context/DashboardContextProvider.jsx'
import { useParams } from 'react-router'
import Loading from '../components/Loading.jsx'
import { AiOutlineSend } from "react-icons/ai";
import DeleteUrlMenu from '../components/DeleteUrlMenu.jsx'
import { IoMdArrowBack } from 'react-icons/io'
import TimingChart from '../components/UrlStatusGraphChart.jsx'

function UrlDashboard() {
    const { urlId } = useParams()
    const useDashboard = useDashboardContext()

    const [url, setUrl] = useState([])
    const [lastUpdatedAt, setLastUpdatedAt] = useState("0 seconds")
    const [deleteForm, setDeleteForm] = useState(false)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)
    const [day, setDay] = useState(0)
    const [incidents, setIncidents] = useState(0)

    useEffect(() => {
        const setData = () => {
            useDashboard.getSingleUrl(urlId)
                .then((data) => setUrl(data))
            let addedSinceTime = new Date() - new Date(url.data?.createdAt);
            addedSinceTime = Math.floor(addedSinceTime / 1000);
            setDay(Math.floor(addedSinceTime / (24 * 60 * 60)));
            setHours(Math.floor((addedSinceTime % (24 * 60 * 60)) / (60 * 60)));
            setMinutes(Math.floor((addedSinceTime % (60 * 60)) / 60));
        }

        setData();
    }, [url.data?.createdAt]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            useDashboard.getSingleUrl(urlId)
                .then((data) => setUrl(data))
            let addedSinceTime = new Date() - new Date(url.data?.createdAt);
            addedSinceTime = Math.floor(addedSinceTime / 1000);
            setDay(Math.floor(addedSinceTime / (24 * 60 * 60)));
            setHours(Math.floor((addedSinceTime % (24 * 60 * 60)) / (60 * 60)));
            setMinutes(Math.floor((addedSinceTime % (60 * 60)) / 60));
            if (url?.data.statusCode >= 500) {
                setIncidents((prev) => prev + 1)
            }
        }, 60000);

        return () => clearInterval(intervalId);
    }, [])


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
        await useDashboard.sendTestAlert(url.data, `Dear Website user,\n\nI hope you’re doing well. I’m writing to share the results from the website test conducted on ${new Date(Date.now()).toLocaleDateString("en-GB")} at ${new Date().getHours()}:${new Date().getMinutes()}. I’m pleased to report that everything is functioning smoothly, and no issues were found. Website Test Results\n\nIf you have any questions or need further information, feel free to reach out!\n\nBest Regards,\nUptime Monitor`, "Website Test Results")
    }

    if (!url.data) return <Loading />

    return (
        <div className='dark:bg-[#1F2433] h-screen'>
            <div>
                <span className='flex px-2 py-2'><IoMdArrowBack onClick={() => window.history.back()} size={25} /></span>
                <hr className='border border-black dark:border-gray-300' />
            </div>
            <div className='dark:bg-[#1F2433] h-fit overflow-hidden sm:px-32 p-8 px-4'>
                <div className='flex items-center gap-4 my-8'>
                    <div className={`w-4 h-4 ${url.data?.statusCode < 500 ? "bg-green-600" : "bg-red-600"} rounded-full p-2 relative z-20`}></div>
                    <div className={`w-4 h-4 ${url.data?.statusCode < 500 ? "bg-green-300" : "bg-red-300"} rounded-full p-2 absolute shrink-animation1 z-10`}></div>
                    <div className='overflow-hidden break-words'>
                        <a href={url.data?.Urls} className='text-3xl font-semibold'>{url.data?.Urls}</a>
                        <p className='mt-2'><span className={`font-semibold ${url.data?.statusCode < 500 ? "text-green-600" : "text-red-600"}`}>{url.data?.statusCode < 500 ? "Up" : "Down"}  </span>·  Checked every 3 minutes</p>
                    </div>
                </div>
                <div className='my-8 flex gap-6'>
                    <button className='bg-red-500 py-2 px-5 rounded-lg font-semibold border-gray-500 border hover:border-none' onClick={() => setDeleteForm(!deleteForm)}>Delete</button>
                    <button className='border border-gray-500 py-2 px-5 rounded-lg flex items-center gap-3' onClick={sendAlert}><AiOutlineSend size={25} /> Send Test Alert</button>
                </div>
                <div className='flex sm:flex-row flex-col gap-6'>
                    <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                        <p>Added Since</p>
                        <p className='text-xl font-semibold'>{day} days {hours} hours {minutes} mins</p>
                    </div>
                    <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                        <p>Next checke at</p>
                        <p className='text-xl font-semibold'>{lastUpdatedAt} </p>
                    </div>
                    <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                        <p>Incidents</p>
                        <p className='text-xl font-semibold'>{incidents}</p>
                    </div>
                </div>
                <div className='my-8 w-full'>
                    <div className='dark:border-gray-600 border border-black p-2 rounded-tr-md rounded-tl-md'>
                        Response Time
                    </div>
                    {
                        url.data && <TimingChart data={url.data?.statusCodes} />
                    }
                </div>
                {deleteForm ? <DeleteUrlMenu setDeleteForm={setDeleteForm} url={url.data?._id} getBack={true} /> : ""}
            </div>
        </div>
    )
}

export default UrlDashboard
