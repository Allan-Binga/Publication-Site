import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link as RouterLink } from "react-router-dom"
import { endpoint } from "../api"

function Home() {
    const [dashboard, setDashboard] = useState(null)

    //Public Dashboard
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get(`${endpoint}/article/dashboard`)
                // console.log(response.data)
                setDashboard(response.data)
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                alert("Error fetching dashboard.")
            }
        }

        fetchDashboard()
    }, [])

    return (
        <div>
            <Navbar />

            {/* HERO SECTION */}
            <section
                className="py-16 sm:py-20 lg:py-32 px-6"
                data-purpose="hero"
            >
                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6 sm:mb-8">
                        AI, DevOps, Data Engineering, and Machine Learning —{" "}
                        <span className="text-emerald-700">Explained.</span>
                    </h1>

                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
                        Deep dives into modern AI systems, scalable infrastructure, cloud-native DevOps,
                        resilient backend architectures, and production-grade machine learning systems.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                        <Link
                            to="/articles"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-emerald-800 text-white font-bold rounded-sm hover:bg-emerald-900 transition-base"
                        >
                            Explore Publications
                        </Link>
                    </div>

                </div>
            </section>

            {/* CATEGORIES SECTION */}
            <section
                className="py-14 sm:py-20 bg-slate-50/50 border-y border-slate-100"
                data-purpose="topics"
            >
                <div className="max-w-content mx-auto px-4 sm:px-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                        {/* CARD TEMPLATE */}
                        {[
                            {
                                title: "Data Engineering",
                                desc: "Scalable architecture for ETL, data lakes, and real-time processing.",
                                icon: (
                                    <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                )
                            },
                            {
                                title: "AI",
                                desc: "Exploring large language models and cognitive computing patterns.",
                                icon: (
                                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                )
                            },
                            {
                                title: "ML Systems",
                                desc: "Design principles for production-grade machine learning systems.",
                                icon: (
                                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                )
                            },
                            {
                                title: "DevOps",
                                desc: "CI/CD pipelines, cloud infrastructure, containerization, and system reliability.",
                                icon: (
                                    <path d="M19.428 15.341A8 8 0 118 4.572M12 2v10l3 3" />
                                )
                            }
                        ].map((c, i) => (
                            <div
                                key={i}
                                className="bg-white p-6 sm:p-8 rounded-sm border border-slate-200 hover:shadow-sm transition-base"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center rounded-sm mb-4 sm:mb-6">
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {c.icon}
                                    </svg>
                                </div>

                                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                    {c.title}
                                </h3>

                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {c.desc}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* LATEST ARTICLES */}
            <section
                className="py-14 sm:py-20 px-4 sm:px-6"
                data-purpose="latest-articles"
            >
                <div className="max-w-content mx-auto">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">

                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                Latest Articles
                            </h2>
                            <p className="text-slate-600 mt-2 text-sm">
                                New insights published weekly
                            </p>
                        </div>

                        <RouterLink
                            to="/articles"
                            className="text-emerald-700 text-sm font-semibold hover:underline"
                        >
                            View all posts →
                        </RouterLink>

                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                        {dashboard?.latestArticles?.map((article) => (
                            <RouterLink
                                to={`/articles/article/${article.id}`}
                                key={article.id}
                                className="group cursor-pointer"
                            >

                                <div className="aspect-video bg-slate-100 rounded-sm mb-4 sm:mb-6 overflow-hidden">
                                    <img
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-base"
                                        src={article.cover_image || "/placeholder.jpg"}
                                    />
                                </div>

                                <span className="inline-block px-2 sm:px-3 py-1 bg-lime-100 text-emerald-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4">
                                    {article.category}
                                </span>

                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-base leading-snug">
                                    {article.title}
                                </h3>

                                <p className="text-slate-600 mt-2 sm:mt-3 text-sm line-clamp-2">
                                    {article.excerpt}
                                </p>

                                <p className="text-slate-500 text-xs mt-3 sm:mt-4">
                                    {new Date(article.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    })}
                                </p>

                            </RouterLink>
                        ))}

                    </div>
                </div>
            </section>

            {/* BRAND SECTION */}
            <section
                className="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50"
                data-purpose="brand-profile"
            >
                <div className="max-w-content mx-auto">

                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

                        {/* LOGO */}
                        <div className="w-full lg:w-1/3">
                            <div className="aspect-square rounded-sm overflow-hidden flex items-center justify-center p-6 sm:p-10">
                                <img
                                    alt="Skirill Logo"
                                    className="w-full h-full object-contain"
                                    src="https://publication-site.s3.eu-north-1.amazonaws.com/site_images/favicon.png"
                                />
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="w-full lg:w-2/3 text-center lg:text-left">

                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4">
                                Skirill
                            </h2>

                            <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
                                Skirill is a modern publication platform for technical writing, tutorials, and knowledge sharing.
                                We focus on clear, structured, and high-quality content across software engineering, systems, and AI.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                                <span>Built for developers</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Technical writing platform</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Knowledge hub</span>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Home