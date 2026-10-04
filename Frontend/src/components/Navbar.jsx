import { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { NavLink } from "react-router-dom";
import { HiBars3, HiMoon, HiSun, HiXMark } from "react-icons/hi2";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    useEffect(() => {
        if (!menuOpen) return undefined;
        const closeOnEscape = (event) => { if (event.key === "Escape") setMenuOpen(false); };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [menuOpen]);

    const toggleTheme = () => {
        const nextTheme = darkMode ? "light" : "dark";
        localStorage.setItem("theme", nextTheme);
        document.body.classList.toggle("dark", nextTheme === "dark");
        setDarkMode(nextTheme === "dark");
    };

    const closeMenu = () => setMenuOpen(false);
    const links = [
        { label: "Product", to: "features" },
        { label: "Solutions", to: "services" },
        { label: "Alerts", to: "alerts" },
    ];

    return (
        <header className="site-header">
            <nav className="nav-shell" aria-label="Main navigation">
                <a href="#home" className="brand" onClick={closeMenu} aria-label="PulseCheck home">
                    <span className="brand-mark"><span /></span>
                    <span>pulse<span className="brand-light">check</span></span>
                </a>
                <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
                    {links.map((link) => <ScrollLink key={link.to} to={link.to} smooth duration={450} offset={-76} onClick={closeMenu}>{link.label}</ScrollLink>)}
                    <ScrollLink to="contact" smooth duration={450} offset={-76} onClick={closeMenu}>Contact</ScrollLink>
                    <div className="mobile-nav-actions">
                        <NavLink to="/login" onClick={closeMenu}>Sign in</NavLink>
                        <NavLink to="/sign-up" className="button button-primary" onClick={closeMenu}>Start monitoring</NavLink>
                    </div>
                </div>
                <div className="nav-actions">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}>
                        {darkMode ? <HiSun /> : <HiMoon />}
                    </button>
                    <NavLink to="/login" className="nav-signin">Sign in</NavLink>
                    <NavLink to="/sign-up" className="button button-primary nav-cta">Get started <span aria-hidden="true">↗</span></NavLink>
                </div>
                <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
                    {menuOpen ? <HiXMark /> : <HiBars3 />}
                </button>
            </nav>
        </header>
    );
}

export default Navbar;
