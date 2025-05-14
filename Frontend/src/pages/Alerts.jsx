import React from 'react'

function Alerts() {
    return (
        <div className='mt-36 mb-6 about'>
            <div className='flex items-center flex-col animation'>
                <h6 style={{ backgroundColor: 'rgb(124 135 247 / 0.1)', borderColor: 'rgb(124 135 247 / 0.36)' }} className='px-3 py-1.5 rounded-full border w-fit '>UPTIME MONITERING</h6>
                <h1 className='sm:text-6xl text-5xl font-semibold '>Incident management <br /> and on-call alerting</h1>
            </div>
            <div className='flex justify-center flex-wrap gap-8 mt-14 p-1 text-center'>

                <div className="h-[500px] overflow-hidden animation sm:w-[30%] relative inline-block rounded-tl-3xl rounded-bl-3xl border-y border-l dark:border-white border-gray-900 py-3 pl-3">
                    <div className='rounded-3xl radial-gradient-custom dark:border-gray-300 border-gray-900 border overflow-hidden shadow-xl dark:shadow-gray-500 shadow-gray-900'>
                        <div className='absolute w-full -translate-x-[50%] top-12 left-[40%]'>
                            <h3 className='text-4xl'>On-call scheduling</h3>
                        </div>
                        <img className='w-full h-full bg-cover bg-center bg-no-repeat' src="https://betterstack.com/assets/v2/homepage-v3/metrics-01a8050d05f63c1cd782660389d468bfa203f5e409a174d4e784aff6250fdbea.jpg" alt="" />
                    </div>
                </div>

                <div className="animation sm:w-[60%] relative inline-block rounded-tr-3xl rounded-br-3xl border-y border-r dark:border-white border-gray-900 py-3 pr-3">
                    <div className='rounded-3xl h-[454px] radial-gradient-custom dark:border-gray-300 border-gray-900 border overflow-hidden shadow-xl dark:shadow-gray-500 shadow-gray-900'>
                        <div className='absolute w-full -translate-x-[50%] top-12 left-[40%] overflow-hidden'>
                            <h3 className='text-4xl'>On-call scheduling</h3>
                        </div>
                        <img className='w-full h-auto bg-cover bg-center sm:relative -top-14' src="https://betterstack.com/assets/v2/homepage-v3/anomaly-detection-faa34ba05334a907780d43f42df9ebedfac460a7f6509482d555921dae82d13b.jpg" alt="" />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Alerts