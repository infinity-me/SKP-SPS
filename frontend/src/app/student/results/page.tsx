"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { resultService } from "@/lib/api"
import { Award, BookOpen, TrendingUp, Printer, ChevronDown, Star, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

function grade(marks: number, total: number) {
    const pct = (marks / total) * 100
    if (pct >= 91) return { g: "A+", label: "Outstanding",   color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", bar: "bg-emerald-500" }
    if (pct >= 81) return { g: "A",  label: "Excellent",     color: "text-green-700",   bg: "bg-green-50",    border: "border-green-200",   bar: "bg-green-500" }
    if (pct >= 71) return { g: "B+", label: "Very Good",     color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200",    bar: "bg-blue-500" }
    if (pct >= 61) return { g: "B",  label: "Good",          color: "text-indigo-700",  bg: "bg-indigo-50",   border: "border-indigo-200",  bar: "bg-indigo-500" }
    if (pct >= 51) return { g: "C",  label: "Average",       color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   bar: "bg-amber-500" }
    if (pct >= 33) return { g: "D",  label: "Pass",          color: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-200",  bar: "bg-orange-400" }
    return              { g: "F",  label: "Fail",           color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200",     bar: "bg-red-500" }
}

export default function StudentResultsPage() {
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [activeTerm, setActiveTerm] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)
    const printRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (stored) setUser(JSON.parse(stored))
        fetchResults()
    }, [])

    async function fetchResults() {
        try {
            const res = await resultService.getMy()
            const data: any[] = res.data.data
            setResults(data)
            // Default to first available term
            const terms = Array.from(new Set(data.map(r => r.term)))
            if (terms.length > 0) setActiveTerm(terms[0])
        } catch (err: any) {
            setError(err?.response?.data?.error || "Failed to load results. Please contact administration.")
        } finally { setLoading(false) }
    }

    const terms = Array.from(new Set(results.map(r => r.term)))
    const termResults = activeTerm ? results.filter(r => r.term === activeTerm) : []

    // Calculate stats for active term
    const totalMarks = termResults.reduce((a, r) => a + r.marks, 0)
    const totalMax   = termResults.reduce((a, r) => a + r.total, 0)
    const pct        = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0
    const { g, label, color, bg, border, bar } = totalMax > 0 ? grade(totalMarks, totalMax) : { g:"—", label:"No Data", color:"text-slate-400", bg:"bg-slate-50", border:"border-slate-100", bar:"bg-slate-200" }

    // Topper/best subjects
    const best = termResults.length > 0 ? [...termResults].sort((a,b) => (b.marks/b.total)-(a.marks/a.total))[0] : null
    const worst = termResults.length > 0 ? [...termResults].sort((a,b) => (a.marks/a.total)-(b.marks/b.total))[0] : null

    const handlePrint = () => window.print()

    if (loading) return (
        <div className="space-y-4 pb-12">
            {Array(3).fill(0).map((_,i) => <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse"/>)}
        </div>
    )

    if (error) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle size={48} className="text-slate-300"/>
            <p className="font-bold text-slate-500 text-center max-w-sm">{error}</p>
        </div>
    )

    if (results.length === 0) return (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-slate-300">
            <BookOpen size={56}/>
            <div className="text-center">
                <p className="font-black text-lg text-slate-400">No Results Available</p>
                <p className="text-sm text-slate-300 mt-1">Your marks haven't been uploaded yet. Please check back later.</p>
            </div>
        </div>
    )

    return (
        <div className="space-y-6 pb-12" ref={printRef}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">My Report Card</h1>
                    <p className="text-muted-foreground text-sm">Academic performance — {user?.name}</p>
                </div>
                <button onClick={handlePrint} className="flex items-center gap-2 border border-slate-200 px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Printer size={16}/> Print Report
                </button>
            </div>

            {/* Term Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {terms.map(term => (
                    <button key={term} onClick={() => setActiveTerm(term)}
                        className={cn("flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap", 
                            activeTerm === term ? "bg-primary text-white shadow-lg shadow-primary/10" : "bg-white border border-slate-100 text-slate-600 hover:border-primary/30")}>
                        {term}
                    </button>
                ))}
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={cn("p-5 rounded-2xl border col-span-2 md:col-span-1", bg, border)}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Overall Grade</p>
                    <p className={cn("text-5xl font-black", color)}>{g}</p>
                    <p className={cn("text-xs font-bold mt-1", color)}>{label}</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-100 bg-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Score</p>
                    <p className="text-2xl font-black text-primary">{totalMarks}</p>
                    <p className="text-xs font-bold text-slate-400 mt-1">out of {totalMax}</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-100 bg-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Percentage</p>
                    <p className="text-2xl font-black text-primary">{pct}%</p>
                    <div className="mt-2 bg-slate-100 rounded-full h-1.5">
                        <div className={cn("h-full rounded-full transition-all", bar)} style={{width:`${pct}%`}}/>
                    </div>
                </div>
                <div className="p-5 rounded-2xl border border-slate-100 bg-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Highlights</p>
                    {best && <div className="flex items-center gap-2 text-xs"><Star size={12} className="text-gold-500 flex-shrink-0"/><span className="font-bold text-primary truncate">Best: {best.subject} ({Math.round((best.marks/best.total)*100)}%)</span></div>}
                    {worst && worst.id !== best?.id && <div className="flex items-center gap-2 text-xs mt-1"><TrendingUp size={12} className="text-red-400 flex-shrink-0"/><span className="font-bold text-slate-500 truncate">Focus: {worst.subject} ({Math.round((worst.marks/worst.total)*100)}%)</span></div>}
                </div>
            </div>

            {/* Subject Report Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex items-center gap-2">
                    <BookOpen size={18} className="text-gold-500"/>
                    <h3 className="font-heading font-black text-primary">Subject-wise Performance</h3>
                    <span className="text-xs font-bold text-slate-400 ml-auto">{termResults.length} subjects</span>
                </div>
                <div className="divide-y divide-slate-50">
                    {termResults.map((r, i) => {
                        const rpct = Math.round((r.marks / r.total) * 100)
                        const { g: rg, label: rl, color: rc, bg: rb, bar: rbar } = grade(r.marks, r.total)
                        return (
                            <motion.div key={r.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.04 }}
                                className="flex items-center gap-4 p-4 hover:bg-slate-50/60 transition-colors">
                                {/* Subject Indicator */}
                                <div className={cn("w-1.5 h-10 rounded-full flex-shrink-0", rbar)}/>
                                {/* Subject Name */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-primary text-sm truncate">{r.subject}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="flex-1 max-w-40 bg-slate-100 rounded-full h-1.5">
                                            <div className={cn("h-full rounded-full transition-all duration-700", rbar)} style={{width:`${rpct}%`}}/>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">{rpct}%</span>
                                    </div>
                                </div>
                                {/* Marks */}
                                <div className="text-center hidden sm:block">
                                    <p className="text-xl font-black text-primary leading-none">{r.marks}</p>
                                    <p className="text-[10px] font-bold text-slate-300 mt-0.5">/ {r.total}</p>
                                </div>
                                {/* Grade Badge */}
                                <div className={cn("px-3 py-1.5 rounded-xl text-center border min-w-14", rb, border)}>
                                    <p className={cn("text-lg font-black leading-none", rc)}>{rg}</p>
                                    <p className={cn("text-[8px] font-black uppercase tracking-widest leading-none mt-0.5", rc)}>{rl}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Remarks */}
            <div className={cn("p-6 rounded-2xl border", bg, border)}>
                <div className="flex items-start gap-3">
                    <Award size={22} className={color}/>
                    <div>
                        <h4 className={cn("font-black", color)}>Performance Remark</h4>
                        <p className="text-sm text-slate-600 mt-1">
                            {g === "A+" && "Exceptional performance! You are in the top tier of your class. Keep up the outstanding work!"}
                            {g === "A"  && "Excellent work! Your dedication and hard work are clearly showing. Aim for A+ next time!"}
                            {g === "B+" && "Very good performance! You are well above average. A little more effort and you can hit A!"}
                            {g === "B"  && "Good job! You're performing well. Focus on your weaker subjects to improve further."}
                            {g === "C"  && "Average performance. Identify your weak areas and put in extra effort to improve your scores."}
                            {g === "D"  && "You have passed, but there is significant room for improvement. Please consult your teachers for guidance."}
                            {g === "F"  && "You need immediate attention and support. Please talk to your class teacher as soon as possible."}
                            {g === "—"  && "No results are available for this term yet."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
