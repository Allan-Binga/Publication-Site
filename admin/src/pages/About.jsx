import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Database, Warehouse, Brain, Settings, Telescope, Cloud, BadgeCheck } from "lucide-react"

function About() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light text-slate-900 font-display">
            <Navbar />
            <main className="flex-grow max-w-6xl mx-auto px-6 py-20 space-y-32">
                {/* Header */}
                <section className="text-center space-y-6">
                    <h1 className="text-2xl md:text-5xl font-extrabold text-gray-900 tracking-tight">About This Site</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        A technical blog exploring AI systems, machine learning infrastructure, and modern data engineering.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-emerald-700 to-lime-500 mx-auto rounded-full"></div>
                </section>

                {/* Mission */}
                <section className="grid md:grid-cols-12 gap-12 items-start border-t border-gray-100 pt-16">
                    <div className="md:col-span-4">
                        <h2 className="text-xl font-bold text-emerald-800 uppercase tracking-narrow text-sm">
                            Our Mission
                        </h2>
                        <p className="mt-4 text-2xl font-bold text-gray-900">
                            Bridging the gap between research and production.
                        </p>
                    </div>
                    <div className="md:col-span-8 space-y-6 text-md text-gray-600 leading-relaxed">
                        <p>
                            The transition from a notebook prototype to a scalable production system is where most AI initiatives face their greatest challenges. This blog focuses on the complexities of production systems—how to move beyond the model and build the scaffolding that makes AI actually work in the real world.
                        </p>
                        <p>
                            We dive deep into building robust data pipelines that ensure data quality at scale, and designing architectures that can handle the massive throughput required by modern deep learning applications. Our goal is to provide engineers with the tactical knowledge needed to navigate the evolving landscape of MLOps and cloud infrastructure.
                        </p>
                    </div>
                </section>

                {/* Topics */}
                <section className="space-y-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Topics Covered</h2>
                        <p className="text-gray-600 mt-2 text-md">Deep dives into the modern stack</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* <!-- Topic Card --> */}
                        <div className="bg-white p-8 rounded-sm border border-gray-200 transition-shadow group">
                            <span className="material-symbols-outlined text-emerald-700 text-4xl group-hover:scale-110 transition-transform"><Warehouse /></span>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">AI Systems</h3>
                            <p className="mt-2 text-sm text-gray-600">Architectural patterns for LLM agents, vector databases, and retrieval-augmented generation.</p>
                        </div>
                        {/* <!-- Topic Card --> */}
                        <div className="bg-white p-8 rounded-sm border border-gray-200 transition-shadow group">
                            <span className="material-symbols-outlined text-emerald-700 text-4xl group-hover:scale-110 transition-transform"><Database /></span>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">
                                Data Engineering
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">ETL/ELT patterns, stream processing with Flink/Kafka, and data mesh implementations.</p>
                        </div>
                        {/* <!-- Topic Card --> */}
                        <div className="bg-white p-8 rounded-sm border border-gray-200 transition-shadow group">
                            <span className="material-symbols-outlined text-emerald-700 text-4xl group-hover:scale-110 transition-transform"><Brain /></span>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">
                                Machine Learning
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">Model fine-tuning strategies, evaluation frameworks, and efficient inference optimization.</p>
                        </div>
                        {/* <!-- Topic Card --> */}
                        <div className="bg-white p-8 rounded-sm border border-gray-200 transition-shadow group">
                            <span className="material-symbols-outlined text-emerald-700 text-4xl group-hover:scale-110 transition-transform"><Settings /></span>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">MLOps</h3>
                            <p className="mt-2 text-sm text-gray-600">CI/CD for ML, automated retraining loops, and monitoring model drift in production.</p>
                        </div>
                        {/* <!-- Topic Card --> */}
                        <div className="bg-white p-8 rounded-sm border border-gray-200 transition-shadow group">
                            <span className="material-symbols-outlined text-emerald-700 text-4xl group-hover:scale-110 transition-transform"><Telescope /></span>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">
                                Research Insights
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Breaking down new whitepapers and translating academic breakthroughs into engineering tasks.
                            </p>
                        </div>
                        {/* <!-- Topic Card --> */}
                        <div className="bg-white p-8 rounded-sm border border-gray-200 transition-shadow group">
                            <span className="material-symbols-outlined text-emerald-700 text-4xl group-hover:scale-110 transition-transform"><Cloud /></span>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">Cloud Infrastructure</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Kubernetes orchestration for GPU workloads and serverless AI deployment strategies.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Philosophy */}
                <section className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">How This Blog Works</h2>
                        <p className="text-gray-600 mt-2 text-sm">
                            Our editorial philosophy and engineering standards
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-lg">
                            <span className="material-symbols-outlined text-emerald-600 font-bold"><BadgeCheck /></span>
                            <div>
                                <h4 className="font-bold text-gray-900">Practicality Over Hype</h4>
                                <p className="text-gray-600 text-sm">We prioritize engineering techniques that have been battle-tested in production environments rather than chasing every new benchmark.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-lg">
                            <span className="material-symbols-outlined text-emerald-600 font-bold"><BadgeCheck /></span>
                            <div>
                                <h4 className="font-bold text-gray-900">Open Source First</h4>
                                <p className="text-gray-600 text-sm">
                                    Our examples and tutorials leverage open-source tools like
                                    Spark, PyTorch, and Terraform to ensure accessibility and vendor
                                    neutrality.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-lg">
                            <span className="material-symbols-outlined text-emerald-600 font-bold"><BadgeCheck /></span>
                            <div>
                                <h4 className="font-bold text-gray-900">Reproducible Research</h4>
                                <p className="text-gray-600 text-sm">
                                    Every technical deep dive includes code snippets or links to
                                    repositories to ensure you can replicate the results yourself.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-lg">
                            <span className="material-symbols-outlined text-emerald-600 font-bold"><BadgeCheck /></span>
                            <div>
                                <h4 className="font-bold text-gray-900">
                                    Quality Data as Foundation
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    We believe that no amount of model tuning can fix bad data. Data engineering is treated as a first-class citizen of the AI lifecycle.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default About;