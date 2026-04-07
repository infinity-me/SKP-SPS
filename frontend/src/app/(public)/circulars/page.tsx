"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Search, Calendar, Download, Tag, ArrowRight } from "lucide-react"
import { circularService } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function CircularsPage() {
    const [circulars, setCirculars] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

    const categories = ["All", "Academic", "Exams", "Holidays", "Events", "General"]

    useEffect(() => {
        fetchCirculars()
    }, [])

    const fetchCirculars = async () => {
        try {
            const res = await circularService.getAll()
            setCirculars(res.data.data)
        } catch (error) {
            console.error("Failed to fetch circulars")
        } finally {
            setLoading(false)
        }
    }

    const filteredCirculars = circulars.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             c.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "All" || c.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Page Switcher */}
                <div className="flex justify-center">
                    <div className="inline-flex p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <a 
                            href="/circulars" 
                            className="px-8 py-3 rounded-xl bg-primary text-gold-500 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all"
                        >
                            Circulars
                        </a>
                        <a 
                            href="/notices" 
                            className="px-8 py-3 rounded-xl text-slate-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-all"
                        >
                            Notices
                        </a>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-heading font-black text-primary uppercase italic tracking-tighter"
                    >
                        School <span className="text-gold-500">Circulars</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium"
                    >
                        Stay updated with official announcements, schedules, and important documents.
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    selectedCategory === cat 
                                        ? "bg-primary text-gold-500 shadow-lg shadow-primary/20" 
                                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search circulars..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none ring-0 transition-all focus:bg-white focus:ring-2 focus:ring-gold-500/10"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1,2,3].map(i => (
                            <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-slate-100" />
                        ))
                    ) : (
                        filteredCirculars.map((circular, i) => (
                            <motion.div
                                key={circular.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col"
                            >
                                <div className="p-8 space-y-6 flex-grow">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-gold-500 transition-all duration-500">
                                            <FileText size={24} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gold-500/10 text-gold-600 rounded-lg">
                                            {circular.category}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-heading font-black text-primary leading-tight group-hover:text-gold-500 transition-colors uppercase italic">{circular.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">{circular.description}</p>
                                    </div>
                                </div>
                                <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        <Calendar size={14} />
                                        {new Date(circular.date).toLocaleDateString()}
                                    </div>
                                    <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:text-gold-500 transition-colors group/btn">
                                        View Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {!loading && filteredCirculars.length === 0 && (
                    <div className="py-40 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <Search size={40} />
                        </div>
                        <h2 className="text-2xl font-heading font-black text-primary uppercase italic">No matching circulars</h2>
                        <p className="text-slate-400 font-medium">Try adjusting your search or category filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
