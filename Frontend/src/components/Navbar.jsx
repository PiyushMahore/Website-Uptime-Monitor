import React, { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { NavLink } from 'react-router-dom'

function Navbar() {
    const [nav, setNav] = useState(false);

    return (
        <div className='p-2 z-10 relative'>
            {/* WEB */}
            <div className='list-none hidden sm:flex justify-between text-gray-300'>
                <ul className='flex gap-8'>
                    <li className='cursor-pointer relative px-3 rounded-md py-0.5 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100 hover:text-white hover:after:origin-bottom-left'>
                        Home
                    </li>
                    <li className='cursor-pointer relative px-3 rounded-md py-0.5 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100 hover:text-white hover:after:origin-bottom-left'>
                        About Us
                    </li>
                    <li className='cursor-pointer relative px-3 rounded-md py-0.5 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100 hover:text-white hover:after:origin-bottom-left'>
                        Check Web Status
                    </li>
                    <li className='cursor-pointer relative px-3 rounded-md py-0.5 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100 hover:text-white hover:after:origin-bottom-left'>
                        Dashboard
                    </li>
                </ul>
                <ul className='flex gap-4 items-center'>
                    <NavLink to='/login'>
                        <button className='hover:text-white'>
                            Sign In
                        </button>
                    </NavLink>
                    <NavLink to='/sign-up'>
                        <button className='py-1 px-2 text-white rounded-lg' style={{ background: 'linear-gradient(0deg, #5B63D3, #5B63D3), linear-gradient(258.47deg, #5B63D3 38.52%, #795FD0 98.47%)', }}>
                            Sign Up
                        </button>
                    </NavLink>
                </ul>
            </div>

            {/* MOBILE */}
            <div className='flex justify-center items-center flex-col sm:hidden overflow-hidden'>
                <div className={`list-none absolute top-0 left-0 w-screen ${nav ? "translate-y-0" : "-translate-y-[80%]"} transition-transform duration-500 ease-in-out flex items-center flex-col`}>
                    <ul className='bg-[#7c89e602] text-white mb-1 flex gap-2 flex-col w-screen p-4 z-20'>
                        <li className={`relative inline-block ${nav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
                            <a className="underline underline-offset-8">Home</a>
                        </li>
                        <li className={`relative inline-block ${nav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 ease-in-out`}>
                            <a className="underline underline-offset-8">About Us</a>
                        </li>
                        <li className={`relative inline-block ${nav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-700 ease-in-out`}>
                            <a className="underline underline-offset-8">Check Web Status</a>
                        </li>
                        <li className={`relative inline-block ${nav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-1000 ease-in-out`}>
                            <a className="underline underline-offset-8">Dashboard</a>
                        </li>
                    </ul>

                    <ul className='flex justify-between w-screen px-4 z-20'>
                        <NavLink to='/login'>
                            <button className='hover:text-white mt-1'>
                                Sign In
                            </button>
                        </NavLink>
                        <MdKeyboardArrowDown className={`${nav ? "rotate-180" : ""} duration-500`} onClick={() => setNav(!nav)} size={45} />
                        <NavLink to='/sign-up'>
                            <button className='hover:text-white mt-1'>
                                Sign Up
                            </button>
                        </NavLink>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;