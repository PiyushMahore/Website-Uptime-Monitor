import React from 'react'
import BollingerChart from '../components/UrlStatusChart.jsx'

function WebUrlDashboard() {
    const data = [
        { Date: new Date('2024-01-01'), Close: 150.0 },
        { Date: new Date('2024-01-02'), Close: 152.3 },
        { Date: new Date('2024-01-03'), Close: 148.7 },
        { Date: new Date('2024-01-04'), Close: 149.5 },
        { Date: new Date('2024-01-05'), Close: 153.2 },
        { Date: new Date('2024-01-06'), Close: 154.1 },
        { Date: new Date('2024-01-07'), Close: 155.3 },
        { Date: new Date('2024-01-08'), Close: 156.8 },
        { Date: new Date('2024-01-09'), Close: 158.0 },
        { Date: new Date('2024-01-10'), Close: 159.4 },
        { Date: new Date('2024-01-11'), Close: 157.6 },
        { Date: new Date('2024-01-12'), Close: 156.0 },
        { Date: new Date('2024-01-13'), Close: 158.3 },
        { Date: new Date('2024-01-14'), Close: 160.1 },
        { Date: new Date('2024-01-15'), Close: 161.7 },
        { Date: new Date('2024-01-16'), Close: 162.4 },
        { Date: new Date('2024-01-17'), Close: 163.2 },
        { Date: new Date('2024-01-18'), Close: 164.8 },
        { Date: new Date('2024-01-19'), Close: 165.3 },
        { Date: new Date('2024-01-20'), Close: 166.0 }
    ];

    return (
        <div className='dark:bg-[##1F2433] px-32 mt-8'>
            <div className='flex items-center gap-4 my-8'>
                <div className='h-6 w-6 bg-green-600 rounded-full'></div>
                <div>
                    <h3>react-icons.github.io/react-icons</h3>
                    <p>Up  <span>·  Checked every 3 minutes</span></p>
                </div>
            </div>
            <div className='flex gap-6'>
                <div className='border border-gray-600 px-4 py-4 rounded-md w-64'>
                    <p>Currently up for</p>
                    <p className='text-xl font-semibold'>29 days 8 hours 13 mins</p>
                </div>
                <div className='border border-gray-600 px-4 py-4 rounded-md w-64'>
                    <p>Last checked at</p>
                    <p className='text-xl font-semibold'>2 minutes ago</p>
                </div>
                <div className='border border-gray-600 px-4 py-4 rounded-md w-64'>
                    <p>Incidents</p>
                    <p className='text-xl font-semibold'>0</p>
                </div>
            </div>
            <div className='my-8 w-[80%]'>
                <div className='border-black border p-2 rounded-tr-md rounded-tl-md'>
                    Response Time
                </div>
                <BollingerChart aapl={data} N={20} K={2} />
            </div>
        </div>
    )
}

export default WebUrlDashboard