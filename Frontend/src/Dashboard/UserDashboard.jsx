import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import AddUrlForm from "../components/AddUrlForm.jsx";
import { GiRadarSweep } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import DeleteUrlMenu from '../components/DeleteUrlMenu.jsx';
import { useDashboardContext } from '../Context/DashboardContextProvider.jsx';
import { MdRefresh } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { useUserContext } from '../Context/UserContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import { CgProfile } from "react-icons/cg";

function UserDashboard() {
    const useAuth = useUserContext()
    const useDashboard = useDashboardContext()

    const [webDisplay, setWebdisplay] = useState(true)
    const [addUrlForm, setAddUrlForm] = useState(false)
    const [deleteForm, setDeleteForm] = useState(false)
    const [datetingUrl, setDatetingUrl] = useState(null)
    const [filterdUrls, setFilterdUrls] = useState([])
    const [searchInput, setSearchInput] = useState("")
    const [randomQuteNum, setRandomQuteNum] = useState(0)

    useEffect(() => {
        setRandomQuteNum(Math.floor(Math.random() * 21))
    }, [])

    let greetingsAndQuestions = [
        `Hello, ${useAuth.user?.fullName.split(" ")[0]}! How's your day going?`,
        `Hi ${useAuth.user?.fullName.split(" ")[0]}, what's new with you today?`,
        `Good to see you, ${useAuth.user?.fullName.split(" ")[0]}! Any exciting plans?`,
        `Hey ${useAuth.user?.fullName.split(" ")[0]}! How have you been?`,
        `Hi ${useAuth.user?.fullName.split(" ")[0]}, hope everything is going well!`,
        `Good morning, ${useAuth.user?.fullName.split(" ")[0]}! How did you sleep?`,
        `Hello ${useAuth.user?.fullName.split(" ")[0]}! Ready to tackle the day?`,
        `Hey ${useAuth.user?.fullName.split(" ")[0]}, what are you working on today?`,
        `Hi ${useAuth.user?.fullName.split(" ")[0]}, how's everything on your side?`,
        `What's up, ${useAuth.user?.fullName.split(" ")[0]}? How's your week been?`,
        `Good afternoon, ${useAuth.user?.fullName.split(" ")[0]}! What’s on your agenda?`,
        `Evening, ${useAuth.user?.fullName.split(" ")[0]}! How was your day?`,
        `Hi ${useAuth.user?.fullName.split(" ")[0]}, any new updates you'd like to share?`,
        `Hey ${useAuth.user?.fullName.split(" ")[0]}! Long time no see, how have you been?`,
        `Hello ${useAuth.user?.fullName.split(" ")[0]}! Have you done anything fun recently?`,
        `Good evening, ${useAuth.user?.fullName.split(" ")[0]}! How's everything going?`,
        `Hi ${useAuth.user?.fullName.split(" ")[0]}, did anything interesting happen today?`,
        `Hey ${useAuth.user?.fullName.split(" ")[0]}! Got any fun plans for the weekend?`,
        `Good day, ${useAuth.user?.fullName.split(" ")[0]}! How are you feeling today?`,
        `Hello ${useAuth.user?.fullName.split(" ")[0]}, what’s been on your mind lately?`
    ];

    useEffect(() => {
        const filteredOne = useDashboard.allUrls.filter((url) => url.Urls.includes(searchInput))
        setFilterdUrls(filteredOne)
    }, [useDashboard.allUrls, searchInput])

    useEffect(() => {
        useAuth.getCurrentUser()
        useDashboard.getAllUrls()
    }, [])

    if (!useAuth.user || useAuth.loading) return <Loading />

    return (
        <div className='min-h-screen dark:bg-[#222838]'>
            <div className='sm:px-8 p-2 py-2'>
                <NavLink to={`/dashboard/profile/${useAuth.user?._id}`}><CgProfile size={30} /></NavLink>
            </div>
            <hr className='border border-black dark:border-gray-300' />
            <div className={`min-h-screen sm:px-[10%] px-4 dark:bg-[#222838] relative`}>
                <div className={`flex justify-start ${addUrlForm || deleteForm ? "blur-sm" : ""} sm:pt-[5%] py-4`}>
                    <div className='flex sm:gap-16 gap-6 flex-wrap items-center'>
                        <h1 className='sm:text-3xl text-lg font-bold'>{greetingsAndQuestions[randomQuteNum]}</h1>
                        <div className='flex flex-col sm:flex-row justify-start gap-6 items-start sm:items-center'>
                            <div className='flex items-center dark:text-gray-500 text-black'>
                                <div className='absolute ml-2'><IoIosSearch /></div>
                                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Search' className='pl-8 pr-1.5 h-8 w-72 rounded-lg focus:outline-none border border-gray-500 inputShadow dark:bg-[#222838] dark:text-white' type="search" />
                            </div>
                            <button onClick={() => setAddUrlForm(true)} className='bg-[#5B63D3] rounded-lg hover:bg-[#3788d8] px-4 py-1.5'>Create monitor</button>
                        </div>
                    </div>
                </div>

                {addUrlForm ? <AddUrlForm toggleForm={setAddUrlForm} setInput={setSearchInput} /> : ""}

                <div className={`pb-4 mt-12 ${addUrlForm ? "blur-sm" : ""} duration-300 overflow-hidden`}>
                    <div className={`border border-gray-500 rounded-lg ${webDisplay ? "max-h-[1000px]" : "max-h-[43px] border-0"} transition-all duration-500 ease-in-out`}>
                        <span className={`flex items-center justify-between gap-2 px-5 py-2 border border-gray-500 rounded-md ${webDisplay ? "rounded-b-none" : ""}`}>
                            <span className='flex items-center gap-2'>
                                <MdArrowForwardIos onClick={() => setWebdisplay(!webDisplay)} className={`${webDisplay ? "rotate-90" : ""} duration-300`} />
                                Moniter
                            </span>
                            <MdRefresh className='cursor-pointer' onClick={() => window.location.reload()} size={25} />
                        </span>

                        <div className='rounded-b-lg overflow-hidden dark:bg-[#2F3647] bg-gray-200'>
                            {
                                filterdUrls && filterdUrls.map((data) => (
                                    <span key={data._id}>
                                        <div className='pl-12 py-3'>
                                            <div className='flex items-center justify-between sm:pr-24'>
                                                <NavLink to={`/dashboard/${useAuth.user._id}/url/${data._id}`} className='flex items-center gap-7'>
                                                    <div className={`w-3 h-3 ${data.statusCode >= 500 ? "bg-red-700" : "bg-green-700"} rounded-full relative z-20`}></div>
                                                    <div className={`w-3 h-3 ${data.statusCode >= 500 ? "bg-red-300" : "bg-green-300"} rounded-full shrink-animation z-10 ${webDisplay ? "absolute" : "hidden"}`}></div>
                                                    <div className='text-sm'>
                                                        <p className='font-bold break-words w-60 sm:w-[550px] 2xl:w-full'>{data.Urls}</p>
                                                        <p className='text-green-600'>Up<span className='dark:text-gray-400 text-gray-600 ml-2 text-xs'>{`· ${data.createdAt.slice(0, 10)}`}</span></p>
                                                    </div>
                                                </NavLink>
                                                <div className='sm:flex hidden items-center gap-12'>
                                                    <div className='flex items-center gap-2'>
                                                        <GiRadarSweep />
                                                        <p>3m</p>
                                                    </div>
                                                    <div>
                                                        <MdDelete onClick={() => {
                                                            setDeleteForm(true)
                                                            setDatetingUrl(data._id)
                                                        }} cursor={"Pointer"} size={20} color='red' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="border-gray-500" />
                                    </span>
                                ))
                            }

                            {deleteForm ? <DeleteUrlMenu setDeleteForm={setDeleteForm} url={datetingUrl} /> : ""}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
