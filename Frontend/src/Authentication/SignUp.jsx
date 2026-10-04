import { useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { HiArrowLeft, HiArrowRight, HiCheck, HiEye, HiEyeSlash, HiLockClosed, HiOutlinePhoto } from "react-icons/hi2";
import Loading from "../components/Loading";
import { useUserContext } from "../Context/UserContextProvider";

function SignUp() {
    const useAuth = useUserContext();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const handleProfileImageChange = (event) => {
        const file = event.target.files?.[0] || null;
        setMessage("");
        if (!file) { setCoverImage(null); return; }
        if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
            setCoverImage(null);
            event.target.value = "";
            setMessage("Choose a JPEG, PNG, WebP, or GIF profile image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setCoverImage(null);
            event.target.value = "";
            setMessage("Profile images must be 5 MB or smaller.");
            return;
        }
        setCoverImage(file);
    };

    const signUp = async (event) => {
        event.preventDefault();
        setMessage("");
        if (!fullName.trim() || !email.trim() || !password || !userName.trim() || !mobileNumber.trim()) {
            setMessage("Complete each required field to create your account.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setMessage("Enter a valid email address.");
            return;
        }
        if (!/^[6-9]\d{9}$/.test(mobileNumber.trim())) {
            setMessage("Enter a valid 10 digit mobile number.");
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            setMessage("Use at least 8 characters with at least one letter and one number.");
            return;
        }
        if (!/^[a-zA-Z0-9_]{3,}$/.test(userName.trim())) {
            setMessage("Usernames need 3 or more letters, numbers, or underscores.");
            return;
        }

        const result = await useAuth.signUp(fullName.trim(), userName.trim(), email.trim(), password, mobileNumber.trim(), coverImage || "");
        if (result?.success && result.data?._id) {
            navigate(`/dashboard/user/${result.data._id}`);
            return;
        }
        setMessage(result?.message || "Unable to create your account. Please try again.");
    };

    if (useAuth.loading) return <Loading />;
    if (useAuth.user) return <Navigate to={`/dashboard/user/${useAuth.user._id}`} replace />;

    return (
        <main className="auth-page">
            <NavLink to="/" className="auth-back"><HiArrowLeft /> <span>Back to home</span></NavLink>
            <div className="auth-layout auth-layout-signup">
                <section className="auth-aside">
                    <NavLink to="/" className="brand"><span className="brand-mark"><span /></span><span>pulse<span className="brand-light">check</span></span></NavLink>
                    <div className="auth-aside-copy"><span className="auth-kicker"><i /> YOUR SERVICES, IN GOOD HANDS</span><h1>Know sooner.<br /><span>Respond smarter.</span></h1><p>Set up your account and bring your important websites into one simple uptime dashboard.</p><div className="auth-benefits"><span><HiCheck /> Start monitoring in minutes</span><span><HiCheck /> Get alerts when checks fail</span><span><HiCheck /> Keep service health in view</span></div></div>
                    <div className="auth-aside-foot"><HiLockClosed /> Your account is protected with secure sign in.</div><div className="auth-decoration auth-decoration-one"/><div className="auth-decoration auth-decoration-two"/>
                </section>
                <section className="auth-main auth-main-signup">
                    <div className="auth-form-wrap">
                        <div className="auth-heading"><span className="auth-mobile-brand"><span className="brand-mark"><span /></span> pulsecheck</span><span className="auth-kicker">GET STARTED</span><h2>Create your account</h2><p>A few details and you’re ready to monitor.</p></div>
                        <form className="auth-form auth-form-signup" onSubmit={signUp} noValidate>
                            <div className="auth-fields-grid">
                                <label className="auth-field"><span>Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} name="fullName" type="text" autoComplete="name" placeholder="Alex Morgan" required /></label>
                                <label className="auth-field"><span>Username</span><input value={userName} onChange={(event) => setUserName(event.target.value)} name="userName" type="text" autoComplete="username" placeholder="alexmorgan" required /></label>
                                <label className="auth-field"><span>Email address</span><input value={email} onChange={(event) => setEmail(event.target.value)} name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
                                <label className="auth-field"><span>Mobile number</span><input value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value.replace(/\D/g, "").slice(0, 10))} name="mobileNumber" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10 digit number" required /></label>
                            </div>
                            <label className="auth-field"><span>Password</span><span className="auth-password-wrap"><input value={password} onChange={(event) => setPassword(event.target.value)} name="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a secure password" required /><button type="button" className="auth-show-password" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <HiEyeSlash /> : <HiEye />}</button></span><small className="auth-hint">At least 8 characters, including a letter and a number.</small></label>
                            <label className="auth-upload"><input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" onChange={handleProfileImageChange} /><span className="auth-upload-icon"><HiOutlinePhoto /></span><span><b>{coverImage ? coverImage.name : "Add a profile photo"}</b><small>Optional: JPEG, PNG, WebP, or GIF (5 MB max)</small></span><span className="auth-upload-action">Browse</span></label>
                            {message && <p className="auth-message" role="alert">{message}</p>}
                            <button className="auth-submit" type="submit">Create account <HiArrowRight /></button>
                        </form>
                        <p className="auth-switch">Already have an account? <NavLink to="/login">Sign in</NavLink></p>
                        <p className="auth-legal">By creating an account, you agree to use Pulsecheck responsibly.</p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default SignUp;
