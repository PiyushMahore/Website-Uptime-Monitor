import { useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { HiArrowLeft, HiArrowRight, HiCheck, HiEye, HiEyeSlash, HiLockClosed } from "react-icons/hi2";
import Loading from "../components/Loading";
import { useUserContext } from "../Context/UserContextProvider";

function Login() {
    const useAuth = useUserContext();
    const navigate = useNavigate();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    const logIn = async (event) => {
        event.preventDefault();
        setMessage("");
        if (!credential.trim() || !password) {
            setMessage("Enter your email or username and password to continue.");
            return;
        }

        const response = await useAuth.login(credential.trim(), password);
        if (response?.data?._id) {
            navigate(`/dashboard/user/${response.data._id}`);
        } else {
            setMessage(response?.message || (response === "Password is Wrong" ? "The password you entered is incorrect." : "We couldn't sign you in. Check your details and try again."));
        }
    };

    if (useAuth.loading) return <Loading />;
    if (useAuth.user) return <Navigate to={`/dashboard/user/${useAuth.user._id}`} replace />;

    return (
        <main className="auth-page">
            <NavLink to="/" className="auth-back"><HiArrowLeft /> <span>Back to home</span></NavLink>
            <div className="auth-layout">
                <section className="auth-aside">
                    <NavLink to="/" className="brand"><span className="brand-mark"><span /></span><span>pulse<span className="brand-light">check</span></span></NavLink>
                    <div className="auth-aside-copy">
                        <span className="auth-kicker"><i /> YOUR SERVICES, IN GOOD HANDS</span>
                        <h1>More uptime.<br /><span>Less worry.</span></h1>
                        <p>Get a clear view of the services your customers count on, with helpful alerts when something needs your attention.</p>
                        <div className="auth-benefits"><span><HiCheck /> Live service health</span><span><HiCheck /> Useful alerts, right on time</span><span><HiCheck /> Simple, clear monitoring</span></div>
                    </div>
                    <div className="auth-aside-foot"><HiLockClosed /> Your account is protected with secure sign in.</div>
                    <div className="auth-decoration auth-decoration-one"/><div className="auth-decoration auth-decoration-two"/>
                </section>
                <section className="auth-main">
                    <div className="auth-form-wrap">
                        <div className="auth-heading"><span className="auth-mobile-brand"><span className="brand-mark"><span /></span> pulsecheck</span><span className="auth-kicker">WELCOME BACK</span><h2>Sign in to your account</h2><p>Pick up right where you left off.</p></div>
                        <form className="auth-form" onSubmit={logIn} noValidate>
                            <label className="auth-field"><span>Email or username</span><input value={credential} onChange={(event) => setCredential(event.target.value)} name="username" type="text" autoComplete="username" placeholder="you@example.com or username" required /></label>
                            <label className="auth-field"><span>Password</span><span className="auth-password-wrap"><input value={password} onChange={(event) => setPassword(event.target.value)} name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required /><button type="button" className="auth-show-password" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <HiEyeSlash /> : <HiEye />}</button></span></label>
                            <div className="auth-inline-link"><NavLink to="/login/reset-password">Forgot password?</NavLink></div>
                            {message && <p className="auth-message" role="alert">{message}</p>}
                            <button className="auth-submit" type="submit">Sign in <HiArrowRight /></button>
                        </form>
                        <p className="auth-switch">New to Pulsecheck? <NavLink to="/sign-up">Create an account</NavLink></p>
                        <p className="auth-legal">By continuing, you agree to use Pulsecheck responsibly.</p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Login;
