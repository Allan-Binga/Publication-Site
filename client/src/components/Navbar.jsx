import { Link } from "react-router-dom"

function Navbar() {
    return (
        <div>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <nav className="max-w-content mx-auto px-6 h-20 flex items-center justify-between">
                    {/* <! Navigation Links */}
                    <div className="flex items-center gap-8" data-purpose="nav-left">
                        <a className="text-lg font-extrabold text-emerald-900 tracking-tight" href="#">SO.</a>
                        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
                            <a className="hover:text-emerald-700 transition-base" href="/">Home</a>
                            <a className="hover:text-emerald-700 transition-base" href="/articles">Articles</a>
                            {/* <a className="hover:text-emerald-700 transition-base" href="/research">Research</a> */}
                            {/* <a className="hover:text-emerald-700 transition-base" href="#">Tutorials</a> */}
                            <a className="hover:text-emerald-700 transition-base" href="/about">About</a>
                        </div>
                    </div>
                    {/* <!-- Right: Action Buttons --> */}
                    <div className="flex items-center gap-3" data-purpose="nav-right">
                        <Link to="/" className="px-4 py-2 cursor-pointer border border-emerald-800 text-emerald-800 text-xs font-semibold rounded-sm hover:bg-emerald-50 transition-base">
                            Subscribe
                        </Link>
                        <Link to="/articles" className="px-4 py-2 cursor-pointer bg-emerald-800 text-white text-xs font-semibold rounded-sm hover:bg-emerald-900 shadow-sm transition-base">
                            Read Articles
                        </Link>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Navbar