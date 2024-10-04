import React from 'react'
import { useDashboardContext } from '../Context/DashboardContextProvider'

function DeleteUrlMenu({ deleteForm, url, getBack }) {
    const useDashboard = useDashboardContext()

    return (
        <div className={`absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 dark:bg-[#222838] bg-white h-44 w-screen sm:w-fit flex justify-center flex-col items-center border dark:border-gray-500 border-black p-2 sm:px-16 rounded-2xl z-20`}>
            <h1 className='text-2xl'>Delete URL</h1>
            <div className='flex gap-8 mt-4'>
                <button className='py-2 px-3 dark:bg-[#222838] border border-gray-500 rounded-md' onClick={() => cancel(false)}>Cancel</button>
                <button onClick={() => {
                    useDashboard.deleteUrl(url)
                    deleteForm(false)
                    window.location.reload()
                    if (getBack) {
                        window.history.back()
                    }
                }} className='py-2 px-3 bg-red-500 rounded-md'>Confirm</button>
            </div>
        </div >
    )
}

export default DeleteUrlMenu
