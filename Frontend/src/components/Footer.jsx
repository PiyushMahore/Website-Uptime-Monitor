import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

function Footer() {
    return <footer id="contact" className="site-footer"><div className="page-container"><div className="footer-main"><div className="footer-about"><a href="#home" className="brand"><span className="brand-mark"><span /></span><span>pulse<span className="brand-light">check</span></span></a><p>Less worrying about uptime.<br />More time building what matters.</p></div><div className="footer-links"><div><b>Explore</b><a href="#features">Platform</a><a href="#services">Who it’s for</a><a href="#alerts">Alerts</a></div><div><b>Get started</b><NavLink to="/sign-up">Create account</NavLink><NavLink to="/login">Sign in</NavLink></div><div><b>Follow along</b><a href="https://github.com/PiyushMahore/Website-Uptime-Monitor" target="_blank" rel="noreferrer"><FaGithub /> GitHub</a><a href="https://www.linkedin.com/in/piyush-mahore-51602a2b1/" target="_blank" rel="noreferrer"><FaLinkedin /> LinkedIn</a><a href="https://x.com/Piyush_Mahore_" target="_blank" rel="noreferrer"><FaXTwitter /> X / Twitter</a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Pulsecheck. Built for a more reliable web.</span><span><i className="live-dot" /> Monitoring the things that matter</span></div></div></footer>;
}

export default Footer;
