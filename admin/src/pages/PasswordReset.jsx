import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/Spinner"
import api from "../interceptor"
import { endpoint } from "../api"
import { useState } from "react"

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    //Reset password API call
    const resetPassword = async () => {
        setLoading(true)
        try {
            const response = await api.post(`${endpoint}/auth/password/reset`, {
                email
            })
            alert("Email sent")
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await resetPassword()
    }
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white  rounded-lg border border-slate-300  overflow-hidden">
                    <div className="p-8 flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="mt-4">
                                <h2 className="text-slate-900  text-xl font-bold leading-tight">
                                    Password Reset
                                </h2>
                                <p className="text-slate-500  text-xs font-normal leading-normal mt-2">
                                    Enter your email to reset the password.
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-700 text-xs font-medium">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    placeholder="admin@aisystems.blog"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 placeholder:text-xs"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-5 bg-primary text-white text-base font-bold tracking-wide transition-all
                                ${loading
                                        ? "opacity-70 cursor-not-allowed"
                                        : "hover:opacity-90 active:scale-[0.98]"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner />
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    <span>Reset password</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default ResetPassword