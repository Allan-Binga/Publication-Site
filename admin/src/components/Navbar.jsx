import { LayoutDashboard, BookOpen, PenSquare, LogOut } from "lucide-react"
import { endpoint } from "../api"
import api from "../interceptor"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Navbar() {
    const navigate = useNavigate()
    const [canPublish, setCanPublish] = useState(true)

    useEffect(() => {
        const fetchProfileStatus = async () => {
            try {
                const response = await api.get(`${endpoint}/article/admin/dashboard`, { withCredentials: true })
                // console.log(response)
                setCanPublish(response.data.profile.canPublish)
            } catch (error) {
                console.error(error)
            }
        }
        fetchProfileStatus()
    }, [])

    //Handle Logout
    const handleLogout = async () => {
        try {
            const response = await api.post(`${endpoint}/auth/admin/logout`, {}, { withCredentials: true })
            if (response.status === 200) {
                document.cookie = "userSession=; Max-Age=0; path=/;";
                alert("You have logged out.")
                navigate("/login")
            } else {
                alert("You are not logged in.")
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("You are not logged in.");
        }
    }
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <nav className="max-w-content mx-auto px-6 h-20 flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-8">

                    {/* Logo */}
                    <a
                        className="text-lg font-extrabold text-emerald-900 tracking-tight"
                        href="/home"
                    >
                        SO.
                    </a>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">

                        <Link
                            to="/home"
                            className="flex items-center gap-2 hover:text-emerald-700 transition-base"
                        >

                            Dashboard
                        </Link>

                        <Link
                            to="/articles"
                            className="flex items-center gap-2 hover:text-emerald-700 transition-base"
                        >

                            Articles
                        </Link>

                        {canPublish ? (

                            <Link
                                to="/articles/new"
                                className="flex items-center gap-2 hover:text-emerald-700 transition-base"
                            >
                                New Article
                            </Link>

                        ) : (

                            <button
                                disabled
                                title="Complete your profile before publishing."
                                className="flex items-center gap-2 text-slate-400 cursor-not-allowed"
                            >
                                New Article
                            </button>

                        )}
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 hover:text-emerald-700 transition-base"
                        >

                            Profile
                        </Link>

                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">

                    {/* Admin Label */}
                    <span className="hidden sm:block text-xs text-slate-500">
                        Admin
                    </span>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-emerald-800 text-white text-xs font-semibold rounded-md hover:bg-emerald-900 shadow-sm transition-base">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>

                </div>

            </nav>
        </header>
    )
}

export default Navbar