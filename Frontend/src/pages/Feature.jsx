import React from 'react'
import FeatureImg from '../../public/FeaturedImg.jpg'

function Feature() {
    return (
        <div className='mt-12 flex items-center justify-center flex-col-reverse sm:flex-row gap-20 sm:px-40'>
            <div className='sm:w-[40%] text-left animation'>
                <h6 style={{ backgroundColor: 'rgb(124 135 247 / 0.1)', borderColor: 'rgb(124 135 247 / 0.36)' }} className='px-3 py-1.5 rounded-full border w-fit'>UPTIME MONITERING</h6>
                <h1 className='sm:text-6xl text-5xl font-semibold'>
                    Uptime monitoring reimagined
                </h1>
                <p className='sm:text-2xl text-2xl text-gray-500 mt-2'>Get a screenshot of the error, and a second-by-second timeline with our fastest 30-second checks.</p>
            </div>
            <div className='sm:w-[100%] w-screen'>
                <img className='bg-cover bg-center' width={'100%'} src={FeatureImg} alt="" />
            </div>
        </div>
    )
}

export default Feature