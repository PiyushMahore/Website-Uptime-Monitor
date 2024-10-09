import React, { useEffect, useState } from 'react'
import coverImg from '../../public/Rectangle.png'
import Loading from '../components/Loading';
import { useUserContext } from '../Context/UserContextProvider';
import defaultProfilePic from '../../public/defaultProfile.jpg'
import LogoutForm from '../components/LogoutForm';

function Profile() {
    const useAuth = useUserContext()

    console.log(useAuth.user)

    const [isEditable, setEditable] = useState(false);
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [logOutForm, setLogOutForm] = useState(false)

    useEffect(() => {
        if (useAuth.user) {
            setFullName(useAuth.user.fullName)
            setEmail(useAuth.user.email)
            setUserName(useAuth.user.userName)
            setMobileNumber(useAuth.user.mobileNumber)
        }
    }, [useAuth.user])

    const updateUser = async () => {
        await useAuth.updateUser(userName, "", "", email, mobileNumber, fullName)
        setEditable(!isEditable)
    }

    if (useAuth.loading || !useAuth.user) return <Loading />

    return (
        <div className='h-screen max-w-screen sm:px-10 sm:pt-20 overflow-hidden'>
            <div className='sm:border h-full sm:h-auto rounded-lg border-gray-300 dark:bg-[#1F2433] bg-gray-100'>
                <img src={coverImg} className='w-full h-28 bg-cover bg-center' />
                <div className='flex sm:items-center items-start justify-between pr-1 sm:pr-6 px-6'>
                    <div className='flex gap-4'>
                        <img className='h-24 w-24 rounded-full relative -top-6 bg-center bg-cover' src={useAuth.user.profilePicture === "" ? defaultProfilePic : useAuth.user.profilePicture} alt="Profile" />
                        <div className='mt-5 sm:mt-1.5'>
                            <p className='font-bold'>{useAuth.user.fullName}</p>
                            <p>{useAuth.user.email}</p>
                        </div>
                    </div>
                    <div className='mt-2 sm:mt-0'>
                        <button onClick={() => isEditable ? updateUser() : setEditable(!isEditable)} className={`${isEditable ? "bg-green-500 hover:bg-green-400" : "bg-indigo-500 hover:bg-indigo-400"} py-1 px-6 rounded-md`}>{!isEditable ? "Edit" : "Save"}</button>
                    </div>
                </div>

                <div className='px-6 pb-10 grid grid-cols-1 sm:grid-cols-2 gap-10'>
                    <div>
                        <label htmlFor="full-name" className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Full Name
                        </label>
                        <div className="mt-2">
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                id="full-name"
                                name="full-name"
                                type="text"
                                readOnly={!isEditable}
                                className={`w-full ${isEditable ? "focus:ring-2 focus:ring-inset focus:ring-indigo-600" : "focus:outline-none"} rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            User Name
                        </label>
                        <div className="mt-2">
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                id="username"
                                name="username"
                                type="text"
                                readOnly={!isEditable}
                                className={`w-full ${isEditable ? "focus:ring-2 focus:ring-inset focus:ring-indigo-600" : "focus:outline-none"} rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="mobile" className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Mobile Number
                        </label>
                        <div className="mt-2">
                            <input
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                id="mobile"
                                name="mobile"
                                type="tel"
                                readOnly={!isEditable}
                                className={`w-full ${isEditable ? "focus:ring-2 focus:ring-inset focus:ring-indigo-600" : "focus:outline-none"} rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                name="email"
                                type="email"
                                readOnly={!isEditable}
                                className={`w-full ${isEditable ? "focus:ring-2 focus:ring-inset focus:ring-indigo-600" : "focus:outline-none"} rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            />
                        </div>
                    </div>
                </div>
                <div className='text-center mt-6 sm:hidden'>
                    <button onClick={() => setLogOutForm(true)} className='bg-red-600 px-4 py-1.5 rounded hover:scale-105 duration-100'>Log Out</button>
                </div>
            </div>
            <div className='text-center mt-6 hidden sm:flex justify-center'>
                <button onClick={() => setLogOutForm(true)} className='bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded hover:scale-105 duration-100'>Log Out</button>
            </div>
            {logOutForm ? <LogoutForm setLogoutForm={setLogOutForm} /> : null}
        </div>
    )
}

export default Profile