import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import api from "../interceptor"
import Spinner from "../components/Spinner"
import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { endpoint } from "../api"
import { CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

function ChangePassword() {
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showResend, setShowResend] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle");
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    //Run token verification
    useEffect(() => {
        if (token) {
            const verifyToken = async () => {
                setLoading(true)
                try {
                    const response = await api.get(`${endpoint}/auth/verify/password/token?token=${token}`)
                    setMessage(response.data.message);
                    setStatus("success")
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message || "Failed to verify token.";

                    setMessage(errorMessage);
                    setStatus("error");

                    // Show resend form for recoverable token issues
                    if (
                        errorMessage.includes("used") ||
                        errorMessage.includes("expired") ||
                        errorMessage.includes("Invalid")
                    ) {
                        setShowResend(true);
                    }
                } finally {
                    setLoading(false)
                }
            }
            verifyToken()
        } else {
            setMessage("No token provided.");
            setStatus("error");
            alert("No token provided.")
        }
    }, [token])

    //Resend Password Reset EMail
    const resendResetEmail = async () => {
        if (!email) {
            setMessage("Please enter your email.");
            setStatus("error");
            alert("Email is required.");
            return;
        }

        setLoading(true)
        try {
            const response = await api.post(`${endpoint}/auth/password/reset`, { email })
            setMessage(response.data.message);
            setStatus("success");
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to resend email.");
            setStatus("error");
            alert("Email not sent")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await resetPassword(); // Call resetPassword when form is submitted
    };

    //Password Reset Submission
    const resetPassword = async () => {
        setLoading(true)
        try {
            const response = await api.put(`${endpoint}/auth/password/reset/token`, { token, newPassword, confirmPassword })
            setMessage(response.data.message);
            setStatus("success");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to reset password.");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    }

    //Password Form submission
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        // Client-side validation
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            setStatus("error");
            alert("Passwords do not match.");
            setLoading(false);
            return;
        }

        // Password strength validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setMessage(
                "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
            );
            setStatus("error");
            alert("Password does not meet requirements.");
            setLoading(false);
            return;
        }

        resetPassword();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-lg border border-slate-300 overflow-hidden">
                    <div className="p-8 flex flex-col gap-6">

                        {/* Header */}
                        <div className="flex flex-col items-center text-center gap-2">
                            <h2 className="text-slate-900 text-xl font-bold leading-tight">
                                Password Reset
                            </h2>

                            <p className="text-slate-500 text-xs">
                                {showResend
                                    ? "Request a new password reset link below."
                                    : "Enter your new password to regain access."}
                            </p>
                        </div>

                        {/* Status Message */}
                        {message && (
                            <div
                                className={`p-3 rounded-md text-xs flex items-center gap-2 ${status === "success"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {status === "success" ? (
                                    <CheckCircle size={18} />
                                ) : (
                                    <AlertCircle size={18} />
                                )}
                                {message}
                            </div>
                        )}

                        {/* Loading */}
                        {loading && !showResend && !message && (
                            <div className="flex justify-center py-10">
                                <Spinner />
                            </div>
                        )}

                        {/* RESEND FORM */}
                        {showResend ? (
                            <div className="flex flex-col gap-4">

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-700 text-xs font-medium">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        placeholder="admin@aisystems.blog"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-xs"
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    onClick={resendResetEmail}
                                    disabled={loading}
                                    className={`flex w-full items-center justify-center overflow-hidden rounded-md h-12 px-5 bg-primary text-white text-sm font-bold tracking-wide transition-all
                                        ${loading
                                            ? "opacity-70 cursor-not-allowed"
                                            : "hover:opacity-90 active:scale-[0.98] cursor-pointer"
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner />
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        <span>Resend Email</span>
                                    )}
                                </button>

                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full h-12 border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition"
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            /* RESET PASSWORD FORM */
                            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">

                                {/* New Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="newPassword"
                                        className="text-slate-700 text-xs font-medium">
                                        New Password
                                    </label>
                                    <div className="relative flex items-stretch">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            id="newPassword"
                                            required
                                            value={newPassword}
                                            placeholder="••••••••"
                                            aria-required="true"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(p => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-900"
                                            aria-label={
                                                showNewPassword ? "Hide password" : "Show password"
                                            }
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                </div>

                                {/* Confirm Password */}
                                <div className="flex flex-col gap-1.5 relative">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-slate-700 text-xs font-medium">
                                        Confirm Password
                                    </label>
                                    <div className="relative flex items-stretch">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            placeholder="••••••••"
                                            required
                                            aria-required="true"
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(p => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-900"
                                            aria-label={
                                                showConfirmPassword ? "Hide password" : "Show password"
                                            }
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>



                                </div>

                                {/* Info text */}
                                <p className="text-xs text-slate-500">
                                    Password must include uppercase, lowercase, number, and special character.
                                </p>

                                {/* Submit */}
                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex w-full items-center justify-center overflow-hidden rounded-md h-12 px-5 bg-primary text-white text-sm font-bold tracking-wide transition-all
                                        ${loading
                                            ? "opacity-70 cursor-not-allowed"
                                            : "hover:opacity-90 active:scale-[0.98] cursor-pointer"
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner />
                                            <span>Updating...</span>
                                        </div>
                                    ) : (
                                        <span>Update Password</span>
                                    )}
                                </button>

                                {/* Back */}
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="w-full h-12 border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition"
                                >
                                    Back to Login
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default ChangePassword