import { NavLink } from 'react-router-dom'
import { HiArrowRight, HiOutlineBellAlert, HiOutlineDevicePhoneMobile, HiOutlineEnvelope, HiOutlineExclamationTriangle, HiOutlinePhone } from 'react-icons/hi2'

function Alerts() {
    return (
        <section id="alerts" className="alerts-section section-pad">
            <div className="page-container alerts-layout">
                <div className="alerts-copy">
                    <span className="section-kicker">WHEN SOMETHING NEEDS YOU</span>
                    <h2>Get the signal.<br /><span>Skip the noise.</span></h2>
                    <p>Get a clear email when a monitor needs attention. Text message and phone call alerts are planned for a future update.</p>
                    <ul className="alerts-list">
                        <li><HiOutlineExclamationTriangle /><span><b>Know when a monitor needs attention</b><small>Actionable incident and recovery updates</small></span></li>
                    </ul>
                    <div className="alert-channel-list" aria-label="Notification channel availability">
                        <div className="alert-channel-card is-available"><span><HiOutlineEnvelope /></span><div><b>Email</b><small>Available now</small></div><i>ACTIVE</i></div>
                        <div className="alert-channel-card"><span><HiOutlineDevicePhoneMobile /></span><div><b>Text message</b><small>SMS notifications</small></div><i>COMING SOON</i></div>
                        <div className="alert-channel-card"><span><HiOutlinePhone /></span><div><b>Phone call</b><small>Voice notifications</small></div><i>COMING SOON</i></div>
                    </div>
                    <NavLink to="/sign-up" className="button button-primary">Set up email alerts <HiArrowRight /></NavLink>
                </div>
                <div className="notification-preview">
                    <div className="notification-orbit orbit-one"/><div className="notification-orbit orbit-two"/>
                    <div className="notification-card">
                        <div className="notification-card-head"><span className="notification-app-icon"><HiOutlineBellAlert /></span><span><b>Pulsecheck</b><small>Just now · Email</small></span><span className="notification-dots">···</span></div>
                        <div className="notification-content"><span className="incident-pill"><i /> CHECK FAILED</span><h3>Your monitor needs attention</h3><p><b>api.acme.io</b> did not respond as expected. We’ll keep checking and let you know when it recovers.</p><div className="notification-meta"><span>Response</span><b>Timeout</b><span>Checked</span><b>10:42:08 AM</b></div></div>
                        <button className="notification-action" type="button">View monitor <HiArrowRight /></button>
                    </div>
                    <div className="notification-toast"><span><HiOutlineBellAlert /></span><div><b>Email alert delivered</b><small>Phone and SMS are coming soon</small></div><i /></div>
                </div>
            </div>
        </section>
    )
}

export default Alerts
