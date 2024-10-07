import React, { useState } from 'react';
import { useUserContext } from '../Context/UserContextProvider';
import { useNavigate } from "react-router-dom"
import Loading from '../components/Loading';
import { IoMdArrowBack } from 'react-icons/io';

function Verify() {
    const theme = localStorage.getItem("theme")
    document.body.classList.add(theme)

    const useAuth = useUserContext()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [generatedOtp, setGeneratedOtp] = useState(null)
    const [text, setText] = useState("Generate otp")
    const [otpField, setOtpField] = useState(false)

    const generateOtp = async () => {
        let otp = ""
        for (let i = 0; i <= 6; i++) {
            otp += Math.floor(Math.random() * 10)
        }
        if (email.trim() === "") return null
        setGeneratedOtp(otp)
        setText("Verify")
        setOtpField(true)
        const response = await useAuth.generateOtp(email, `Your One-Time Password (OTP) is: ${otp}\n\nPlease use this code to complete your verification.\n\nIf you didn’t request this, please ignore this message.`, "Your OTP Code")
        console.log(response)
    }

    const isOtpCorrect = () => {
        useAuth.setLoading(true)
        setTimeout(() => {
            useAuth.setLoading(false)
        }, 500);
        if (generatedOtp == otp) {
            navigate(`/login/create-new-password/${email}`)
        } else {
            window.alert("Wrong OTP")
        }
    }

    console.log(generatedOtp)
    if (useAuth.loading) return <Loading />

    return (
        <div className='max-h-screen overflow-hidden'>
            <div>
                <span className='flex px-2 py-2'><IoMdArrowBack onClick={() => window.history.back()} size={25} /></span>
                <hr className='border border-black dark:border-gray-300' />
            </div>
            <div className="flex sm:h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Verify Yourself
                    </h2>
                </div>

                <div className="mt-10 mx-auto w-full max-w-sm">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Enter Your Email
                            </label>
                            <div className="mt-2">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className={`${otpField ? "" : "hidden"}`}>
                            <div className="flex items-center justify-between">
                                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                    Enter OTP
                                </label>
                                <div className="text-sm">
                                    <button onClick={generateOtp} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Resend
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    id="otp"
                                    name="otp"
                                    type="number"
                                    className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={text === "Generate otp" ? generateOtp : isOtpCorrect}
                                className={`flex w-full justify-center rounded-md ${text !== "Generate otp" ? "bg-green-600 focus-visible:outline-green-600 hover:bg-green-500" : "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-600"} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                            >
                                {text}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verify