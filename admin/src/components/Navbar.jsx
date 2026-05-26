import { useEffect, useState } from "react"
import { LayoutDashboard, BookOpen, PenSquare, LogOut } from "lucide-react"
import { endpoint } from "../api"
import api from "../interceptor"
import { Link, useNavigate } from "react-router-dom"

function Navbar() {
    const navigate = useNavigate()
    const [canPublish, setCanPublish] = useState(true)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const fetchProfileStatus = async () => {
            try {
                const response = await api.get(
                    `${endpoint}/article/admin/dashboard`,
                    { withCredentials: true }
                )
                setCanPublish(response.data.profile.canPublish)
            } catch (error) {
                console.error(error)
            }
        }
        fetchProfileStatus()
    }, [])

    const handleLogout = async () => {
        try {
            const response = await api.post(
                `${endpoint}/auth/admin/logout`,
                {},
                { withCredentials: true }
            )

            if (response.status === 200) {
                document.cookie = "userSession=; Max-Age=0; path=/;"
                alert("You have logged out.")
                navigate("/login")
            } else {
                alert("You are not logged in.")
            }
        } catch (error) {
            console.error("Logout error:", error)
            alert("You are not logged in.")
        }
    }

    const closeMenu = () => setOpen(false)

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <nav className="max-w-content mx-auto px-6 h-20 flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="https://publication-site.s3.eu-north-1.amazonaws.com/site_images/favicon.png"
                            alt="Skirill Logo"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-lg font-extrabold text-emerald-900 tracking-tight">
                            Skirill
                        </span>
                    </a>

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">

                        <Link to="/home" className="hover:text-emerald-700 transition">
                            Dashboard
                        </Link>

                        <Link to="/articles" className="hover:text-emerald-700 transition">
                            Articles
                        </Link>

                        {canPublish ? (
                            <Link to="/articles/new" className="hover:text-emerald-700 transition">
                                New Article
                            </Link>
                        ) : (
                            <button
                                disabled
                                title="Complete your profile before publishing."
                                className="text-slate-400 cursor-not-allowed"
                            >
                                New Article
                            </button>
                        )}

                        <Link to="/profile" className="hover:text-emerald-700 transition">
                            Profile
                        </Link>
                    </div>
                </div>

                {/* RIGHT DESKTOP */}
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-xs text-slate-500">Admin</span>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-md hover:bg-emerald-900 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                {/* MOBILE BURGER */}
                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    <div className="relative w-5 h-5">

                        {/* Hamburger */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out ${open ? "opacity-0 rotate-90 scale-75" : "opacity-100"
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>

                        {/* X */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out ${open ? "opacity-100" : "opacity-0 -rotate-90 scale-75"
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </button>
            </nav>

            {/* MOBILE MENU */}
            <div
                className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-lg transition-all duration-300 ease-in-out ${open
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col px-6 py-4 gap-4 text-sm text-slate-700">

                    <Link to="/home" onClick={closeMenu}>
                        Dashboard
                    </Link>

                    <Link to="/articles" onClick={closeMenu}>
                        Articles
                    </Link>

                    {canPublish ? (
                        <Link to="/articles/new" onClick={closeMenu}>
                            New Article
                        </Link>
                    ) : (
                        <span className="text-slate-400 cursor-not-allowed">
                            New Article
                        </span>
                    )}

                    <Link to="/profile" onClick={closeMenu}>
                        Profile
                    </Link>

                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">

                        <span className="text-xs text-slate-500">Admin</span>

                        <button
                            onClick={() => {
                                closeMenu()
                                handleLogout()
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-md hover:bg-emerald-900"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar