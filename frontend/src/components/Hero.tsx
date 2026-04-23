"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Trophy } from "lucide-react"
import { useState, useEffect } from "react"
import { publicDataService } from "@/lib/api"

const FALLBACK_TOPPERS = [
    { id: 1, name: "Anshu Yadav",     topperRank: "Joint 1st Rank", topperPercent: "95",    topperMarks: "570/600", topperClass: "Class X", topperYear: "2026" },
    { id: 2, name: "Nimmi Prajapati", topperRank: "Joint 1st Rank", topperPercent: "95",    topperMarks: "570/600", topperClass: "Class X", topperYear: "2026" },
    { id: 3, name: "Neelu Yadav",     topperRank: "2nd Rank",       topperPercent: "93.33", topperMarks: "560/600", topperClass: "Class X", topperYear: "2026" },
]

export default function Hero() {
    const [toppers, setToppers] = useState<any[]>([])

    useEffect(() => {
        const load = async () => {
            try {
                // Try new dedicated endpoint first
                const res = await publicDataService.getBoardToppers()
                const data: any[] = res?.data?.data || []
                if (data.length > 0) {
                    const sorted = [...data].sort((a, b) => (b.year || "") > (a.year || "") ? 1 : -1)
                    const latest = sorted[0]?.year
                    const recent = sorted
                        .filter(t => t.year === latest)
                        .sort((a, b) => parseFloat(b.percentage || "0") - parseFloat(a.percentage || "0"))
                        .slice(0, 3)
                    setToppers(recent)
                    return
                }
            } catch {
                // New endpoint not deployed yet, fall through
            }
            try {
                // Fall back to old student-based toppers endpoint
                const res2 = await publicDataService.getToppers()
                const data2: any[] = res2?.data?.data || []
                if (data2.length > 0) {
                    const sorted = [...data2].sort((a, b) => (b.topperYear || "") > (a.topperYear || "") ? 1 : -1)
                    const latest = sorted[0]?.topperYear
                    const recent = sorted
                        .filter(t => t.topperYear === latest)
                        .sort((a, b) => parseFloat(b.topperPercent || "0") - parseFloat(a.topperPercent || "0"))
                        .slice(0, 3)
                    setToppers(recent)
                    return
                }
            } catch { }
            // Final fallback: hardcoded
            setToppers(FALLBACK_TOPPERS)
        }
        load()
    }, [])

    const year = toppers[0]?.year || toppers[0]?.topperYear || "2026"
    const cls  = toppers[0]?.boardClass || toppers[0]?.topperClass || "Class X"

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Cinematic Background Image */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/images/school-img3.jpeg"
                    alt="SKP School Campus"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-primary/30 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30 z-10" />
            </motion.div>

            {/* 2-col layout */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-16 md:mt-20 lg:mt-0 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* LEFT: hero text */}
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-500 text-xs font-bold tracking-widest uppercase border border-gold-500/20 mb-6 inline-block">
                            Nurturing Excellence Since 2009
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-[1.2] md:leading-[1.1]">
                            Shaping Minds, <br className="hidden sm:block" />
                            <span className="text-gold-500">Building Futures.</span>
                        </h1>
                        <p className="text-white/70 text-base md:text-xl mb-8 md:mb-10 leading-relaxed font-light max-w-lg md:max-w-none">
                            Welcome to SKP SAINIK PUBLIC SCHOOL. A premier institution in Manihari, dedicated to discipline, academic excellence, and holistic development.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                            <a
                                href="https://www.google.com/maps/place/SKP+Sainik+Public+School+Manihari/@26.3237066,83.8933234,17z/data=!3m1!4b1!4m6!3m5!1s0x399235e9c9453875:0xc29ad69e63ba0392!8m2!3d26.3237066!4d83.8958983!16s%2Fg%2F11k4rwzbh3?entry=ttu&g_ep=EgoyMDI2MDQwNS4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-8 py-3.5 md:py-4 bg-gold-500 text-primary rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-all"
                                >
                                    Inquire Now <ArrowRight size={20} />
                                </motion.button>
                            </a>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-3.5 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-base md:text-lg hover:bg-white/20 transition-all"
                            >
                                Virtual Tour
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* ── Mobile Toppers Strip (hidden on lg+) ── */}
                    {toppers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.7 }}
                            className="lg:hidden mt-6"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gold-400">🏆 Board Results {year}</span>
                                <div className="flex-1 h-px bg-gold-500/20" />
                            </div>
                            <div className="flex flex-col gap-2">
                                {toppers.map((t, i) => (
                                    <div key={t.id || i}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-gold-500/20">
                                        <Trophy size={14} className="text-gold-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-white text-xs uppercase truncate">{t.name}</p>
                                            <p className="text-gold-400/70 text-[10px] font-bold">{t.rank || t.topperRank || `Rank ${i+1}`}</p>
                                        </div>
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center shadow-md">
                                            <span className="text-primary font-black text-[10px]">{t.percentage || t.topperPercent}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <a href="/toppers" className="block text-center text-gold-400/70 text-[10px] font-bold mt-2 hover:text-gold-400 transition-colors">
                                View Full Hall of Fame →
                            </a>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex flex-wrap gap-3 mt-10 md:mt-14 pt-8 border-t border-white/10"
                    >
                        {[
                            { icon: "🎖️", label: "Est. 2009" },
                            { icon: "📋", label: "CBSE Affiliated" },
                            { icon: "🏆", label: "100% Board Pass" },
                            { icon: "🏫", label: "Nursery – Class XII" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                <span className="text-sm">{item.icon}</span>
                                <span className="text-white/80 text-xs font-bold tracking-wide">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* RIGHT: Board Results Spotlight — only on desktop */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 }}
                    className="hidden lg:flex flex-col gap-4"
                >
                    {/* Badge + heading */}
                    <div className="text-center mb-1">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-[10px] font-black uppercase tracking-widest">
                            🏆 Board Results {year}
                        </span>
                        <p className="text-white font-black text-xl mt-2 tracking-wide">CONGRATULATIONS</p>
                        <p className="text-gold-400/80 text-xs font-bold uppercase tracking-widest mt-0.5">
                            {cls} Toppers · CBSE {year}
                        </p>
                        <div className="w-16 h-px bg-gold-500/30 mx-auto mt-3" />
                    </div>

                    {/* Topper rows */}
                    <div className="flex flex-col gap-3">
                        {toppers.map((t, i) => (
                            <motion.div
                                key={t.id || i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + i * 0.13 }}
                                className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-gold-500/20 hover:bg-white/15 hover:border-gold-500/40 transition-all group"
                            >
                                {/* Trophy icon */}
                                <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/30 transition-colors">
                                    <Trophy size={20} className="text-gold-400" />
                                </div>
                                {/* Name + rank + marks */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-white text-sm uppercase tracking-wide truncate">{t.name}</p>
                                    <p className="text-gold-400/80 text-[10px] font-bold mt-0.5">{t.rank || t.topperRank || `Rank ${i + 1}`}</p>
                                    {(t.marks || t.topperMarks) && (
                                        <p className="text-white/40 text-[10px] font-bold">Marks: {t.marks || t.topperMarks}</p>
                                    )}
                                </div>
                                {/* Percentage circle */}
                                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/30 group-hover:scale-110 transition-transform">
                                    <span className="text-primary font-black text-xs text-center leading-tight">
                                        {t.percentage || t.topperPercent}%
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer links */}
                    <p className="text-center text-white/35 italic text-xs font-bold mt-1">
                        &quot;We are proud of you!&quot; — SKP Sainik School
                    </p>
                    <a
                        href="/toppers"
                        className="text-center text-gold-400 text-xs font-bold hover:text-gold-300 transition-colors underline underline-offset-2"
                    >
                        View Full Hall of Fame →
                    </a>
                </motion.div>

            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-gold-500 rounded-full" />
                </div>
            </motion.div>
        </section>
    )
}
