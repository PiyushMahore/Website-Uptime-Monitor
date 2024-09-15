import React from 'react'

function Alerts() {
    return (
        <div className='mt-36 mb-6 about'>
            <div className='flex items-center flex-col animation'>
                <h6 style={{ backgroundColor: 'rgb(124 135 247 / 0.1)', borderColor: 'rgb(124 135 247 / 0.36)' }} className='px-3 py-1.5 rounded-full border w-fit '>UPTIME MONITERING</h6>
                <h1 className='sm:text-6xl text-5xl font-semibold '>Incident management <br /> and on-call alerting</h1>
            </div>
            <div className='flex justify-center flex-wrap gap-8 mt-14 p-1 text-center'>

                <div className="animation sm:w-[30%] relative inline-block rounded-tl-3xl rounded-bl-3xl border-y border-l border-white py-3 pl-3">
                    <div className='rounded-3xl radial-gradient-custom border-gray-300 border overflow-hidden shadow-xl shadow-gray-500'>
                        <div className='absolute w-full -translate-x-[50%] top-12 left-[40%]'>
                            <h3 className='text-4xl'>On-call scheduling</h3>
                        </div>
                        <img className='w-full h-auto' src="https://betterstack.com/assets/v2/uptime/on-call-scheduling-2fa5a57807fb93898f50a2dc8878e0dba8223329cf2f3ab765ff5922920aa96e.png" alt="" />
                    </div>
                </div>

                <div className="animation sm:w-[30%] text-gray-800 relative inline-block rounded-tl-3xl rounded-bl-3xl">
                    <div className='rounded-3xl h-[470px] radial-gradient-custom border-gray-300 border overflow-hidden shadow-xl shadow-gray-500'>
                        <div className='absolute w-full -translate-x-[50%] top-12 left-[50%]'>
                            <h3 className='text-4xl'>Unlimited voice call alerts</h3>
                        </div>
                        <img className='w-full h-auto' src="https://betterstack.com/assets/v2/uptime/call-alerts-cde9f33376337c149badf3b40df6c16037fefc65be02f0b5c90aa53447fbcf88.jpg" alt="" />
                    </div>
                </div>

                <div className="animation sm:w-[30%] relative inline-block rounded-tr-3xl rounded-br-3xl border-y border-r border-white py-3 pr-3">
                    <div className='rounded-3xl h-[454px] radial-gradient-custom border-gray-300 border overflow-hidden shadow-xl shadow-gray-500'>
                        <div className='absolute w-full -translate-x-[50%] top-12 left-[40%] overflow-hidden'>
                            <h3 className='text-4xl'>On-call scheduling</h3>
                        </div>
                        <img className='w-full h-auto bg-cover bg-center sm:relative -top-14' src="https://betterstack.com/assets/v2/uptime/flexible-escalations-31c852dd631e16846a2371f215fc6fe09a669404c908ebfab69076f3fb8287c0.png" alt="" />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Alerts