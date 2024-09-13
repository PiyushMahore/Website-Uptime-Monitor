import React, { useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDashboardContext } from '../Context/DashboardContextProvider';

function AddUrlForm({ toggleForm }) {
    const useDashboard = useDashboardContext()

    const [url, setUrl] = useState("")
    const addUrl = async () => {
        await useDashboard.addUrl(url)
        toggleForm(false)
        window.location.reload()
    }

    return (
        <div className='text-white w-screen sm:w-fit absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 p-2 z-20'>
            <div className='relative border bg-custom-gradient sm:px-32 px-1 py-16 rounded-md'>
                <button className='absolute top-3 right-3 text-2xl hover:scale-110 duration-200' onClick={() => toggleForm(false)}><AiOutlineCloseCircle /></button>
                <h1 className='text-center text-3xl'>Add URL:</h1>
                <div>
                    <input value={url} onChange={(e) => setUrl(e.target.value)} className='mt-4 focus:outline-none border border-gray-300 rounded-l-md w-72 lg:w-60 p-1 text-black' type="text" placeholder='Enter Your Website Url' />
                    <button onClick={addUrl} className='bg-red-500 py-[5px] px-4 rounded-r-md text-center hover:scale-110 duration-200'>Add</button>
                </div>
            </div>
        </div>
    )
}

export default AddUrlForm
