import React from 'react'
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

function Footer() {
    return (
        <div className='contact px-[10%] mt-36 dark:bg-[#05050f] bg-gray-200 max-w-screen dark:text-gray-400 text-gray-950 pt-5 pb-4'>
            <div className='pt-4 pb-2 flex justify-between sm:flex-row flex-col mb-2'>
                <div className='flex flex-col sm:justify-start text-left w-[30%]'>
                    <h1 className='text-2xl font-bold dark:text-white text-gray-950 mb-1'>Uptime Moniter</h1>
                    <p className='text-sm sm:flex hidden'>UpTime Monitor lets you see inside any stack, debug any issue, and resolve any incident.</p>
                </div>
                <div className='flex w-full justify-end gap-8 items-end ml-6 text-base'>
                    <div className='sm:flex hidden gap-4'>
                        <h3>+91 9131 4835 **</h3>
                        <h3>hello@uptimemonitor.com</h3>
                    </div>
                    <div className='flex gap-4 text-xl'>
                        <FaGithub />
                        <FaInstagram />
                        <FaLinkedin />
                        <FaTwitter />
                    </div>
                </div>
            </div>
            <hr className='border-[0.1px] border-gray-900' />
            <div className='flex justify-between text-sm dark:text-gray-400 text-gray-950 mt-2'>
                <div className='flex gap-6'>
                    <p>terms to use</p>
                    <p>Privacy Policy</p>
                    <p>GDPR</p>
                    <p>System status</p>
                </div>
                <div>
                    <p>© 2024 UpTime Monitor, Inc.</p>
                </div>
            </div>
        </div>
    )
}

export default Footer