import React, { useEffect, useState } from 'react'
import coverImg from '../../public/Rectangle.png'
import Loading from '../components/Loading';
import { useUserContext } from '../Context/UserContextProvider';
import { useNavigate } from 'react-router';

function Profile() {
    const [isEditable, setEditable] = useState(false);
    const [user, setUser] = useState()
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("")

    const useAuth = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        useAuth.getCurrentUser()
            .then((data) => {
                setUser(data.data)
                setUserName(data.data.userName)
                setMobileNumber(data.data.mobileNumber)
                setEmail(data.data.email)
                setFullName(data.data.fullName)
                setProfilePhoto(data.data.profilePicture)
            })
    }, [])

    const updateUser = async () => {
        const ans = await useAuth.updateUser(userName, "", "", email, mobileNumber, fullName)
        setEditable(!isEditable)
        console.log(ans)
    }

    const logout = async () => {
        const ans = await useAuth.logOut()
        if (ans) {
            navigate('/')
        }
        console.log(ans)
    }

    if (!user) return <Loading />

    return (
        <div className='h-screen max-w-screen sm:px-10 sm:pt-20 overflow-hidden'>
            <div className='border h-full sm:h-auto rounded-lg border-gray-300 bg-gray-400'>
                <img src={coverImg} className='w-full h-28 bg-cover bg-center' />
                <div className='flex sm:items-center items-start justify-between pr-1 sm:pr-6 px-6'>
                    <div className='flex gap-4'>
                        <img className='h-24 w-24 rounded-full relative -top-6' src={profilePhoto} alt="Profile" />
                        <div className='mt-5 sm:mt-1.5'>
                            <p className='font-bold'>{user.fullName}</p>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className='mt-2 sm:mt-0'>
                        <button onClick={() => isEditable ? updateUser() : setEditable(!isEditable)} className={`${isEditable ? "bg-green-500" : "bg-indigo-500"} py-1 px-6 rounded-md`}>{!isEditable ? "Edit" : "Save"}</button>
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
            </div>
            <div className='text-center mt-4'>
                <button onClick={logout} className='bg-red-600 px-4 py-1.5 rounded'>Log Out</button>
            </div>
        </div >
    )
}

export default Profile