import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
    Save,
    Send,
    FileText,
    Settings,
    Image,
    Upload,
    Eye,
    Check
} from "lucide-react"
import { useState } from "react"

function NewArticle() {
    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [coverImage, setCoverImage] = useState(null)
    const [activeTab, setActiveTab] = useState("gallery")

    // 🔹 Your S3 Images
    const galleryImages = [
        "https://publication-site.s3.eu-north-1.amazonaws.com/site_images/article6.png",
        "https://publication-site.s3.eu-north-1.amazonaws.com/site_images/article5.png",
        "https://publication-site.s3.eu-north-1.amazonaws.com/site_images/article4.png",
        "https://publication-site.s3.eu-north-1.amazonaws.com/site_images/article3.png",
        "https://publication-site.s3.eu-north-1.amazonaws.com/site_images/article2.png",
        "https://publication-site.s3.eu-north-1.amazonaws.com/site_images/article1.png",
    ]

    //Slugify Function
    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
    }

    const handleTitleChange = (e) => {
        const value = e.target.value
        setTitle(value)
        setSlug(generateSlug(value))
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">

                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">
                                Create New Article
                            </h1>
                            <p className="text-slate-600">
                                Draft your latest technical insights.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-emerald-800 text-emerald-800 font-semibold rounded-xl hover:bg-emerald-50 transition">
                                <Save size={18} />
                                Save Draft
                            </button>

                            <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 text-white font-semibold rounded-xl shadow hover:bg-emerald-900 transition">
                                <Send size={18} />
                                Publish
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* CONTENT */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b bg-slate-50 flex items-center gap-2">
                                    <FileText className="text-emerald-800" size={18} />
                                    <h2 className="font-bold text-lg text-slate-800">
                                        Article Content
                                    </h2>
                                </div>

                                <textarea
                                    className="w-full min-h-[600px] p-6 text-slate-700 focus:outline-none text-lg"
                                    placeholder="Start typing..."
                                />
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="space-y-6">

                            {/* DETAILS */}
                            <section className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Settings size={18} />
                                    Article Details
                                </h3>

                                <div className="space-y-4">

                                    <input
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder="Article Title"
                                        className="w-full px-4 py-3 border rounded-xl"
                                    />

                                    <input
                                        readOnly
                                        value={slug}
                                        className="w-full px-4 py-3 border rounded-xl bg-slate-100"
                                    />

                                </div>
                            </section>

                            {/* 🔥 COVER IMAGE (REDESIGNED) */}
                            <section className="bg-white rounded-xl shadow-sm border p-6">

                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Image size={18} />
                                    Cover Image
                                </h3>

                                {/* Tabs */}
                                <div className="flex mb-4 bg-slate-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab("gallery")}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                                            activeTab === "gallery"
                                                ? "bg-white shadow text-slate-900"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        Gallery
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("upload")}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                                            activeTab === "upload"
                                                ? "bg-white shadow text-slate-900"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        Upload
                                    </button>
                                </div>

                                {/* Gallery */}
                                {activeTab === "gallery" && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {galleryImages.map((img, index) => {
                                            const isSelected = coverImage === img

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => setCoverImage(img)}
                                                    className={`relative cursor-pointer rounded-lg overflow-hidden aspect-video group border ${
                                                        isSelected
                                                            ? "border-emerald-600 ring-2 ring-emerald-500"
                                                            : "border-slate-200"
                                                    }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt=""
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />

                                                    {/* Overlay */}
                                                    <div className={`absolute inset-0 transition ${
                                                        isSelected
                                                            ? "bg-emerald-900/40"
                                                            : "bg-black/0 group-hover:bg-black/20"
                                                    }`} />

                                                    {/* Check */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                                                            <Check size={16} className="text-emerald-700" />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Upload */}
                                {activeTab === "upload" && (
                                    <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition">
                                        <Upload className="mx-auto mb-2 text-emerald-700" />
                                        <p className="text-sm font-medium">
                                            Click to upload
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            PNG, JPG, WebP
                                        </p>
                                    </div>
                                )}

                                {/* Preview */}
                                {coverImage && (
                                    <div className="mt-4">
                                        <p className="text-xs text-slate-500 mb-2">
                                            Selected Image
                                        </p>
                                        <img
                                            src={coverImage}
                                            className="rounded-lg aspect-video object-cover"
                                        />
                                    </div>
                                )}
                            </section>

                            {/* PUBLISH */}
                            <section className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Eye size={18} />
                                    Publishing
                                </h3>

                                <label className="flex justify-between items-center">
                                    <span className="text-sm font-semibold">
                                        Published
                                    </span>
                                    <input type="checkbox" />
                                </label>
                            </section>

                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default NewArticle