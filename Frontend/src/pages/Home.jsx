import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiArrowRight, HiArrowUpRight, HiCheckCircle, HiOutlineGlobeAlt, HiOutlineShieldCheck, HiOutlineBolt, HiOutlineBellAlert } from "react-icons/hi2";
import Navbar from "../components/Navbar";
import { useDashboardContext } from "../Context/DashboardContextProvider";

function Home() {
    const { checkUrl } = useDashboardContext();
    const [url, setUrl] = useState("");
    const [checking, setChecking] = useState(false);
    const [result, setResult] = useState(null);

    const checkWebsite = async (event) => {
        event.preventDefault();
        let normalizedUrl = url.trim();
        if (!normalizedUrl) return;
        if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = `https://${normalizedUrl}`;
        try {
            new URL(normalizedUrl);
        } catch {
            setResult({ ok: false, message: "Enter a valid website address, such as example.com." });
            return;
        }
        setChecking(true);
        setResult(null);
        try {
            const response = await checkUrl(normalizedUrl);
            if (!response) throw new Error("The check could not be completed. Please try again.");
            setResult({ ok: Number(response.data) < 500, message: response.message || `Website responded with status ${response.data}.` });
        } catch (error) {
            setResult({ ok: false, message: error.message || "We couldn't reach the status service. Try again shortly." });
        } finally {
            setChecking(false);
        }
    };

    return (
        <main>
            <section id="home" className="hero-section">
                <Navbar />
                <div className="hero-grid page-container">
                    <div className="hero-copy">
                        <div className="eyebrow"><span className="live-dot" /> SIMPLE, RELIABLE UPTIME MONITORING</div>
                        <h1>Know when your<br /><span>website goes down.</span></h1>
                        <p className="hero-lede">Catch downtime before your customers do. Get clear, timely alerts and a live view of every service you depend on.</p>
                        <div className="hero-actions">
                            <NavLink to="/sign-up" className="button button-primary button-large">Start monitoring free <HiArrowRight /></NavLink>
                            <a href="#features" className="text-link">Explore the platform <HiArrowDown /></a>
                        </div>
                        <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><span>Built for teams that care about being online.</span></div>
                    </div>
                    <div className="hero-visual" aria-label="Uptime dashboard preview">
                        <div className="visual-glow" />
                        <div className="dashboard-preview">
                            <div className="preview-topbar"><div className="preview-brand"><span className="brand-mark"><span /></span> pulsecheck</div><span className="preview-live"><i /> All systems operational</span></div>
                            <div className="preview-heading"><div><span className="preview-overline">OVERVIEW / LAST 24 HOURS</span><h3>Good morning, Alex <span>✦</span></h3></div><button aria-label="More options">···</button></div>
                            <div className="preview-stats"><div><span>Uptime</span><strong>99.98<small>%</small></strong><em>↑ 0.03% this month</em></div><div><span>Response time</span><strong>184<small>ms</small></strong><em>↓ 12ms this week</em></div><div><span>Monitors</span><strong>08</strong><em>All checks passing</em></div></div>
                            <div className="preview-chart-head"><div><strong>Response time</strong><span> Average over 24 hours</span></div><span className="chart-legend"><i /> api.acme.io</span></div>
                            <div className="chart-area"><div className="chart-y-labels"><span>300ms</span><span>200ms</span><span>100ms</span><span>0ms</span></div><svg viewBox="0 0 600 150" preserveAspectRatio="none" role="img" aria-label="Response time graph"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5b72f2" stopOpacity=".2"/><stop offset="100%" stopColor="#5b72f2" stopOpacity="0"/></linearGradient></defs><path d="M0 105 C25 98 32 109 52 94 S82 105 100 80 S130 89 150 83 S181 95 200 68 S226 80 246 76 S269 69 286 84 S315 66 335 71 S360 56 380 66 S400 73 420 48 S448 65 465 54 S490 61 512 38 S540 53 558 40 S580 49 600 27 V150 H0Z" fill="url(#chartFill)"/><path d="M0 105 C25 98 32 109 52 94 S82 105 100 80 S130 89 150 83 S181 95 200 68 S226 80 246 76 S269 69 286 84 S315 66 335 71 S360 56 380 66 S400 73 420 48 S448 65 465 54 S490 61 512 38 S540 53 558 40 S580 49 600 27" fill="none" stroke="#6178f3" strokeWidth="3" vectorEffect="non-scaling-stroke"/></svg></div>
                            <div className="chart-x-labels"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span></div>
                            <div className="preview-monitor"><span className="monitor-favicon">A</span><span><strong>api.acme.io</strong><small>HTTPS · Every 3 minutes</small></span><span className="monitor-status"><i /> Operational</span><span className="monitor-uptime">99.99%</span><span className="monitor-menu">···</span></div>
                        </div>
                        <div className="floating-check"><span><HiCheckCircle /></span><div><strong>Everything looks good</strong><small>Last checked just now</small></div><b>●</b></div>
                    </div>
                </div>
                <div className="hero-bottom page-container"><span>VISIBILITY FOR WHAT MATTERS</span><div className="trust-points"><span><HiOutlineBolt /> Fast checks</span><span><HiOutlineBellAlert /> Useful alerts</span><span><HiOutlineShieldCheck /> Always on</span></div></div>
            </section>

            <section className="checker-section page-container" aria-labelledby="checker-title">
                <div className="checker-card"><div><span className="section-kicker">A QUICK FIRST LOOK</span><h2 id="checker-title">Is your website up right now?</h2><p>Run a one-time check on any public website.</p></div><form className="checker-form" onSubmit={checkWebsite}><div className="url-input-wrap"><HiOutlineGlobeAlt /><input type="text" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="yourwebsite.com" aria-label="Website address" /></div><button className="button button-primary" disabled={checking}>{checking ? <><span className="button-spinner" /> Checking</> : <>Check status <HiArrowRight /></>}</button></form>{result && <p className={`checker-result ${result.ok ? "result-ok" : "result-error"}`} role="status">{result.ok ? <HiCheckCircle /> : <span>!</span>}{result.message}</p>}<small className="checker-note">For continuous monitoring and alerts, <NavLink to="/sign-up">create a free account <HiArrowUpRight /></NavLink></small></div>
            </section>
        </main>
    );
}

function HiArrowDown() { return <span aria-hidden="true">↓</span>; }

export default Home;
