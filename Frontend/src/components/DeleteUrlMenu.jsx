import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDashboardContext } from '../Context/DashboardContextProvider'

function DeleteUrlMenu({ setDeleteForm, url, getBack }) {
    const useDashboard = useDashboardContext()
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const closeOnEscape = (event) => { if (event.key === 'Escape' && !deleting) setDeleteForm(false) }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [deleting, setDeleteForm])

    const confirmDelete = async () => {
        setDeleting(true)
        setError("")
        try {
            const response = await useDashboard.deleteUrl(url)
            if (!response?.success) {
                setError(response?.message || "Could not delete this monitor. Please try again.")
                return
            }
            await useDashboard.getAllUrls()
            setDeleteForm(false)
            if (getBack) window.history.back()
        } catch {
            setError("Could not delete this monitor. Check your connection and try again.")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="delete-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDeleteForm(false) }}>
            <section className="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
                <span className="delete-modal-icon"><span>!</span></span>
                <h2 id="delete-title">Delete this monitor?</h2>
                <p>This removes the monitor and its recorded response history. You can add the website again later.</p>
                {error && <p className="delete-modal-error" role="alert">{error}</p>}
                <div><button className="detail-button detail-button-subtle" disabled={deleting} onClick={() => setDeleteForm(false)}>Keep monitor</button><button className="detail-button delete-confirm-button" disabled={deleting} onClick={confirmDelete}>{deleting ? "Deleting…" : "Delete monitor"}</button></div>
            </section>
        </div>
    )
}

DeleteUrlMenu.propTypes = {
    setDeleteForm: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    getBack: PropTypes.bool,
}

export default DeleteUrlMenu
