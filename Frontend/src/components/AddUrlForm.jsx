import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { HiArrowPath, HiOutlineBellAlert, HiOutlineDevicePhoneMobile, HiOutlineEnvelope, HiOutlinePhone, HiXMark } from 'react-icons/hi2'
import { useDashboardContext } from '../Context/DashboardContextProvider'

function AddUrlForm({ toggleForm, setInput }) {
    const dashboard = useDashboardContext()
    const [url, setUrl] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const closeOnEscape = (event) => { if (event.key === 'Escape' && !saving) toggleForm(false) }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [saving, toggleForm])

    const addUrl = async (event) => {
        event.preventDefault()
        let normalizedUrl = url.trim()
        if (!normalizedUrl) return setError('Enter a website address to monitor.')
        if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = `https://${normalizedUrl}`
        try {
            const parsedUrl = new URL(normalizedUrl)
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Unsupported protocol')
        } catch { return setError('Enter a valid website address, such as example.com.') }

        setSaving(true)
        setError('')
        try {
            const response = await dashboard.addUrl(normalizedUrl, 'email')
            if (!response?.success) {
                setError(response?.message || "We couldn't add this monitor. Check the address and try again.")
                return
            }
            await dashboard.getAllUrls()
            setInput('')
            toggleForm(false)
        } catch {
            setError("We couldn't add this monitor. Please try again.")
        } finally { setSaving(false) }
    }

    return (
        <div className="add-monitor-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) toggleForm(false) }}>
            <section className="add-monitor-modal" role="dialog" aria-modal="true" aria-labelledby="add-monitor-title">
                <header className="add-monitor-header"><span className="add-monitor-icon"><HiOutlineBellAlert /></span><div><h2 id="add-monitor-title">Add a monitor</h2><p>We’ll check your website and keep you informed.</p></div><button type="button" className="add-monitor-close" onClick={() => toggleForm(false)} disabled={saving} aria-label="Close"><HiXMark /></button></header>
                <form onSubmit={addUrl} className="add-monitor-form">
                    <label htmlFor="monitor-url">Website address</label>
                    <div className="add-monitor-url-input"><input id="monitor-url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://yourwebsite.com" autoComplete="url" inputMode="url" /></div>
                    <span className="add-monitor-hint"><HiArrowPath /> You can enter a domain or a full URL.</span>
                    <div className="notification-options-heading"><div><b>Notification channels</b><small>Choose where monitor alerts should go.</small></div></div>
                    <div className="notification-channel-grid">
                        <div className="notification-channel is-selected"><span className="channel-icon"><HiOutlineEnvelope /></span><span><b>Email</b><small>Enabled for your account</small></span><em>AVAILABLE</em></div>
                        <div className="notification-channel is-coming-soon"><span className="channel-icon"><HiOutlineDevicePhoneMobile /></span><span><b>Text message</b><small>SMS alerts are coming soon</small></span><em>COMING SOON</em></div>
                        <div className="notification-channel is-coming-soon"><span className="channel-icon"><HiOutlinePhone /></span><span><b>Phone call</b><small>Voice alerts are coming soon</small></span><em>COMING SOON</em></div>
                    </div>
                    {error && <p className="add-monitor-error" role="alert">{error}</p>}
                    <footer><button type="button" className="add-monitor-cancel" onClick={() => toggleForm(false)} disabled={saving}>Cancel</button><button type="submit" className="add-monitor-submit" disabled={saving}>{saving ? 'Adding monitor…' : 'Add monitor'}</button></footer>
                </form>
            </section>
        </div>
    )
}

AddUrlForm.propTypes = { toggleForm: PropTypes.func.isRequired, setInput: PropTypes.func.isRequired }
export default AddUrlForm
