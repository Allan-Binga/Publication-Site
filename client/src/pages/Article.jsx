import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { AtSign, Clock4, Link, Share2, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { endpoint } from "../api";
import axios from "axios";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";

function Article() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [relatedArticles, setRelatedArticles] = useState([])

    //Single Article useEffect
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`${endpoint}/article/public/article/${id}`)
                // console.log(response.data)
                setArticle(response.data.article)
                setRelatedArticles(response.data.relatedArticles)
            } catch (error) {
                console.log(error)
                console.error("Error fetching article:", error);
                alert("Error fetching article.")
            }
        }
        fetchArticle()
    }, [id])

    // Loading State
    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600 text-lg">Loading article...</p>
            </div>
        )
    }


    return (
        <div className="min-h-screen flex flex-col bg-background-light text-slate-900 font-display">
            <Navbar />
            <main className="flex-grow py-10 px-6">
                {/* Article Header */}
                <header className="max-w-4xl mx-auto mb-10">
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {article.category}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 text-xs">
                            {new Date(article.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </span>

                    </div>

                    <div className="flex items-start justify-between gap-6">
                        {/* Title block */}
                        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            {article.title}
                        </h1>
                    </div>

                    <div className="mt-6 flex items-center gap-4 text-slate-600">

                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">

                                <img
                                    alt={article.display_name}
                                    className="w-full h-full object-cover"
                                    src={article.profile_photo}
                                />

                            </div>

                            <span className="font-medium text-slate-900 text-sm">
                                {article.display_name}
                            </span>

                        </div>


                        <span className="text-slate-300">|</span>

                        <div className="flex items-center gap-1">
                            <span className="text-sm italic">
                                8 min read
                            </span>
                        </div>


                    </div>

                </header>

                {/* Featured Image */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                        <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Article Content */}
                <article className="max-w-4xl mx-auto">
                    <div
                        className="
                            prose
                            prose-lg
                            max-w-none
                            prose-headings:text-slate-900
                            prose-p:text-slate-700
                            prose-strong:text-slate-900
                            prose-code:text-emerald-700
                            prose-pre:bg-slate-900
                            prose-pre:text-slate-100
                            prose-blockquote:border-emerald-700
                        "
                        dangerouslySetInnerHTML={{
                            __html: article.content
                        }}
                    />

                    {/* Engagement & Tags */}
                    <div className="mt-16 pt-8 border-t border-slate-200">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                            <div className="flex flex-wrap gap-2">

                                <span className="bg-lime-100 text-lime-800 px-3 py-1 rounded text-xs font-medium">
                                    #{article.category}
                                </span>

                            </div>

                            <div className="flex items-center gap-4">

                                <span className="text-slate-500 text-sm font-medium">
                                    Share:
                                </span>

                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-800 hover:text-white transition-colors">

                                    <Share2 className="w-5 h-5" />

                                </button>

                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-800 hover:text-white transition-colors">

                                    <AtSign className="w-5 h-5" />

                                </button>

                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-800 hover:text-white transition-colors">

                                    <Link className="w-5 h-5" />

                                </button>

                            </div>

                        </div>

                    </div>

                </article>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (

                    <section className="max-w-6xl mx-auto mt-24">

                        <div className="flex items-center justify-between mb-10">

                            <h2 className="text-2xl font-bold text-slate-900">
                                Related Articles
                            </h2>

                            <RouterLink
                                to={"/articles"}
                                className="text-emerald-800 font-semibold flex items-center gap-1 hover:underline text-xs">

                                View All
                                <ArrowRight className="w-4 h-4 text-slate-600" />

                            </RouterLink>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {relatedArticles.map((related) => (

                                <RouterLink
                                    to={`/articles/article/${related.id}`}
                                    key={related.id}
                                    className="group cursor-pointer"
                                >

                                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 mb-4 bg-slate-100">

                                        <img
                                            alt={related.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            src={related.cover_image}
                                        />

                                    </div>

                                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">
                                        {related.category}
                                    </span>

                                    <h3 className="text-lg font-bold mt-2 group-hover:text-emerald-800 transition-colors">
                                        {related.title}
                                    </h3>

                                    <p className="text-slate-500 text-xs mt-3">
                                        {new Date(related.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </p>
                                </RouterLink>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    )
}

export default Article;