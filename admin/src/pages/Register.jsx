import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/Spinner"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { endpoint } from "../api"


function Register() {
    const [formData, setFormData] = useState({ email: "", password: "", });
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;

        if (!emailRegex.test(formData.email))
            errors.email = "Please enter a valid email address.";
        if (!passwordRegex.test(formData.password))
            errors.password = "Password must be at least 6 characters, include uppercase, lowercase, and a number or symbol.";
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = validateForm()
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setLoading(true)
        try {
            const response = await fetch(`${endpoint}/auth/admin/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed. Please retry.");

            // Wait for 2 seconds before navigating
            await new Promise((resolve) => setTimeout(resolve, 2000));
            alert(data.message || "Account creation successful.");
            navigate("/login");
        } catch (error) {
            // Wait for 2 seconds before showing error
            await new Promise((resolve) => setTimeout(resolve, 2000));
            alert(error.message || "Account creation failed.");
        } finally {
            setLoading(false)
        }
    };

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
                                    Create Admin Account
                                </h2>
                                <p className="text-slate-500  text-xs font-normal leading-normal mt-2">
                                    Sign up to get started.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="email"
                                    className="text-slate-700 text-xs font-medium">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@aisystems.blog"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 placeholder:text-xs"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <label
                                        htmlFor="password"
                                        className="text-slate-700 text-xs font-medium"
                                    >
                                        Password
                                    </label>
                                </div>

                                <div className="relative flex items-stretch">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 placeholder:text-xs"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        aria-label="Toggle password visibility"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-900"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>

                                </div>

                                <p className="text-xs text-slate-500">
                                    Must be at least 12 characters with symbols.
                                </p>

                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-5 bg-primary text-white text-base font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
                                    ${loading
                                        ? "opacity-70 cursor-not-allowed"
                                        : "hover:opacity-90 active:scale-[0.98]"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner />
                                        <span>Signing Up...</span>
                                    </div>
                                ) : (
                                    <span>Sign Up</span>
                                )}
                            </button>

                        </form>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 "></div>
                            </div>

                            <div className="relative flex justify-center text-xs uppercase">

                                <span className="bg-white  px-2 text-slate-500">
                                    Secure Signup
                                </span>

                            </div>

                        </div>

                        {/* Footer */}
                        <div className="text-center">
                            <p className="text-slate-600 text-xs">
                                Already have an account?
                                <a
                                    className="text-primary font-semibold hover:underline ml-1"
                                    href="/login"
                                >
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Register