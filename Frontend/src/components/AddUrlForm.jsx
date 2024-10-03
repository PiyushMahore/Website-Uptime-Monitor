import React, { useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDashboardContext } from '../Context/DashboardContextProvider';

function AddUrlForm({ toggleForm }) {
    const useDashboard = useDashboardContext()

    const [notificationType, setNotificationType] = useState("")
    const [url, setUrl] = useState("")
    const addUrl = async () => {
        if (notificationType === "") {
            throw Error("please slect alert option")
        }
        await useDashboard.addUrl(url, notificationType)
        toggleForm(false)
    }

    return (
        <div className='dark:text-white dark:bg-[#222838] text-black w-screen rounded-md sm:w-fit bg-white absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 p-2 z-20 border border-gray-500'>
            <div className='relative dark:bg-custom-gradient sm:px-32 px-1 py-16'>
                <button className='absolute top-3 right-3 text-2xl hover:scale-110 duration-200' onClick={() => toggleForm(false)}><AiOutlineCloseCircle /></button>
                <h1 className='text-center text-3xl'>Add URL:</h1>
                <div>
                    <input value={url} onChange={(e) => setUrl(e.target.value)} className='mt-4 focus:outline-none border dark:border-gray-300 border-gray-900 rounded-l-md w-72 lg:w-60 p-1 text-black' type="text" placeholder='Enter Your Website Url' />
                    <button onClick={addUrl} className='bg-red-500 py-[5px] px-4 rounded-r-md text-center hover:scale-110 duration-200'>Add</button>
                    <form className='mt-3 flex items-center justify-center gap-1.5'>
                        <input onChange={(e) => setNotificationType(e.target.value)} className='w-4 h-4' type="radio" value={"email"} name='option' />
                        <label htmlFor="email">email</label>
                        <input onChange={(e) => setNotificationType(e.target.value)} className='w-4 h-4' type="radio" value={"text"} name='option' />
                        <label htmlFor="text">text</label>
                        <input onChange={(e) => setNotificationType(e.target.value)} className='w-4 h-4' type="radio" value={"call"} name='option' />
                        <label htmlFor="call">call</label>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddUrlForm
