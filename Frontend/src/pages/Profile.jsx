import { useEffect, useRef, useState } from 'react'
import { Navigate, NavLink } from 'react-router-dom'
import { HiArrowLeft, HiCamera, HiCheckCircle, HiPencilSquare, HiXMark } from 'react-icons/hi2'
import Loading from '../components/Loading'
import defaultProfilePic from '../../public/defaultProfile.jpg'
import LogoutForm from '../components/LogoutForm'
import { useUserContext } from '../Context/UserContextProvider'

function Profile() {
    const auth = useUserContext()
    const fileInput = useRef(null)
    const [isEditable, setEditable] = useState(false)
    const [fullName, setFullName] = useState('')
    const [userName, setUserName] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [email, setEmail] = useState('')
    const [logOutForm, setLogOutForm] = useState(false)
    const [profilePicture, setProfilePicture] = useState(null)
    const [previewImage, setPreviewImage] = useState('')
    const [message, setMessage] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!auth.user) return
        setFullName(auth.user.fullName || '')
        setEmail(auth.user.email || '')
        setUserName(auth.user.userName || '')
        setMobileNumber(auth.user.mobileNumber || '')
        setPreviewImage(auth.user.profilePicture || '')
        setProfilePicture(null)
    }, [auth.user])

    useEffect(() => () => {
        if (previewImage.startsWith('blob:')) URL.revokeObjectURL(previewImage)
    }, [previewImage])

    const cancelEdit = () => {
        setFullName(auth.user.fullName || '')
        setEmail(auth.user.email || '')
        setUserName(auth.user.userName || '')
        setMobileNumber(auth.user.mobileNumber || '')
        setPreviewImage(auth.user.profilePicture || '')
        setProfilePicture(null)
        setMessage('')
        setEditable(false)
    }

    const updateUser = async (event) => {
        event.preventDefault()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) return setMessage('Enter a valid email address.')
        if (!/^[6-9]\d{9}$/.test(mobileNumber)) return setMessage('Enter a valid 10 digit mobile number.')
        if (!/^[a-zA-Z0-9_]{3,}$/.test(userName)) return setMessage('Username must be at least 3 characters and use letters, numbers, or underscores.')
        setSaving(true)
        setMessage('')
        let result
        try {
            result = await auth.updateUser(userName, '', '', email, mobileNumber, fullName, profilePicture)
        } catch {
            result = { success: false, message: 'Unable to save your profile. Please try again.' }
        } finally {
            setSaving(false)
        }
        if (result?.success === false || typeof result === 'string') {
            setMessage(typeof result === 'string' ? result : result.message || 'Unable to save profile changes.')
            return
        }
        setEditable(false)
        setMessage('Your profile has been updated.')
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) return setMessage('Choose a JPEG, PNG, WebP, or GIF image.')
        if (file.size > 5 * 1024 * 1024) return setMessage('Profile photos must be smaller than 5 MB.')
        setProfilePicture(file)
        setPreviewImage(URL.createObjectURL(file))
        event.target.value = ''
        setMessage('')
    }

    if (auth.loading) return <Loading />
    if (!auth.user) return <Navigate to="/login" replace />

    const fields = [
        { label: 'Full name', value: fullName, set: setFullName, id: 'profile-name', type: 'text', autoComplete: 'name' },
        { label: 'Username', value: userName, set: setUserName, id: 'profile-username', type: 'text', autoComplete: 'username' },
        { label: 'Email address', value: email, set: setEmail, id: 'profile-email', type: 'email', autoComplete: 'email' },
        { label: 'Mobile number', value: mobileNumber, set: setMobileNumber, id: 'profile-mobile', type: 'tel', autoComplete: 'tel' },
    ]

    return (
        <main className="profile-page">
            <header className="profile-topbar">
                <NavLink to={`/dashboard/user/${auth.user._id}`} className="profile-back"><HiArrowLeft /> Back to dashboard</NavLink>
                <span className="profile-brand"><span className="brand-mark"><span /></span>pulse<span>check</span></span>
                <button className="profile-logout" onClick={() => setLogOutForm(true)}>Log out</button>
            </header>
            <div className="profile-layout">
                <section className="profile-intro">
                    <span className="section-kicker">ACCOUNT SETTINGS</span>
                    <h1>Your profile</h1>
                    <p>Manage your personal details and how we can reach you about your monitors.</p>
                </section>

                <section className="profile-card">
                    <div className="profile-card-head"><div><h2>Personal information</h2><p>These details are attached to your account.</p></div>
                        {!isEditable ? <button className="profile-primary" onClick={() => { setMessage(''); setEditable(true) }}><HiPencilSquare /> Edit profile</button> : <button className="profile-cancel" onClick={cancelEdit}><HiXMark /> Cancel</button>}
                    </div>
                    <div className="profile-avatar-row">
                        <button type="button" className={`profile-avatar-button ${isEditable ? 'is-editable' : ''}`} onClick={() => isEditable && fileInput.current?.click()} aria-label={isEditable ? 'Change profile photo' : 'Profile photo'}>
                            <img src={previewImage || defaultProfilePic} alt="Profile" />
                            {isEditable && <span><HiCamera /> Change photo</span>}
                        </button>
                        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={handleImageChange} />
                        <div><h3>{auth.user.fullName}</h3><p>{auth.user.email}</p><span className="profile-member-label">Pulsecheck member</span></div>
                    </div>
                    <form onSubmit={updateUser}>
                        <div className="profile-fields">
                            {fields.map((field) => <label key={field.id} htmlFor={field.id}>{field.label}<input id={field.id} name={field.id} type={field.type} autoComplete={field.autoComplete} value={field.value} onChange={(event) => field.set(event.target.value)} readOnly={!isEditable} /></label>)}
                        </div>
                        {message && <p className={`profile-message ${message.includes('updated') ? 'is-success' : 'is-error'}`}>{message.includes('updated') && <HiCheckCircle />}{message}</p>}
                        {isEditable && <div className="profile-form-actions"><p>Your email and mobile number are used for account notices.</p><button className="profile-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div>}
                    </form>
                </section>
                <section className="profile-security-card"><div><h2>Account access</h2><p>Sign out of Pulsecheck on this device.</p></div><button onClick={() => setLogOutForm(true)}>Log out</button></section>
            </div>
            {logOutForm ? <LogoutForm setLogoutForm={setLogOutForm} /> : null}
        </main>
    )
}

export default Profile
