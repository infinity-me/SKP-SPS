"use client"

import { useState, useEffect } from "react"
import { photoService } from "@/lib/api"
import { Image as ImageIcon, Search, Filter, Camera } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function GalleryPublicPage() {
    const [photos, setPhotos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("All")
    const categories = ["All", "Campus", "Sports", "Academic", "Events", "General"]

    useEffect(() => {
        fetchPhotos()
    }, [])

    const fetchPhotos = async () => {
        try {
            const res = await photoService.getAll()
            setPhotos(res.data.data)
        } catch (error) {
            console.error("Failed to fetch gallery")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredPhotos = filter === "All" 
        ? photos 
        : photos.filter(p => p.category === filter)

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-primary pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gold-500/10 border border-gold-500/20 text-gold-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6"
                    >
                        <Camera size={14} /> School Moments
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase tracking-tighter italic">
                        Visual <span className="text-gold-500">Chronicles</span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto font-medium">Explore the vibrant life and activities at SKP Sainik Public School.</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={cn(
                                "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === cat 
                                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredPhotos.map((photo, index) => (
                            <motion.div
                                layout
                                key={photo.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                className="aspect-square rounded-[2.5rem] overflow-hidden group relative cursor-pointer"
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                    <span className="text-gold-500 text-[10px] font-black uppercase tracking-widest mb-2">{photo.category}</span>
                                    <h3 className="text-white font-heading font-black italic uppercase tracking-tight">{photo.caption}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredPhotos.length === 0 && !isLoading && (
                    <div className="py-24 text-center">
                        <ImageIcon size={64} className="mx-auto text-slate-100 mb-6" />
                        <p className="text-slate-300 font-bold italic tracking-tighter uppercase text-xl">No frames captured yet.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
