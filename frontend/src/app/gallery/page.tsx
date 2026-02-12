"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

const categories = ["All", "Campus", "Sports", "Events", "Academic"]
const images = [
    { src: "/images/school-img3.jpeg", category: "Campus", title: "Main Building" },
    { src: "/images/about-bg.jpg", category: "Academic", title: "Students in Lab" },
    // Add more mock images if needed
]

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState("All")

    const filteredImages = activeTab === "All" ? images : images.filter(img => img.category === activeTab)

    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <section className="bg-primary py-20 px-6 text-center">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">School <span className="text-gold-500">Gallery</span></h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">Capturing moments of growth, joy, and excellence at SKP School.</p>
                </div>
            </section>

            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === cat
                                    ? "bg-gold-500 text-primary shadow-lg shadow-gold-500/20"
                                    : "bg-white text-slate-400 hover:text-primary border border-slate-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredImages.map((img, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            key={i}
                            className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all"
                        >
                            <Image
                                src={img.src}
                                alt={img.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                                <span className="text-gold-500 text-xs font-black uppercase tracking-widest">{img.category}</span>
                                <h3 className="text-white font-heading font-bold text-xl">{img.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}
