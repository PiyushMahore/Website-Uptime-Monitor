import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { HiArrowRightOnRectangle, HiOutlineExclamationTriangle, HiXMark } from 'react-icons/hi2'
import { useUserContext } from '../Context/UserContextProvider'
import { useDashboardContext } from '../Context/DashboardContextProvider'
import { useNavigate } from 'react-router-dom'

function LogoutForm({ setLogoutForm }) {
    const auth = useUserContext()
    const dashboard = useDashboardContext()
    const navigate = useNavigate()
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const closeOnEscape = (event) => { if (event.key === 'Escape' && !busy) setLogoutForm(false) }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [busy, setLogoutForm])

    const logout = async () => {
        setBusy(true)
        setError('')
        const result = await auth.logOut()
        if (typeof result === 'string' || result?.success === false) {
            setError(result?.message || 'We could not sign you out. Please try again.')
            setBusy(false)
            return
        }
        dashboard.clearUrls()
        navigate('/')
    }

    return (
        <div className="logout-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setLogoutForm(false) }}>
            <section className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
                <button className="logout-modal-close" type="button" aria-label="Close" onClick={() => setLogoutForm(false)} disabled={busy}><HiXMark /></button>
                <span className="logout-modal-icon"><HiArrowRightOnRectangle /></span>
                <span className="section-kicker">ACCOUNT</span>
                <h2 id="logout-title">Sign out of Pulsecheck?</h2>
                <p>You can sign back in any time to check your monitors and alert settings.</p>
                {error && <div className="logout-modal-error" role="alert"><HiOutlineExclamationTriangle />{error}</div>}
                <div className="logout-modal-actions"><button type="button" className="logout-cancel" onClick={() => setLogoutForm(false)} disabled={busy}>Stay signed in</button><button type="button" className="logout-confirm" onClick={logout} disabled={busy}>{busy ? 'Signing out…' : 'Sign out'}</button></div>
            </section>
        </div>
    )
}

LogoutForm.propTypes = { setLogoutForm: PropTypes.func.isRequired }
export default LogoutForm
