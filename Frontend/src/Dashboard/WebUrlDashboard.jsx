import React from 'react'
import BollingerChart from '../components/UrlStatusChart.jsx'

function WebUrlDashboard() {
    const initialData = [100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 500, 301, 502, 403];
    const initialLabels = [100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 500, 301, 502, 403];

    return (
        <div className='dark:bg-[##1F2433] sm:px-32 mt-8 px-4'>
            <div className='flex items-center gap-4 my-8'>
                <div className='w-4 h-4 bg-green-600 rounded-full p-2'></div>
                <div>
                    <h3 className='text-3xl font-semibold'>react-icons.github.io/react-icons</h3>
                    <p className='mt-2'>Up  <span>·  Checked every 3 minutes</span></p>
                </div>
            </div>
            <div className='flex sm:flex-row flex-col gap-6'>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Currently up for</p>
                    <p className='text-xl font-semibold'>29 days 8 hours 13 mins</p>
                </div>
                <div className='border border-gray-600 px-4 py-4 rounded-md sm:w-72 w-full'>
                    <p>Last checked at</p>
                    <p className='text-xl font-semibold'>2 minutes ago</p>
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
                <BollingerChart
                    initialData={initialData}
                    initialLabels={initialLabels}
                />
            </div>
        </div>
    )
}

export default WebUrlDashboard
