import { HiOutlineBuildingStorefront, HiOutlineBriefcase, HiOutlineCodeBracket, HiOutlineRocketLaunch } from "react-icons/hi2";

const audiences = [
    { icon: HiOutlineRocketLaunch, number: "01", title: "Growing teams", text: "Ship quickly while keeping a close eye on the services your customers rely on." },
    { icon: HiOutlineBuildingStorefront, number: "02", title: "Online businesses", text: "Keep storefronts and checkout flows available when every visit counts." },
    { icon: HiOutlineCodeBracket, number: "03", title: "Independent builders", text: "Get a simple, dependable safety net for the products you build and run." },
    { icon: HiOutlineBriefcase, number: "04", title: "Service teams", text: "See what is healthy, spot interruptions, and share status with your team." },
];

function Services() {
    return <section id="services" className="audience-section section-pad"><div className="page-container"><div className="audience-heading"><div><span className="section-kicker">FOR THE PEOPLE BEHIND THE SITE</span><h2>Made for the work<br />you do every day.</h2></div><p>From a side project to a busy storefront, uptime matters to everyone. Monitoring should be the easy part.</p></div><div className="audience-grid">{audiences.map(({ icon: Icon, number, title, text }) => <article className="audience-card" key={title}><div className="audience-card-top"><span className="audience-icon"><Icon /></span><span>{number}</span></div><h3>{title}</h3><p>{text}</p><span className="audience-arrow" aria-hidden="true">↗</span></article>)}</div></div></section>;
}

export default Services;
