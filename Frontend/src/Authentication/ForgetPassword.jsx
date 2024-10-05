import React, { useState } from 'react';
import { useUserContext } from '../Context/UserContextProvider';

function ForgetPassword() {
    const theme = localStorage.getItem("theme")
    document.body.classList.add(theme)

    const useAuth = useUserContext()

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [text, setText] = useState("Get")
    const [generatedOtp, setGeneratedOtp] = useState(null)

    const generateOtp = async () => {
        let otp = ""
        for (let i = 0; i <= 6; i++) {
            otp += Math.floor(Math.random() * 10)
        }
        if (email.trim() === "") return null
        setGeneratedOtp(otp)
        setText("Resend")
        const response = await useAuth.resetPassword(email, `Your One-Time Password (OTP) is: ${otp}\n\nPlease use this code to complete your verification.\n\nIf you didn’t request this, please ignore this message.`, "Your OTP Code")
        console.log(response)
    }

    const isOtpCorrect = () => {
        if (generatedOtp == otp) {
            console.log("navigate to otp")
        } else {
            console.log("your entered otp is incorrect")
        }
    }

    return (
        <div className="flex h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                    Reset Password
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Enter OTP
                            </label>
                            <div className="text-sm">
                                <button onClick={generateOtp} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    {text}
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
                                className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={isOtpCorrect}
                            className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword