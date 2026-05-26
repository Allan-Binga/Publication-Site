import { Link } from "react-router-dom"

function LoginNav() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <nav className="max-w-content mx-auto px-6 h-20 flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-8">

                    {/* Logo */}

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

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">

                        <Link
                            to="https://skirill.org"
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