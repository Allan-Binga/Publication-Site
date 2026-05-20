import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/Spinner"
import {
    Save,
    Send,
    FileText,
    Settings,
    Image,
    Upload,
    Eye, Check
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { endpoint } from "../api"
import api from "../interceptor"
import { Editor } from '@tinymce/tinymce-react'


function EditArticle() {
    const { id } = useParams()
    const [fetchedArticle, setFetchedArticle] = useState(true)
    const [coverImage, setCoverImage] = useState(null)
    const [activeTab, setActiveTab] = useState("gallery")
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        status: "",
        cover_image: ""
    })
    const [loading, isLoading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null)
    const navigate = useNavigate()
    const editorRef = useRef(null)
    const fileInputRef = useRef(null)

    //Fetched Article useEffect
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setFetchedArticle(true)

                const response = await api.get(`${endpoint}/article/article/${id}`, { withCredentials: true })

                const data = response.data.article;

                setFormData({
                    title: data.title || "",
                    slug: data.slug || "",
                    excerpt: data.excerpt || "",
                    content: data.content || "",
                    category: data.category || "",
                    status: data.status || "",
                    cover_image: data.cover_image || ""
                })

                //Cover Image from AWS
                setCoverImage(data.cover_image)


            } catch (error) {
                console.error(error)
                console.log(error)
            } finally {
                setFetchedArticle(false)
            }
        }
        fetchArticle()
    }, [id])

    //S3 Images
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

    //Title Change
    const handleTitleChange = (e) => {
        const value = e.target.value

        setFormData(prev => ({
            ...prev,
            title: value,
            slug: generateSlug(value)
        }))
    }

    //Edit Article
    const handleSubmit = async (statusType) => {
        try {
            isLoading(true)

            const payload = new FormData()

            payload.append("title", formData.title)
            payload.append("excerpt", formData.excerpt)
            payload.append("content", formData.content)
            payload.append("category", formData.category)
            payload.append("status", statusType)

            if (uploadedFile) {
                payload.append("cover_image", uploadedFile)
            } else if (formData.cover_image) {
                payload.append("cover_image", formData.cover_image)
            }

            const res = await api.patch(
                `${endpoint}/article/admin/edit/${id}`,
                payload,
                { withCredentials: true }
            )
            alert("Article saved successfully.")
            navigate(`/articles/article/${id}`)

        } catch (err) {
            alert("Failed to publish article.")
            console.error(err)
            // console.log(err)
        } finally {
            isLoading(false)
        }
    }

    //Image Upload Handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0]

        if (!file) return

        // Store actual file
        setUploadedFile(file)

        // Temporary browser preview only
        const imageUrl = URL.createObjectURL(file)

        setCoverImage(imageUrl)
    }

    //Loading State
    if (fetchedArticle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading article...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">

                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                Edit Article
                            </h1>
                            <p className="text-slate-600 text-base">
                                Edit your article or save and pick up later.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={() => handleSubmit("draft")} className="flex items-center gap-2 px-4 py-2.5 border-2 border-emerald-800 text-emerald-800 font-semibold rounded-sm hover:bg-emerald-50 transition cursor-pointer">
                                {loading ? <Spinner /> : <Save size={18} />}
                                {loading ? "Saving..." : "Save Draft"}
                            </button>

                            <button onClick={() => handleSubmit("published")} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 text-white font-semibold rounded-sm shadow hover:bg-emerald-900 transition cursor-pointer">
                                {loading ? <Spinner /> : <Send size={18} />}
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">

                        {/* LEFT COLUMN */}
                        <div className="space-y-6 order-2 lg:order-1">

                            <div className="bg-white rounded-lg border border-slate-300 overflow-hidden">

                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">

                                    <div className="flex items-center gap-2">
                                        <FileText className="text-emerald-800" size={18} />
                                        <h2 className="font-bold text-lg text-slate-800">
                                            Article Content
                                        </h2>
                                    </div>
                                </div>
                                <div className="p-0">
                                    <Editor
                                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                                        licenseKey="gpl"
                                        onInit={(_evt, editor) => (editorRef.current = editor)}
                                        value={formData.content}
                                        onEditorChange={(content) =>
                                            setFormData((prev) => ({ ...prev, content }))
                                        }
                                        init={{
                                            height: 600,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'preview', 'wordcount', 'codesample'
                                            ],
                                            toolbar:
                                                'undo redo | blocks fontfamily fontsize | ' +
                                                'bold italic underline strikethrough forecolor backcolor | ' +
                                                'alignleft aligncenter alignright alignjustify | ' +
                                                'bullist numlist outdent indent | ' +
                                                'table link image media codesample | ' +
                                                'removeformat code preview',
                                            content_style:
                                                'body { font-family:Inter, sans-serif; font-size:16px; } pre { background:#0f172a; color:white; padding:12px; border-radius:8px; }',
                                            placeholder: "Start typing your technical content here..."
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="space-y-6 order-1 lg:order-2">
                            {/* Article Details */}
                            <section className="bg-white rounded-lg border border-slate-300 p-6">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Settings className="text-emerald-800" size={18} />
                                    Article Details
                                </h3>
                                <div className="space-y-4">

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Article Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={handleTitleChange}
                                            placeholder="e.g. Scaling Vector Databases"
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                        />
                                    </div>

                                    {/* Slug */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Slug
                                        </label>

                                        <input
                                            readOnly
                                            value={formData.slug}
                                            className="w-full rounded-lg border border-slate-200 bg-slate-200 text-slate-500 px-4 py-3 text-sm cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Category
                                        </label>

                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                        >
                                            <option>Artificial Intelligence</option>
                                            <option>Data Engineering</option>
                                            <option>Machine Learning Systems</option>
                                            <option>MLOps</option>
                                            <option>Data Analytics</option>
                                            <option>Statistical Analysis</option>
                                            <option>Deep Learning</option>
                                            <option>Natural Language Processing</option>
                                            <option>Computer Vision</option>
                                            <option>Big Data Technologies</option>
                                            <option>DevOps</option>
                                            <option>IaC</option>
                                        </select>
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Excerpt
                                        </label>

                                        {/* Helper text */}
                                        <p className="text-xs text-slate-500 mb-2">
                                            A short preview of your article shown in listings.
                                            <span className="italic">Example:</span> “Learn how vector databases scale to billions of embeddings in production.”
                                        </p>

                                        <textarea
                                            rows="3"
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            placeholder="Write a 1–2 sentence summary of your article..."
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                        />
                                    </div>

                                </div>
                            </section>

                            {/* Cover Image */}
                            <section className="bg-white rounded-lg border border-slate-300 p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Image size={18} />
                                    Cover Image
                                </h3>

                                {/* Tabs */}
                                <div className="flex mb-4 bg-slate-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab("gallery")}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${activeTab === "gallery"
                                            ? "bg-white shadow text-slate-900"
                                            : "text-slate-500"
                                            }`}
                                    >
                                        Gallery
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("upload")}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${activeTab === "upload"
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
                                                    onClick={() => {
                                                        setCoverImage(img)
                                                        setFormData({ ...formData, cover_image: img })
                                                    }}
                                                    className={`relative cursor-pointer rounded-lg overflow-hidden aspect-video group border ${isSelected
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
                                                    <div className={`absolute inset-0 transition ${isSelected
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
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 transition"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            className="hidden" />
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default EditArticle
