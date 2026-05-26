import {Link} from "react-router-dom"

function LoginNav() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <nav className="max-w-content mx-auto px-6 h-20 flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-8">

                    {/* Logo */}
                    <a
                        className="text-lg font-extrabold text-emerald-900 tracking-tight"
                        href="https://skiril.org"
                    >
                        Skiril
                    </a>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">

                        <Link
                            to="https://skiril.org"
                            className="flex items-center gap-2 hover:text-emerald-700 transition-base"
                        >

                            Home
                        </Link>

                        <Link
                            to="/login"
                            className="flex items-center gap-2 hover:text-emerald-700 transition-base"
                        >

                            Articles
                        </Link>



                        <Link
                            to="/login"
                            className="flex items-center gap-2 hover:text-emerald-700 transition-base"
                        >
                            New Article
                        </Link>
                    </div>
                </div>

            </nav>
        </header>
    )
}

export default LoginNav