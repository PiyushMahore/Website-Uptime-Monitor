import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TextTransition, { presets } from 'react-text-transition';
import "../App.css"

function Home() {
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState(false)
    const TEXTS = ['website goes down', 'cronjob fails', 'cache hit rate falls', 'website goes down'];

    useEffect(() => {
        const intervalId = setInterval(
            () => {
                setIndex((index) => index + 1)
                setDirection((prev) => !prev)
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
                <TextTransition className='sm:text-8xl text-5xl font-bold ' direction={`${direction ? "up" : "down"}`} springConfig={presets.wobbly}>{TEXTS[index % TEXTS.length]}</TextTransition>
                <p className=''>Get notified with a radically better infrastructure monitoring platform.</p>
                <div className='flex gap-3 '>
                    <input className=' rounded-xl text-black sm:w-[500px] sm:focus:w-[498px] focus:outline-none bg-[#f4f7fa] h-[43px] p-2' type="text" placeholder='example:https://example.com' />
                    <button className=' border hover:scale-110 hover:border-none duration-200 border-[#f4f7fa] px-5 py-[10px] sm:px-10 sm:py-[10px] rounded-2xl'>Get Your Result</button>
                </div>
            </div>
        </div>
    )
}

export default Home