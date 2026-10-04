import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../Context/UserContextProvider";
import Loading from "../components/Loading";

function CreateNewPassword() {
    const { email } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useUserContext();
    const [otp, setOtp] = useState(location.state?.otp || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const changePassword = async (event) => {
        event.preventDefault();
        if (!/^\d{6}$/.test(otp)) return setMessage("Enter the 6 digit reset code from your email.");
        if (password.length < 8) return setMessage("Password must be at least 8 characters long.");
        if (password !== confirmPassword) return setMessage("Passwords do not match.");
        const result = await auth.resetPassword(decodeURIComponent(email), otp, password);
        if (result?.success) navigate("/login", { replace: true });
        else setMessage(result?.message || "The reset code is invalid or expired.");
    };

    if (auth.loading) return <Loading />;

    return (
        <main className="min-h-screen px-4 py-8">
            <form onSubmit={changePassword} className="mx-auto mt-10 w-full max-w-md space-y-5 rounded-xl border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-900 sm:p-8">
                <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Choose a new password</h1>
                <div>
                    <label htmlFor="reset-otp" className="mb-1 block text-sm font-medium">6 digit reset code</label>
                    <input id="reset-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900" />
                </div>
                <div>
                    <label htmlFor="new-password" className="mb-1 block text-sm font-medium">New password</label>
                    <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900" />
                </div>
                <div>
                    <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">Confirm password</label>
                    <input id="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900" />
                </div>
                {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
                <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500">Change password</button>
            </form>
        </main>
    );
}

export default CreateNewPassword;