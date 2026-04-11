"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Bell, ArrowRight } from "lucide-react"
import { publicDataService } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function NoticeTicker() {
    const [notices, setNotices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await publicDataService.getNotices()
                setNotices(res.data.data || [])
            } catch (err) {
                console.error("Failed to fetch notices for ticker:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchNotices()
    }, [])

    if (isLoading || notices.length === 0) return null

    return (
        <div className="bg-primary border-b border-gold-500/20 py-3 relative overflow-hidden group">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 relative z-10">
                {/* Fixed Label */}
                <div className="flex items-center gap-3 shrink-0 py-1 px-4 bg-gold-500 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Bell size={14} className="text-primary fill-primary" />
                    </motion.div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap">Latest Updates</span>
                </div>

                {/* Ticker Container */}
                <div className="flex-grow overflow-hidden relative h-6">
                    <motion.div 
                        initial={{ x: "0%" }}
                        animate={{ x: "-50%" }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 30, 
                            ease: "linear" 
                        }}
                        className="flex items-center gap-12 whitespace-nowrap w-fit hover:[animation-play-state:paused]"
                    >
                        {/* Double the content for seamless loop */}
                        {[...notices, ...notices].map((notice, i) => (
                            <div key={i} className="flex items-center gap-4 text-white/80 hover:text-gold-500 transition-colors cursor-pointer group/item">
                                <span className="text-xs font-bold leading-none">{notice.title}</span>
                                <div className="w-1 h-1 rounded-full bg-gold-500/40" />
                                <span className="text-[10px] opacity-40 uppercase tracking-tighter">{new Date(notice.date).toLocaleDateString()}</span>
                                <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity ml-1" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
