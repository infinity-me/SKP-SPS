"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Star, Medal, ArrowRight } from "lucide-react"
import Link from "next/link"
import { publicDataService } from "@/lib/api"

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
}

export default function ToppersPage() {
    const [toppers, setToppers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedYear, setSelectedYear] = useState<string>("All")

    useEffect(() => {
        publicDataService.getToppers()
            .then((res) => setToppers(res?.data?.data || []))
            .catch(() => setToppers([]))
            .finally(() => setLoading(false))
    }, [])

    const years = ["All", ...Array.from(new Set(toppers.map((t) => t.topperYear).filter(Boolean))).sort((a: any, b: any) => b - a)]
    const filtered = selectedYear === "All" ? toppers : toppers.filter((t) => t.topperYear === selectedYear)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="bg-primary py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute -top-1/4 -right-1/4 w-1/2 h-full bg-gold-500 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Trophy size={12} /> Academic Excellence
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white mb-6"
                    >
                        Hall of <span className="text-gold-500">Fame</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-white/60 max-w-2xl mx-auto text-lg"
                    >
                        Celebrating our outstanding CBSE board exam achievers — the brightest minds who have made SKP Sainik Public School proud.
                    </motion.p>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="bg-white border-b border-slate-100 py-10 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
                    {[
                        { value: `${toppers.length || "10"}+`, label: "Total Toppers" },
                        { value: "100%", label: "Board Pass Rate" },
                        { value: "15+", label: "Years of Results" },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-3xl md:text-4xl font-black text-primary">{stat.value}</span>
                            <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Year Filter Tabs */}
            {years.length > 1 && (
                <section className="py-8 px-6 bg-slate-50 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto flex flex-wrap gap-3 justify-center">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${
                                    selectedYear === year
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary"
                                }`}
                            >
                                {year === "All" ? "All Years" : `Class of ${year}`}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Toppers Grid */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 text-primary">
                            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                            <p className="font-bold animate-pulse">Loading Hall of Fame...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-32">
                            <Trophy size={64} className="text-gold-500/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-primary mb-3">No Toppers Found</h3>
                            <p className="text-muted-foreground mb-8">
                                {selectedYear !== "All" ? `No records for ${selectedYear} yet.` : "Topper records will appear here once added."}
                            </p>
                            <Link href="/admission" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
                                Be the Next Topper <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {selectedYear === "All" ? (
                                // Group by year
                                Object.entries(
                                    filtered.reduce((groups: any, t) => {
                                        const yr = t.topperYear || "Unknown Year"
                                        if (!groups[yr]) groups[yr] = []
                                        groups[yr].push(t)
                                        return groups
                                    }, {})
                                )
                                    .sort(([a], [b]) => (b > a ? 1 : -1))
                                    .map(([year, yearToppers]: any) => (
                                        <div key={year} className="mb-20">
                                            <motion.div {...fadeUp} className="flex items-center gap-4 mb-10">
                                                <div className="p-3 bg-gold-500/10 rounded-2xl">
                                                    <Medal size={24} className="text-gold-500" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-heading font-black text-primary">Academic Year {year}</h2>
                                                    <p className="text-muted-foreground text-sm">CBSE Board Examination Results</p>
                                                </div>
                                                <div className="flex-grow h-px bg-slate-200 ml-4" />
                                            </motion.div>
                                            <TopperGrid toppers={yearToppers} />
                                        </div>
                                    ))
                            ) : (
                                <TopperGrid toppers={filtered} />
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-16 px-6 bg-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-500/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <Trophy size={48} className="text-gold-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-heading font-bold text-white mb-4">
                        Excellence is Our Standard
                    </h2>
                    <p className="text-white/50 mb-8">
                        SKP Sainik Public School consistently produces outstanding results in CBSE Board Examinations, with students achieving top scores across all streams.
                    </p>
                    <Link href="/admission" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-primary rounded-xl font-bold hover:bg-gold-400 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)]">
                        Secure Admission for 2026–27 <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    )
}

function TopperGrid({ toppers }: { toppers: any[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {toppers.map((topper, idx) => (
                <motion.div
                    key={topper.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.07 }}
                    className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-2xl hover:border-gold-500/30 transition-all duration-300 flex flex-col items-center text-center gap-4 group"
                >
                    {/* Rank Badge */}
                    {idx < 3 && (
                        <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg border-2 border-white ${
                            idx === 0 ? "bg-yellow-400 text-yellow-900" :
                            idx === 1 ? "bg-slate-300 text-slate-700" :
                            "bg-amber-600 text-amber-100"
                        }`}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                        </div>
                    )}

                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-gold-500/20 overflow-hidden bg-slate-100 flex items-center justify-center">
                            {topper.profilePic ? (
                                <img src={topper.profilePic} alt={topper.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary font-black text-2xl">
                                    {topper.name?.[0]}
                                </div>
                            )}
                        </div>
                        {topper.topperPercent && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold-500 text-primary text-xs font-black px-3 py-0.5 rounded-full whitespace-nowrap shadow-md">
                                {topper.topperPercent}%
                            </div>
                        )}
                    </div>

                    <div className="mt-3">
                        <h4 className="font-black text-primary text-base group-hover:text-gold-600 transition-colors">{topper.name}</h4>
                        <p className="text-muted-foreground text-xs font-medium mt-1">
                            Class {topper.class} {topper.topperYear && `• ${topper.topperYear}`}
                        </p>
                    </div>

                    <div className="flex gap-1 justify-center">
                        {[...Array(5)].map((_, s) => (
                            <Star key={s} size={12} className="text-gold-500 fill-gold-500" />
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
