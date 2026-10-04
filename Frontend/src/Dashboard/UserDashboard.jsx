import { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import AddUrlForm from "../components/AddUrlForm.jsx";
import { GiRadarSweep } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import DeleteUrlMenu from '../components/DeleteUrlMenu.jsx';
import { useDashboardContext } from '../Context/DashboardContextProvider.jsx';
import { MdRefresh } from "react-icons/md";
import { Navigate, NavLink } from 'react-router-dom';
import { useUserContext } from '../Context/UserContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import { CgProfile } from "react-icons/cg";
import { HiOutlineGlobeAlt, HiCheckCircle, HiExclamationTriangle, HiOutlineBellAlert } from "react-icons/hi2";

function UserDashboard() {
    const useAuth = useUserContext()
    const useDashboard = useDashboardContext()
    const { getAllUrls } = useDashboard

    const [webDisplay, setWebdisplay] = useState(true)
    const [addUrlForm, setAddUrlForm] = useState(false)
    const [deleteForm, setDeleteForm] = useState(false)
    const [datetingUrl, setDatetingUrl] = useState(null)
    const [filterdUrls, setFilterdUrls] = useState([])
    const [searchInput, setSearchInput] = useState("")
    const [randomQuteNum, setRandomQuteNum] = useState(0)
    const firstName = (useAuth.user?.fullName || "there").split(" ")[0]
    const monitorList = useDashboard.allUrls || []
    const operationalCount = monitorList.filter((monitor) => Number(monitor.statusCode) > 0 && Number(monitor.statusCode) < 400).length
    const attentionCount = monitorList.length - operationalCount
    const incidentCount = monitorList.reduce((total, monitor) => total + Number(monitor.incidents || 0), 0)

    useEffect(() => {
        setRandomQuteNum(Math.floor(Math.random() * 20))
    }, [])

    const greetingsAndQuestions = [
        `Hello, ${firstName}! How's your day going?`,
        `Hi ${firstName}, what's new with you today?`,
        `Good to see you, ${firstName}! Any exciting plans?`,
        `Hey ${firstName}! How have you been?`,
        `Hi ${firstName}, hope everything is going well!`,
        `Good morning, ${firstName}! How did you sleep?`,
        `Hello ${firstName}! Ready to tackle the day?`,
        `Hey ${firstName}, what are you working on today?`,
        `Hi ${firstName}, how's everything on your side?`,
        `What's up, ${firstName}? How's your week been?`,
        `Good afternoon, ${firstName}! What’s on your agenda?`,
        `Evening, ${firstName}! How was your day?`,
        `Hi ${firstName}, any new updates you'd like to share?`,
        `Hey ${firstName}! Long time no see, how have you been?`,
        `Hello ${firstName}! Have you done anything fun recently?`,
        `Good evening, ${firstName}! How's everything going?`,
        `Hi ${firstName}, did anything interesting happen today?`,
        `Hey ${firstName}! Got any fun plans for the weekend?`,
        `Good day, ${firstName}! How are you feeling today?`,
        `Hello ${firstName}, what’s been on your mind lately?`
    ];

    useEffect(() => {
        const filteredOne = useDashboard.allUrls.filter((url) => (url.Urls || "").toLowerCase().includes(searchInput.trim().toLowerCase()))
        setFilterdUrls(filteredOne)
    }, [useDashboard.allUrls, searchInput])

    useEffect(() => {
        if (useAuth.loading || !useAuth.user) return
        getAllUrls()
    }, [getAllUrls, useAuth.loading, useAuth.user])

    if (useAuth.loading) return <Loading />
    if (!useAuth.user) return <Navigate to="/login" replace />

    return (
        <div className='min-h-screen dashboard-page'>
            <div className='dashboard-topbar'>
                <NavLink to={`/dashboard/user/${useAuth.user?._id}`} className="dashboard-brand"><span className="brand-mark"><span /></span><span>pulse<span className="brand-light">check</span></span></NavLink>
                <NavLink to={`/dashboard/profile/${useAuth.user?._id}`} className="dashboard-user-link"><CgProfile size={17} /><span>Profile</span></NavLink>
            </div>
            <hr className='border border-black dark:border-gray-300' />
            <div className={`min-h-screen sm:px-[10%] px-4 dark:bg-[#222838] relative`}>
                <div className={`flex justify-start ${addUrlForm || deleteForm ? "blur-sm" : ""} sm:pt-[5%] py-4`}>
                    <div className='dashboard-heading'>
                        <div><span className="section-kicker">YOUR WORKSPACE</span><h1>{greetingsAndQuestions[randomQuteNum]}</h1><p>Here’s the latest health of the websites you’re monitoring.</p></div>
                        <button onClick={() => setAddUrlForm(true)} className='dashboard-create-button'>+ Add monitor</button>
                    </div>
                </div>

                <section className="dashboard-summary" aria-label="Monitor summary">
                    <article><span className="summary-icon summary-icon-blue"><HiOutlineGlobeAlt /></span><div><small>Total monitors</small><strong>{monitorList.length}</strong></div><span className="summary-caption">Websites under watch</span></article>
                    <article><span className="summary-icon summary-icon-green"><HiCheckCircle /></span><div><small>Operational</small><strong>{operationalCount}</strong></div><span className="summary-caption">Currently responding</span></article>
                    <article><span className="summary-icon summary-icon-red"><HiExclamationTriangle /></span><div><small>Needs attention</small><strong>{attentionCount}</strong></div><span className="summary-caption">Unreachable or unknown</span></article>
                    <article><span className="summary-icon summary-icon-purple"><HiOutlineBellAlert /></span><div><small>Incidents</small><strong>{incidentCount}</strong></div><span className="summary-caption">Across all monitors</span></article>
                </section>

                {addUrlForm ? <AddUrlForm toggleForm={setAddUrlForm} setInput={setSearchInput} /> : ""}

                <div className={`pb-4 mt-12 ${addUrlForm ? "blur-sm" : ""} duration-300 overflow-hidden`}>
                    <div className={`dashboard-list-card border border-gray-500 rounded-lg ${webDisplay ? "is-open" : ""}`}>
                        <div className={`dashboard-list-toolbar ${webDisplay ? "toolbar-expanded" : ""}`}>
                            <div className="dashboard-list-title"><button className="dashboard-collapse" aria-label={webDisplay ? "Collapse monitors" : "Expand monitors"} onClick={() => setWebdisplay(!webDisplay)}><MdArrowForwardIos className={`${webDisplay ? "rotate-90" : ""}`} /></button><div><b>Monitors</b><small>{filterdUrls.length} {filterdUrls.length === 1 ? "website" : "websites"}</small></div></div>
                            <div className="dashboard-list-actions"><label className="dashboard-search"><IoIosSearch /><input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search monitors" aria-label="Search monitors" type="search" /></label><button className="dashboard-refresh" onClick={getAllUrls} aria-label="Refresh monitor list"><MdRefresh /> Refresh</button></div>
                        </div>

                        <div className={`dashboard-list-content ${webDisplay ? "is-open" : ""}`} aria-hidden={!webDisplay} inert={!webDisplay}>
                        <div className="dashboard-monitor-list">
                            {filterdUrls.length === 0 && <div className="dashboard-empty"><span>◎</span><h2>{searchInput ? "No monitors match your search" : "Your first monitor is one click away"}</h2><p>{searchInput ? "Try another website name or clear your search." : "Add a website to start keeping an eye on uptime and response health."}</p>{!searchInput && <button onClick={() => setAddUrlForm(true)}>Create your first monitor <span>→</span></button>}</div>}
                            {
                                filterdUrls && filterdUrls.map((data) => {
                                    const monitorUp = Number(data.statusCode) > 0 && Number(data.statusCode) < 400
                                    return (
                                    <span key={data._id}>
                                        <div className='pl-12 py-3'>
                                            <div className='flex items-center justify-between sm:pr-24'>
                                                <NavLink to={`/dashboard/${useAuth.user._id}/url/${data._id}`} className='flex items-center gap-7'>
                                                    <div className={`w-3 h-3 ${monitorUp ? "bg-green-700" : "bg-red-700"} rounded-full relative z-20`}></div>
                                                    <div className={`w-3 h-3 ${monitorUp ? "bg-green-300" : "bg-red-300"} rounded-full shrink-animation z-10 ${webDisplay ? "absolute" : "hidden"}`}></div>
                                                    <div className='text-sm'>
                                                        <p className='font-bold break-words w-60 sm:w-[550px] 2xl:w-full'>{data.Urls}</p>
                                                        <p className={monitorUp ? 'text-green-600' : 'text-red-500'}>{monitorUp ? 'Operational' : 'Unavailable'}<span className='dark:text-gray-400 text-gray-600 ml-2 text-xs'>{data.createdAt ? `· Added ${data.createdAt.slice(0, 10)}` : ''}</span></p>
                                                    </div>
                                                </NavLink>
                                                <div className='sm:flex hidden items-center gap-12'>
                                                    <div className='flex items-center gap-2'>
                                                        <GiRadarSweep />
                                                        <p>3m</p>
                                                    </div>
                                                    <div>
                                                        <button type="button" className="monitor-delete" aria-label={`Delete ${data.Urls}`} onClick={() => {
                                                            setDeleteForm(true)
                                                            setDatetingUrl(data._id)
                                                        }}><MdDelete size={18} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="border-gray-500" />
                                    </span>
                                )})
                            }

                            {deleteForm ? <DeleteUrlMenu setDeleteForm={setDeleteForm} url={datetingUrl} /> : ""}

                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
