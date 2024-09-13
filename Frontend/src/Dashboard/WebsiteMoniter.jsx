import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import AddUrlForm from "../components/AddUrlForm.jsx";
import { GiRadarSweep } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import DeleteUrlMenu from '../components/DeleteUrlMenu.jsx';
import { useDashboardContext } from '../Context/DashboardContextProvider.jsx';

function WebsiteMoniter() {
    const useDashboard = useDashboardContext()

    const [webDisplay, setWebdisplay] = useState(true)
    const [addUrlForm, setAddUrlForm] = useState(false)
    const [deleteForm, setDeleteForm] = useState(false)
    const [allUrls, setAllUrls] = useState([])
    const [datetingUrl, setDatetingUrl] = useState(null)

    useEffect(() => {
        setAllUrls(useDashboard.allUrls)
    }, [useDashboard.allUrls])

    useEffect(() => {
        const fetching = async () => {
            allUrls.map(async (data) => {
                const fetching = await useDashboard.fetchUrl(data.Urls)
                if (fetching.data.statusCode >= 500) {
                    useDashboard.setNotWorkingUrls((prev) => [...prev, fetching.data.URL[0]])
                }
            })
        }

        fetching()
    }, [allUrls])

    return (
        <div className={`min-h-screen sm:px-[10%] sm:pt-[5%] px-4 py-4 bg-[#222838] relative`}>
            <div className={`flex justify-start ${addUrlForm || deleteForm ? "blur-sm" : ""}`}>
                <div className='flex sm:gap-16 gap-6 flex-wrap'>
                    <h1 className='sm:text-3xl text-xl font-bold'>How has your day been so far, Piyush ?</h1>
                    <div className='flex flex-col sm:flex-row justify-start gap-6 items-start sm:items-center'>
                        <div className='flex items-center text-gray-500'>
                            <div className='absolute ml-2'><IoIosSearch /></div>
                            <input placeholder='Search' className='pl-8 h-8 w-72 rounded-lg focus:outline-none border border-gray-500 inputShadow bg-[#222838] text-white' type="search" />
                        </div>
                        <button onClick={() => setAddUrlForm(true)} className='bg-[#5B63D3] rounded-lg hover:bg-[#3788d8] px-4 py-1.5'>Create monitor</button>
                    </div>
                </div>
            </div>

            {addUrlForm ? <AddUrlForm toggleForm={setAddUrlForm} /> : ""}

            <div className={`mt-12 ${addUrlForm ? "blur-sm" : ""} duration-300 overflow-hidden`}>
                <div className={`border border-gray-500 rounded-lg ${webDisplay ? "max-h-[1000px]" : "max-h-[41.5px] border-0"} transition-all duration-500 ease-in-out`}>
                    <span className={`flex items-center gap-2 px-5 py-2 border border-gray-500 rounded-md ${webDisplay ? "rounded-b-none" : ""}`}><MdArrowForwardIos onClick={() => setWebdisplay(!webDisplay)} className={`${webDisplay ? "rotate-90" : ""} duration-300`} /> Moniter</span>

                    <div className='rounded-b-lg overflow-hidden bg-[#2F3647]'>
                        {
                            allUrls && allUrls.map((data) => (
                                <span key={data._id}>
                                    <div className='pl-12 py-3'>
                                        <div className='flex items-center justify-between sm:pr-24'>
                                            <div className='flex items-center gap-7'>
                                                <div className={`w-2.5 h-2.5 ${useDashboard.notWorkingUrls?.find((id) => id._id === data._id) ? "bg-red-600" : "bg-green-400"} rounded-full`}></div>
                                                <div className='text-sm'>
                                                    <p className='font-bold break-words w-60 sm:w-[550px] 2xl:w-full'>{data.Urls}</p>
                                                    <p className='text-green-600'>Up<span className='text-gray-400 ml-2 text-xs'>{`· ${data.createdAt.slice(0, 10)}`}</span></p>
                                                </div>
                                            </div>
                                            <div className='sm:flex hidden items-center gap-12'>
                                                <div className='flex items-center gap-2'>
                                                    <GiRadarSweep />
                                                    <p>3m</p>
                                                </div>
                                                <div>
                                                    <MdDelete onClick={() => {
                                                        setDeleteForm(true)
                                                        setDatetingUrl(data.Urls)
                                                    }} cursor={"Pointer"} size={20} color='red' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="border-gray-500" />
                                </span>
                            ))
                        }

                        {deleteForm ? <DeleteUrlMenu cancel={setDeleteForm} url={datetingUrl} /> : ""}

                    </div>
                </div>
            </div>
        </div >
    )
}

export default WebsiteMoniter
