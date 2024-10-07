import React, { useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router";
import { useUserContext } from "../Context/UserContextProvider";
import { NavLink } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { Navigate } from "react-router";

function SignUp() {
    const theme = localStorage.getItem("theme")
    document.body.classList.add(theme)

    const useAuth = useUserContext()
    const navigate = useNavigate()

    const [fullName, setFullName] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [coverImage, setCoverImage] = useState(null)

    const signUp = async () => {
        const data = await useAuth.signUp(fullName, userName, email, password, mobileNumber, coverImage || "");
        if (data) {
            navigate(`/dashboard/user/${data.data._id}`)
        }
    };

    if (useAuth.loading) return <Loading />

    if (useAuth.user) return <Navigate to={`/dashboard/user/${useAuth.user._id}`} />

    return (
        <div className='max-h-screen'>
            <div>
                <span className='flex px-2 py-2'><IoMdArrowBack onClick={() => window.history.back()} size={25} /></span>
                <hr className='border border-black dark:border-gray-300' />
            </div>
            <div className="flex sm:h-screen flex-1 flex-col justify-center items-center px-6 sm:py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Sign up to your account
                    </h2>
                </div>

                <div className="mt-10 mx-auto w-full max-w-sm">
                    <form action="#" method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Full Name
                            </label>
                            <div className="mt-2">
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-200"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                    Email
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                User Name
                            </label>
                            <div className="mt-2">
                                <input
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Mobile Number
                            </label>
                            <div className="mt-2">
                                <input
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    type="number"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="coverImage"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                                Cover Image
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center">
                                    <label
                                        htmlFor="coverImage"
                                        className="cursor-pointer rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Upload Cover Image
                                    </label>
                                    {coverImage && (
                                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                            {coverImage.name}
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="coverImage"
                                    name="coverImage"
                                    accept="image/*"
                                    onChange={(e) => setCoverImage(e.target.files[0])}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div className="pb-3">
                            <button
                                onClick={signUp}
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign up
                            </button>
                            <p className="mt-3 text-lg text-center">Already a user! <NavLink to={'/login'} className="text-indigo-600">sign in</NavLink></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
