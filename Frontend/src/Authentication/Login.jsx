import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading';
import { useUserContext } from '../Context/UserContextProvider';
import { IoMdArrowBack } from "react-icons/io";
import { Navigate } from 'react-router-dom';

function Login() {
    const theme = localStorage.getItem("theme")
    document.body.classList.add(theme)
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    const useAuth = useUserContext()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const logIn = async () => {
        const data = await useAuth.login(email, password)
        if (data.data._id) {
            navigate(`/dashboard/user/${data.data._id}`)
        } else if (data === "Password is Wrong" || data.data === "Password is Wrong") {
            setMessage("Password is Wrong");
        } else if (data.data === "user not found") {
            setMessage("User Not Found")
        }
    }

    useEffect(() => {
        if (password.length <= 0) {
            setMessage("")
        } else if (email.length <= 0) {
            setMessage("")
        }
    }, [password, email])

    if (useAuth.loading) return <Loading />

    if (useAuth.user) return <Navigate to={`/dashboard/user/${useAuth.user._id}`} />

    return (
        <div className='max-h-screen overflow-hidden'>
            <div>
                <span className='flex px-2 py-2'><IoMdArrowBack onClick={() => window.history.back()} size={25} /></span>
                <hr className='border border-black dark:border-gray-300' />
            </div>
            <div className="flex sm:h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 mx-auto w-full max-w-sm">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Email or UserName
                            </label>
                            <div className="mt-2">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <NavLink to="/login/reset-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </NavLink>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={logIn}
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                            <p className="mt-3 text-lg text-center">New User! <NavLink to={'/sign-up'} className="text-indigo-600">sign Up</NavLink></p>
                        </div>
                        <p className='text-center text-red-500'>{message}</p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;