import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useUserContext } from '../Context/UserContextProvider'
import Loading from '../components/Loading'
import { IoMdArrowBack } from 'react-icons/io'

function CreateNewPassword() {
    const { email } = useParams()
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")

    const useAuth = useUserContext()

    const changePassword = async () => {
        if (password !== confirmPassword) {
            setMessage("password & confirm password not match")
            return null;
        }
        const result = await useAuth.resetPassword(email, password)
        if (result.message === "Password changed successfully") {
            navigate("/login")
        }
    }

    useEffect(() => {
        if (confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                setMessage("password & confirm password not match")
            } else {
                setMessage("")
            }
        } else {
            setMessage("")
        }
    }, [confirmPassword, password])

    if (useAuth.loading) return <Loading />

    return (
        <div className='max-h-screen overflow-hidden'>
            <div>
                <span className='flex px-2 py-2'><IoMdArrowBack onClick={() => window.history.back()} size={25} /></span>
                <hr />
            </div>
            <div className="flex sm:h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Change Password
                    </h2>
                </div>

                <div className="mt-10 mx-auto w-full max-w-sm">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Enter Password
                            </label>
                            <div className="mt-2">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    name="password"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                    Confirm Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button onClick={changePassword}
                                className={`flex w-full justify-center rounded-md bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                            >
                                Change Password
                            </button>
                        </div>
                        <p className='text-center text-red-500'>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateNewPassword