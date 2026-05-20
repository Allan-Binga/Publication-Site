import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { endpoint } from "../api";
import api from "../interceptor";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("All")
  const navigate = useNavigate()

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [category])

  // Fetch Articles
  const fetchArticles = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      params.append("page", currentPage)
      params.append("limit", 9)

      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch)
      }

      if (category !== "All") {
        params.append("category", category)
      }

      const response = await api.get(
        `${endpoint}/article/admin/articles?${params.toString()}`,
        { withCredentials: true }
      )

      setArticles(response.data.articles)
      setTotalPages(response.data.totalPages)

    } catch (error) {
      console.error(error)
      alert("Failed to fetch articles.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch effect
  useEffect(() => {
    fetchArticles()
  }, [currentPage, debouncedSearch, category])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* <!-- Header Section --> */}
        <header className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Articles
          </h1>
          <p className="text-md text-slate-600 max-w-2xl mb-8">
            Insights on AI systems, data engineering, and machine learning infrastructure.
          </p>
          <div className="w-full max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-xl"><Search /></span>
            </div>
            <input
              className="block w-full pl-10 pr-4 py-3 border border-slate-200 0 rounded-md bg-white focus:ring-2 placeholder:text-sm focus:ring-primary-focus focus:border-transparent outline-none transition-all"
              placeholder="Search articles..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* <!-- Filter Bar --> */}
        <nav className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setCategory("All")}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-colors
              ${category === "All"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setCategory("Docker")}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-colors
              ${category === "Docker"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            Docker
          </button>
          <button
            onClick={() => setCategory("Artificial Intelligence")}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-colors
              ${category === "Artificial Intelligence"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            AI
          </button>
          <button
            onClick={() => setCategory("Data Engineering")}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-colors
              ${category === "Data Engineering"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            Data Engineering
          </button>
          <button
            onClick={() => setCategory("Machine Learning Systems")}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-colors
              ${category === "Machine Learning Systems"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            Machine Learning
          </button>
          <button
            onClick={() => setCategory("MLOps")}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-colors
              ${category === "MLOps"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            MLOps
          </button>
          <button
            onClick={() => setCategory("Research")}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-colors
              ${category === "Research"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            Research
          </button>
        </nav>

        {/* <!-- Article Grid --> */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

          {loading ? (
            <p className="text-slate-500">Loading articles...</p>
          ) : articles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">

              {/* Blob / Illustration */}
              <div className="relative w-40 h-40 mb-6">
                <div className="absolute inset-0 bg-emerald-200/40 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute inset-6 bg-emerald-300/60 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute inset-12 bg-emerald-500/20 rounded-full"></div>
              </div>

              {/* Text */}
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No articles found
              </h3>

              <p className="text-slate-500 max-w-md">
                We couldn’t find anything matching your search. Try a different keyword or category.
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/article/${article.id}`}
                className="block group"
              >
                <article
                  className="flex flex-col bg-white rounded-lg overflow-hidden border border-slate-200 
               transition-all duration-300  group-hover:-translate-y-1"
                >
                  {/* Cover Image */}
                  <div className="aspect-video w-full bg-slate-200 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center 
                   transition-transform duration-500 ease-in-out 
                   group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${article.cover_image})`
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">

                    {/* Category + Date */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block max-w-[140px] px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-100 text-accent-badge uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                        {article.category}
                      </span>

                      <span className="text-xs text-slate-500">
                        {new Date(article.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-bold text-slate-900 mb-2 leading-tight 
                   transition-colors duration-300 group-hover:text-emerald-700"
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 text-xs">
                      {article.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <span className="text-emerald-700 font-semibold text-sm inline-flex items-center text-xs hover:underline">
                        Read article
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>

                  </div>
                </article>
              </Link>

            ))
          )}

        </section>

        {/* <!-- Pagination --> */}
        <nav className="flex items-center justify-center space-x-2 mb-20">
          {/* Previous */}
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors
              ${currentPage === 1
                ? "text-slate-300 cursor-not-allowed bg-white border-slate-200"
                : "text-slate-600 bg-white hover:bg-slate-50 border-slate-200"
              }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                ${currentPage === i + 1
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              {i + 1}
            </button>
          ))}


          {/* Next */}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors
              ${currentPage === totalPages
                ? "text-slate-300 cursor-not-allowed bg-white border-slate-200"
                : "text-slate-600 bg-white hover:bg-slate-50 border-slate-200"
              }`}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </nav>
      </main>
      <Footer />
    </div>
  )
}

export default Articles