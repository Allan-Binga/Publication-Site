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
            {/* Hero Section */}
            <section className="py-20 lg:py-32 px-6" data-purpose="hero">
                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-2xl lg:text-4xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8">
                        AI, DevOps, Data Engineering, and Machine Learning —{" "}
                        <span className="text-emerald-700">Explained.</span>
                    </h1>

                    <p className="text-lg text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Deep dives into modern AI systems, scalable infrastructure, cloud-native DevOps,
                        resilient backend architectures, and production-grade machine learning systems.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/articles" className="w-full sm:w-auto px-8 py-4 bg-emerald-800 text-white font-bold rounded-sm hover:bg-emerald-900 transition-base">
                            Explore Publications
                        </Link>

                    </div>

                </div>
            </section>

            {/*Categories Section*/}
            <section className="py-20 bg-slate-50/50 border-y border-slate-50" data-purpose="topics">
                <div className="max-w-content mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* <!-- Card 1 --> */}
                        <div className="bg-white p-8 rounded-sm  border border-slate-200  transition-base">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center rounded-sm mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Data Engineering</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Scalable architecture for ETL, data lakes, and real-time processing.</p>
                        </div>
                        {/* <!-- Card 2 --> */}
                        <div className="bg-white p-8 rounded-sm  border border-slate-200  transition-base">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center rounded-sm mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">AI</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Exploring large language models and cognitive computing patterns.</p>
                        </div>
                        {/* <!-- Card 3 --> */}
                        <div className="bg-white p-8 rounded-sm  border border-slate-200  transition-base">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center rounded-sm mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">ML Systems</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Design principles for production-grade machine learning systems.</p>
                        </div>
                        {/* Card 4 */}
                        <div className="bg-white p-8 rounded-sm  border border-slate-200  transition-base">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center rounded-sm mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M19.428 15.341A8 8 0 118 4.572M12 2v10l3 3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                DevOps
                            </h3>

                            <p className="text-slate-600 text-sm leading-relaxed">
                                CI/CD pipelines, cloud infrastructure, containerization, and system reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Articles */}
            <section className="py-20 px-6" data-purpose="latest-articles">
                <div className="max-w-content mx-auto">

                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Latest Articles
                            </h2>
                            <p className="text-slate-600 mt-2 text-sm">
                                New insights published weekly
                            </p>
                        </div>

                        <RouterLink
                            to="/articles"
                            className="text-emerald-700 text-sm font-semibold hover:underline hidden sm:block"
                        >
                            View all posts →
                        </RouterLink>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {dashboard?.latestArticles?.map((article) => (
                            <RouterLink
                                to={`/articles/article/${article.id}`}
                                key={article.id}
                                className="group cursor-pointer">

                                <div className="aspect-video bg-slate-100 rounded-sm mb-6 overflow-hidden">
                                    <img
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-base"
                                        src={article.cover_image || "/placeholder.jpg"}
                                    />
                                </div>

                                <span className="inline-block px-3 py-1 bg-lime-100 text-emerald-900 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                    {article.category}
                                </span>


                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-base leading-snug">
                                    {article.title}
                                </h3>

                                <p className="text-slate-600 mt-3 line-clamp-2 text-sm">
                                    {article.excerpt}
                                </p>
                                <p className="text-slate-600 text-xs mt-4">
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

            {/* Author Section */}
            <section className="py-20 px-6 bg-slate-50" data-purpose="author-profile">
                <div className="max-w-content mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        {/* <!-- Column 1: Image --> */}
                        <div className="w-full md:w-1/3">
                            <div className="aspect-square rounded-sm overflow-hidden shadow-xl">
                                <img alt="Sam Odongo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkGP_jkviySbMzfmKzUeT1c3dclZ27963vUsPr8vU2sQi4ELG0RuM8ZAXJPFgU3hQT0OyK0lMIxP_n515tlEuu3eblpl_q45w8Q6QboPRCquvX8QqQa7XGr7BA5l1_DXK3tsZkcPPsMeOylRmeS3_swUusrPcNlcLBSaAd29p04HfUm2OvC5e9xjP1YpLheNSetqim0kAzCmxIHPUvm29U8cYTwQBYRsf56-dQ1xthPoEQoBYiv1liAYodaMjXWyR28yJJEr1z0EQ2" />
                            </div>
                        </div>
                        {/* <!-- Column 2: Content --> */}
                        <div className="w-full md:w-2/3">
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Sam Odongo</h2>
                            <p className="text-md text-slate-600 mb-6 leading-relaxed">
                                I'm a Data Engineer and AI researcher focused on building efficient infrastructure for large-scale machine learning. I spend my time exploring the intersection of distributed systems and cognitive computing.
                            </p>
                            <div className="flex gap-4">
                                <a className="text-slate-400 hover:text-emerald-700 transition-base" href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                                </a>
                                <a className="text-slate-400 hover:text-emerald-700 transition-base" href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                                </a>
                                <a className="text-slate-400 hover:text-emerald-700 transition-base" href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                                </a>
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