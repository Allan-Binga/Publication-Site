function Hero() {
    <div>
        {/* Hero Section */}
        <section className="py-20 lg:py-32 px-6" data-purpose="hero">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8">
                    AI, Data Engineering, and Machine Learning — <span className="text-emerald-700">Explained.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Deep dives into modern AI systems, robust data pipelines, and scalable machine learning infrastructure for the next generation of software.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-4 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-base shadow-lg shadow-emerald-900/10">
                        Explore Documentation
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-base">
                        Latest Research
                    </button>
                </div>
            </div>
        </section>

    </div>
}

export default Hero