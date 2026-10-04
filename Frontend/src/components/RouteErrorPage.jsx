import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

function RouteErrorPage() {
    const error = useRouteError();
    const title = isRouteErrorResponse(error)
        ? error.status === 404 ? "Page not found" : "This page couldn’t be opened"
        : "Something went wrong";
    const message = isRouteErrorResponse(error)
        ? error.statusText || "The page may have moved or is temporarily unavailable."
        : "An unexpected error stopped this page from loading. You can return home and try again.";

    return (
        <main className="detail-state-page" role="alert">
            <div className="detail-state-card">
                <span className="detail-state-icon">!</span>
                <p className="section-kicker">PULSECHECK</p>
                <h1>{title}</h1>
                <p>{message}</p>
                <div><Link className="button button-primary" to="/">Go to home</Link><button className="button detail-secondary-button" onClick={() => window.location.reload()}>Reload page</button></div>
            </div>
        </main>
    );
}

export default RouteErrorPage;
