import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, NavLink, useParams } from "react-router-dom";
import { HiArrowLeft, HiArrowPath, HiArrowTopRightOnSquare, HiCheckCircle, HiClock, HiEnvelope, HiExclamationTriangle, HiGlobeAlt, HiPaperAirplane, HiTrash, HiXMark } from "react-icons/hi2";
import { useDashboardContext } from "../Context/DashboardContextProvider.jsx";
import { useUserContext } from "../Context/UserContextProvider.jsx";
import Loading from "../components/Loading.jsx";
import DeleteUrlMenu from "../components/DeleteUrlMenu.jsx";
import TimingChart from "../components/UrlStatusGraphChart.jsx";

function formatDuration(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function UrlDashboard() {
    const { id, urlId } = useParams();
    const { getSingleUrl, sendTestAlert } = useDashboardContext();
    const { user, loading: authLoading } = useUserContext();
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [retryCount, setRetryCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [deleteForm, setDeleteForm] = useState(false);
    const [emailComposerOpen, setEmailComposerOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (!emailComposerOpen) return undefined;
        const closeOnEscape = (event) => { if (event.key === "Escape" && !sending) setEmailComposerOpen(false); };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [emailComposerOpen, sending]);

    const loadMonitor = useCallback(async ({ initial = false } = {}) => {
        if (!urlId) return;
        if (initial) {
            setLoading(true);
            setLoadError("");
        } else {
            setRefreshing(true);
        }
        try {
            const response = await getSingleUrl(urlId);
            if (!response?.data) {
                if (initial) setLoadError(response?.message || "We couldn't find this monitor. It may have been deleted.");
                else setFeedback({ type: "error", message: response?.message || "Could not refresh this monitor. Try again shortly." });
                return;
            }
            setUrl(response);
            setLoadError("");
        } catch {
            if (initial) setLoadError("We couldn't load this monitor. Check your connection and try again.");
            else setFeedback({ type: "error", message: "Could not refresh this monitor. Check your connection and try again." });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [getSingleUrl, urlId]);

    useEffect(() => {
        if (authLoading || !user) return undefined;
        let active = true;
        setUrl(null);
        setLoading(true);
        setLoadError("");
        getSingleUrl(urlId).then((response) => {
            if (!active) return;
            if (response?.data) setUrl(response);
            else setLoadError(response?.message || "We couldn't find this monitor. It may have been deleted.");
        }).catch(() => {
            if (active) setLoadError("We couldn't load this monitor. Check your connection and try again.");
        }).finally(() => {
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, [urlId, getSingleUrl, retryCount, authLoading, user]);

    useEffect(() => {
        if (authLoading || !user || !urlId) return undefined;
        const intervalId = setInterval(() => {
            getSingleUrl(urlId).then((response) => {
                if (response?.data) setUrl(response);
            });
        }, 60000);
        return () => clearInterval(intervalId);
    }, [urlId, getSingleUrl, authLoading, user]);

    const monitor = url?.data;
    const latestCheck = monitor?.statusCodes?.at(-1);
    const isUp = Number(monitor?.statusCode) > 0 && Number(monitor?.statusCode) < 400;
    const uptime = useMemo(() => {
        const checks = monitor?.statusCodes || [];
        if (!checks.length) return null;
        const goodChecks = checks.filter((check) => Number(check.statusCode) >= 200 && Number(check.statusCode) < 400).length;
        return (goodChecks / checks.length * 100).toFixed(2);
    }, [monitor?.statusCodes]);
    const addedDuration = monitor?.createdAt ? formatDuration(Math.max(0, Math.floor((Date.now() - new Date(monitor.createdAt).getTime()) / 1000))) : "—";
    const latestResponse = Number(latestCheck?.totalTime);

    useEffect(() => {
        if (!feedback) return undefined;
        const timeout = setTimeout(() => setFeedback(null), 6000);
        return () => clearTimeout(timeout);
    }, [feedback]);

    const openEmailComposer = () => {
        const name = user?.fullName || "there";
        const status = isUp ? "Operational" : "Unavailable";
        const checkedAt = latestCheck?.date ? new Date(latestCheck.date).toLocaleString() : "Not checked yet";
        setEmailSubject(`Pulsecheck test alert: ${monitor.Urls}`.slice(0, 160));
        setEmailMessage(`Hi ${name},\n\nThis is a test email from Pulsecheck for your monitor ${monitor.Urls}.\n\nCurrent status: ${status}\nHTTP status code: ${monitor.statusCode ?? "Unknown"}\nLast checked: ${checkedAt}\n\nIf you received this message, your email alert delivery is working.\n\n— Pulsecheck`);
        setEmailError("");
        setEmailComposerOpen(true);
    };

    const sendAlert = async (event) => {
        event.preventDefault();
        if (!emailSubject.trim() || !emailMessage.trim()) {
            setEmailError("Add a subject and message before sending.");
            return;
        }
        setSending(true);
        setEmailError("");
        try {
            const response = await sendTestAlert(monitor._id, emailSubject.trim(), emailMessage.trim());
            if (!response?.success) {
                setEmailError(response?.message || "The test email could not be sent. Please try again.");
                return;
            }
            setEmailComposerOpen(false);
            setFeedback({ type: "success", message: response.message || `Test email sent to ${user?.email || "your account email"}.` });
        } catch (error) {
            setEmailError(error.message || "The test email could not be sent. Please try again.");
        } finally {
            setSending(false);
        }
    };

    if (authLoading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;
    if (loading) return <Loading />;

    if (loadError || !monitor) {
        return <main className="detail-state-page"><div className="detail-state-card"><span className="detail-state-icon">!</span><p className="section-kicker">MONITOR UNAVAILABLE</p><h1>We couldn’t load this monitor</h1><p>{loadError || "The monitor response was empty. Please try again."}</p><div><button className="button button-primary" onClick={() => setRetryCount((count) => count + 1)}>Try again</button><NavLink className="button detail-secondary-button" to={`/dashboard/user/${id}`}>Back to monitors</NavLink></div></div></main>;
    }

    return (
        <main className="url-detail-page">
            <header className="detail-topbar"><Link to={`/dashboard/user/${id}`} className="detail-back"><HiArrowLeft /> <span>All monitors</span></Link><NavLink to={`/dashboard/profile/${user?._id}`} className="detail-account"><span>{(user?.fullName || "U").slice(0, 1).toUpperCase()}</span><b>{user?.fullName || "Account"}</b></NavLink></header>
            <div className="detail-content">
                <div className="detail-breadcrumb"><span>MONITORS</span><span>/</span><span>OVERVIEW</span></div>
                <section className="monitor-heading-card">
                    <div className="monitor-heading-main"><span className={`monitor-status-icon ${isUp ? "status-online" : "status-offline"}`}><HiGlobeAlt /></span><div className="monitor-heading-copy"><div className="monitor-title-row"><h1>{monitor.Urls}</h1><a className="external-monitor-link" href={monitor.Urls} target="_blank" rel="noreferrer" aria-label="Open website in a new tab"><HiArrowTopRightOnSquare /></a></div><div className="monitor-subtitle"><span className={`status-pill ${isUp ? "status-pill-up" : "status-pill-down"}`}><i />{isUp ? "Operational" : "Unavailable"}</span><span>HTTP {monitor.statusCode || "—"}</span><span>Checks every 3 minutes</span></div></div></div>
                    <div className="monitor-heading-actions"><button className="detail-button detail-button-subtle" onClick={() => loadMonitor()} disabled={refreshing}><HiArrowPath className={refreshing ? "refresh-spin" : ""} />{refreshing ? "Refreshing" : "Refresh"}</button><button className="detail-button detail-button-mail" onClick={openEmailComposer}><HiEnvelope /> Send test email</button><button className="detail-button detail-button-danger" onClick={() => setDeleteForm(true)}><HiTrash /> Delete</button></div>
                </section>

                {feedback && <div className={`detail-toast ${feedback.type === "success" ? "toast-success" : "toast-error"}`} role="status"><HiCheckCircle /><span>{feedback.message}</span><button onClick={() => setFeedback(null)} aria-label="Dismiss message"><HiXMark /></button></div>}

                <section className="detail-metrics" aria-label="Monitor summary">
                    <article className="detail-metric-card"><span>Current status</span><strong className={isUp ? "metric-green" : "metric-red"}>{isUp ? "Operational" : "Unavailable"}</strong><small><i className={isUp ? "metric-dot-green" : "metric-dot-red"} />Live monitor status</small></article>
                    <article className="detail-metric-card"><span>Uptime in history</span><strong>{uptime === null ? "—" : `${uptime}%`}</strong><small>Based on {monitor.statusCodes?.length || 0} recorded checks</small></article>
                    <article className="detail-metric-card"><span>Latest response</span><strong>{Number.isFinite(latestResponse) && latestResponse > 0 ? <>{Math.round(latestResponse)}<small>ms</small></> : "—"}</strong><small>{latestCheck?.date ? `Checked ${new Date(latestCheck.date).toLocaleTimeString()}` : "Waiting for first check"}</small></article>
                    <article className="detail-metric-card"><span>Monitoring since</span><strong>{addedDuration}</strong><small><HiClock /> Added {new Date(monitor.createdAt).toLocaleDateString()}</small></article>
                </section>

                <section className="detail-chart-card"><div className="detail-section-heading"><div><span className="section-kicker">PERFORMANCE</span><h2>Response time</h2><p>Timing breakdown from recent monitor checks.</p></div><span className="chart-range-label">Recent checks</span></div>{Array.isArray(monitor.statusCodes) && monitor.statusCodes.length > 0 ? <TimingChart data={monitor.statusCodes} /> : <div className="detail-chart-empty"><span><HiArrowPath /></span><b>Waiting for response history</b><p>We’ll show timing data here after this monitor completes its next check.</p></div>}</section>

                <footer className="detail-page-footer"><span><i className="live-dot" /> Monitor updates automatically</span><span>{monitor.incidents ?? 0} incidents recorded</span></footer>
            </div>

            {emailComposerOpen && <div className="email-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !sending) setEmailComposerOpen(false); }}><section className="email-modal" role="dialog" aria-modal="true" aria-labelledby="email-modal-title"><header className="email-modal-header"><div><span className="email-modal-icon"><HiEnvelope /></span><div><h2 id="email-modal-title">Send a test email</h2><p>Confirm that alert delivery is working.</p></div></div><button type="button" className="email-modal-close" onClick={() => setEmailComposerOpen(false)} disabled={sending} aria-label="Close email composer"><HiXMark /></button></header><form onSubmit={sendAlert} className="email-compose-form"><label><span>To</span><div className="email-readonly">{user?.email || "Your account email"}</div></label><label><span>Subject</span><input value={emailSubject} onChange={(event) => setEmailSubject(event.target.value)} maxLength={160} required /></label><label><span>Message</span><textarea value={emailMessage} onChange={(event) => setEmailMessage(event.target.value)} maxLength={10000} rows={9} required /></label>{emailError && <p className="email-compose-error" role="alert"><HiExclamationTriangle />{emailError}</p>}<footer><span>Sent to your account email address.</span><div><button type="button" className="detail-button detail-button-subtle" onClick={() => setEmailComposerOpen(false)} disabled={sending}>Cancel</button><button type="submit" className="detail-button detail-button-mail" disabled={sending}><HiPaperAirplane />{sending ? "Sending…" : "Send test email"}</button></div></footer></form></section></div>}
            {deleteForm && <DeleteUrlMenu setDeleteForm={setDeleteForm} url={monitor._id} getBack />}
        </main>
    );
}

export default UrlDashboard;
