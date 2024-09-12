import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import TextTransition, { presets } from 'react-text-transition';
import "../App.css"
import { useDashboardContext } from '../Context/DashboardContextProvider';

function Home() {
    const useDashboard = useDashboardContext()
    const msgRef = useRef(null)

    const [url, setUrl] = useState("")
    const [isWorking, setISWorking] = useState()
    const [index, setIndex] = useState(0)
    const TEXTS = ['website goes down', 'cronjob fails', 'cache hit rate falls', 'website goes down'];

    const fetchUrl = async () => {
        const res = await useDashboard.fetchUrl(url)
        if (res.message.includes("down")) {
            setISWorking(true)
        } else {
            setISWorking(false)
        }
        msgRef.current.textContent = res.message
    }

    useEffect(() => {
        const intervalId = setInterval(
            () => {
                setIndex((index) => index + 1)
            }, 3000
        );
        return () => clearTimeout(intervalId);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('spin')
                }
            })
        })
        const container = document.querySelectorAll('.animation')
        container.forEach((el) => observer.observe(el))
    }, [])

    return (
        <div className='h-screen radial-gradient-custom p-1 text-center'>
            <Navbar />
            <hr className='sm:border border-0 border-gray-200' />
            <div className='flex h-full justify-center items-center flex-col gap-5 animation'>
                <h1 className='sm:text-8xl text-5xl font-bold '>We call you when your</h1>
                <TextTransition className='sm:text-8xl text-5xl font-bold' springConfig={presets.wobbly}>{TEXTS[index % TEXTS.length]}</TextTransition>
                <p className=''>Get notified with a radically better infrastructure monitoring platform.</p>
                <div className='flex gap-3 '>
                    <input value={url} onChange={(e) => setUrl(e.target.value)} className=' rounded-xl text-black sm:w-[500px] sm:focus:w-[498px] focus:outline-none bg-[#f4f7fa] h-[43px] p-2' type="text" placeholder='example:https://example.com' />
                    <button onClick={fetchUrl} className=' border hover:scale-110 hover:border-none duration-200 border-[#f4f7fa] px-5 py-[10px] sm:px-10 sm:py-[10px] rounded-2xl'>Get Your Result</button>
                </div>
                <p ref={msgRef} className={`${isWorking ? "text-red-600" : "text-green-600"} text-xl`}></p>
            </div>
        </div>
    )
}

export default Home
