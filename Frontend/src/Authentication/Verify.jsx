import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { useUserContext } from "../Context/UserContextProvider";
import Loading from "../components/Loading";

function Verify() {
    const auth = useUserContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [requested, setRequested] = useState(false);
    const [message, setMessage] = useState("");

    const requestCode = async (event) => {
        event.preventDefault();
        setMessage("");
        const result = await auth.generateOtp(email.trim());
        if (result?.success) {
            setRequested(true);
            setMessage("If that account exists, a reset code has been sent.");
        } else {
            setMessage("We could not send a reset code. Please try again shortly.");
        }
    };

    const continueReset = (event) => {
        event.preventDefault();
        if (!/^\d{6}$/.test(otp)) {
            setMessage("Enter the 6 digit code from your email.");
            return;
        }
        navigate("/login/create-new-password/" + encodeURIComponent(email.trim()), { state: { otp } });
    };

    if (auth.loading) return <Loading />;

    return (
        <main className="min-h-screen px-4 py-8">
            <button type="button" className="mb-6 flex items-center gap-2" onClick={() => navigate(-1)}><IoMdArrowBack /> Back</button>
            <form onSubmit={requested ? continueReset : requestCode} className="mx-auto w-full max-w-md space-y-5 rounded-xl border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-900 sm:p-8">
                <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Reset your password</h1>
                <div>
                    <label htmlFor="reset-email" className="mb-1 block text-sm font-medium">Email address</label>
                    <input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900" />
                </div>
                {requested && <div>
                    <label htmlFor="reset-otp" className="mb-1 block text-sm font-medium">6 digit reset code</label>
                    <input id="reset-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900" />
                </div>}
                {message && <p role="status" className="text-sm text-indigo-600">{message}</p>}
                <button className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500" type="submit">{requested ? "Continue" : "Send reset code"}</button>
                {requested && <button className="w-full text-sm text-indigo-600" type="button" onClick={requestCode}>Resend code</button>}
            </form>
        </main>
    );
}

export default Verify;