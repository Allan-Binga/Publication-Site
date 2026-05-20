function Footer() {
    return (
        <div>
            <footer className="py-12 border-t border-slate-100" data-purpose="footer">
                <div className="max-w-content mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 text-xs">© 2024 Sam Odongo. All rights reserved.</p>
                        <div className="flex items-center gap-8">
                            <a className="text-slate-500 hover:text-emerald-700 text-xs transition-base" href="/articles">Articles</a>
                            {/* <a className="text-slate-500 hover:text-emerald-700 text-xs transition-base" href="#">Tutorials</a> */}
                            {/* <a className="text-slate-500 hover:text-emerald-700 text-xs transition-base" href="#">Research</a> */}
                            {/* <a className="text-slate-500 hover:text-emerald-700 text-xs transition-base" href="#">Newsletter</a> */}
                            <a className="text-slate-500 hover:text-emerald-700 text-xs transition-base" href="/about">About</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer