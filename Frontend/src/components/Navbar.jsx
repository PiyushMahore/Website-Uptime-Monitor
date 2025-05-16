import React, { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { NavLink } from 'react-router-dom'
import { Link } from 'react-scroll'
import { IoMoon, IoSunny } from "react-icons/io5";

function Navbar() {
    const currentTheme = localStorage.getItem("theme")
    const [nav, setNav] = useState(false);
    const [darkMode, setDarkMode] = useState(currentTheme === "dark" ? true : false)

    const darkTheme = () => {
        localStorage.setItem("theme", "dark")
        document.body.classList.remove("light")
        document.body.classList.add("dark")
        setDarkMode(!darkMode)
    }

    const lightTheme = () => {
        localStorage.setItem("theme", "light")
        document.body.classList.remove("dark")
        document.body.classList.add("light")
        setDarkMode(!darkMode)
    }

    return (
        <div className='p-2 z-10 relative'>
            {/* WEB */}
            <div className='list-none hidden sm:flex justify-between dark:text-gray-300 text-gray-900'>
                <ul className='flex gap-8'>
                    <Link to='home' spy={true} smooth={true} offset={50} duration={500} className='cursor-pointer relative px-3 rounded-md py-0.5 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] dark:after:bg-white after:bg-gray-800 after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-700 after:ease-out hover:after:scale-x-100 dark:hover:text-white hover:text-black hover:after:origin-bottom-left'>
                        Home
                    </Link>
                    <Link to='services' spy={true} smooth={true} offset={50} duration={800} className='cursor-pointer relative px-3 rounded-md py-0.5 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] dark:after:bg-white after:bg-gray-800 after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-700 after:ease-out hover:after:scale-x-100 dark:hover:text-white hover:text-black hover:after:origin-bottom-left'>
                        Services
                    </Link>
                    <Link to='about' spy={true} smooth={true} offset={50} duration={800} className='cursor-pointer relative px-3 rounded-md py-0.5 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] dark:after:bg-white after:bg-gray-800 after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-700 after:ease-out hover:after:scale-x-100 dark:hover:text-white hover:text-black hover:after:origin-bottom-left'>
                        About Us
                    </Link>
                    <Link to='contact' spy={true} smooth={true} offset={50} duration={900} className='cursor-pointer relative px-3 rounded-md py-0.5 after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] dark:after:bg-white after:bg-gray-800 after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-700 after:ease-out hover:after:scale-x-100 dark:hover:text-white hover:text-black hover:after:origin-bottom-left'>
                        Contact Us
                    </Link>
                </ul>
                <ul className='flex gap-4 items-center'>
                    <NavLink to='/login'>
                        <button className='dark:hover:text-white hover:text-black'>
                            Sign In
                        </button>
                    </NavLink>
                    <NavLink to='/sign-up'>
                        <button className='py-1 px-2 dark:text-white text-black rounded-lg' style={{ background: 'linear-gradient(0deg, #5B63D3, #5B63D3), linear-gradient(258.47deg, #5B63D3 38.52%, #795FD0 98.47%)', }}>
                            Sign Up
                        </button>
                    </NavLink>
                    {darkMode ? <IoSunny onClick={lightTheme} size={25} /> : <IoMoon onClick={darkTheme} size={25} />}
                </ul>
            </div>

            {/* MOBILE */}
            <div className='flex justify-center items-center flex-col sm:hidden overflow-hidden'>
                <div className={`list-none absolute top-2 left-0 w-screen ${nav ? "translate-y-0" : "-translate-y-[80%]"} transition-transform duration-500 ease-in-out flex items-center flex-col`}>
                    <ul className='dark:bg-[#7c89e602] dark:text-white text-black mb-1 flex gap-2 flex-col w-screen p-4 z-20'>
                        {darkMode ? <IoSunny className='self-end' onClick={lightTheme} size={25} /> : <IoMoon className='self-end' onClick={darkTheme} size={25} />}
                        <Link to='home' spy={true} smooth={true} offset={50} duration={500} className={`relative inline-block ${nav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
                            <div className="underline underline-offset-8">Home</div>
                        </Link>
                        <Link to='services' spy={true} smooth={true} offset={50} duration={500} className={`relative inline-block ${nav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
                            <div className="underline underline-offset-8">Services</div>
                        </Link>
                        <Link to='about' spy={true} smooth={true} offset={50} duration={800} className={`relative inline-block ${nav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 ease-in-out`}>
                            <div className="underline underline-offset-8">About Us</div>
                        </Link>
                        <Link to='contact' spy={true} smooth={true} offset={50} duration={900} className={`relative inline-block ${nav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-700 ease-in-out`}>
                            <div className="underline underline-offset-8">Contact Us</div>
                        </Link>
                    </ul>

                    <ul className='flex justify-between w-screen px-4 z-20'>
                        <NavLink to='/login'>
                            <button className='dark:text-white text-black mt-1'>
                                Sign In
                            </button>
                        </NavLink>
                        <MdKeyboardArrowDown className={`${nav ? "rotate-180" : ""} duration-500`} onClick={() => setNav(!nav)} size={45} />
                        <NavLink to='/sign-up'>
                            <button className='text-black dark:text-white mt-1'>
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
