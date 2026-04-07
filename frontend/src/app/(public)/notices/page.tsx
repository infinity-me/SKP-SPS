"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Megaphone, Calendar, ArrowRight, Bell, Tag, Search, X, FileText } from "lucide-react"
import { noticeService } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function NoticesPage() {
    const [notices, setNotices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchNotices()
    }, [])

    const fetchNotices = async () => {
        try {
            const res = await noticeService.getAll()
            setNotices(res.data.data)
        } catch (error) {
            console.error("Failed to fetch notices")
        } finally {
            setLoading(false)
        }
    }

    const filteredNotices = notices.filter(n => 
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
        n.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'urgent': return "bg-red-50 text-red-600 border-red-100"
            case 'warning': return "bg-amber-50 text-amber-600 border-amber-100"
            case 'success': return "bg-emerald-50 text-emerald-600 border-emerald-100"
            default: return "bg-sky-50 text-sky-600 border-sky-100"
        }
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Page Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex p-1 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                        <a 
                            href="/circulars" 
                            className="px-8 py-3 rounded-xl text-slate-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-all"
                        >
                            Circulars
                        </a>
                        <a 
                            href="/notices" 
                            className="px-8 py-3 rounded-xl bg-primary text-gold-500 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all"
                        >
                            Notices
                        </a>
                    </div>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 text-gold-600 rounded-full text-[10px] font-black uppercase tracking-widest"
                        >
                            <Bell size={12} /> Live Announcements
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-heading font-black text-primary uppercase italic tracking-tighter"
                        >
                            Notice <span className="text-gold-500">Board</span>
                        </motion.h1>
                        <div className="flex gap-4 pt-2">
                             <a href="/circulars" className="text-xs font-black uppercase text-gold-500 border-b-2 border-gold-500 pb-1 flex items-center gap-2 hover:text-primary hover:border-primary transition-all">
                                <FileText size={14} /> View School Circulars
                             </a>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Filter notices..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none ring-0 transition-all focus:bg-white focus:ring-2 focus:ring-gold-500/10"
                        />
                    </div>
                </div>

                {/* Notices List */}
                <div className="space-y-6">
                    {loading ? (
                        [1,2,3].map(i => (
                            <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse" />
                        ))
                    ) : (
                        <AnimatePresence>
                            {filteredNotices.map((notice, i) => (
                                <motion.div
                                    key={notice.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={cn(
                                        "group p-6 md:p-8 rounded-[2.5rem] border-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5",
                                        notice.isActive ? "bg-white border-slate-50" : "bg-slate-50 border-transparent opacity-60"
                                    )}
                                >
                                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-500",
                                            getTypeColor(notice.type)
                                        )}>
                                            <Megaphone size={24} />
                                        </div>
                                        <div className="flex-grow space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                                                    getTypeColor(notice.type)
                                                )}>
                                                    {notice.type}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(notice.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-lg md:text-xl font-heading font-bold text-primary leading-tight lowercase first-letter:uppercase">
                                                {notice.message}
                                            </p>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-4">
                                             {!notice.isActive && (
                                                <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-200 px-3 py-1 rounded-full">Archive</span>
                                             )}
                                             <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-gold-500 group-hover:border-gold-500 transition-all duration-500">
                                                <ArrowRight size={18} />
                                             </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {!loading && filteredNotices.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <h2 className="text-2xl font-heading font-black text-primary uppercase italic tracking-tighter">No notices found</h2>
                            <p className="text-slate-400 font-medium lowercase">The notice board is clear at the moment.</p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="pt-20 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Contact the administration for more details regarding any announcement.</p>
                </div>
            </div>
        </div>
    )
}
