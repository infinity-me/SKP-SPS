"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Shield, Clock, Shirt, Users, AlertTriangle, Printer, ChevronDown } from "lucide-react"
import { publicDataService } from "@/lib/api"

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
}

const staticRules = [
    {
        category: "General Conduct",
        icon: <Shield size={22} />,
        color: "bg-blue-50 text-blue-600 border-blue-200",
        rules: [
            "All students must address teachers and staff with respect at all times.",
            "No student shall engage in ragging, bullying, or any form of misconduct.",
            "Students are responsible for the care of school property and equipment.",
            "Mobile phones are strictly prohibited inside classrooms and during school hours.",
            "Every cadet must maintain cleanliness in classrooms, corridors, and campus.",
            "Any act of dishonesty, including cheating in exams, will lead to serious disciplinary action.",
        ],
    },
    {
        category: "Attendance Policy",
        icon: <Clock size={22} />,
        color: "bg-amber-50 text-amber-600 border-amber-200",
        rules: [
            "A minimum of 75% attendance is mandatory for appearing in board examinations.",
            "Students must arrive before the first bell (7:45 AM). Late arrivals must report to the Principal.",
            "Leave of absence must be applied through parents/guardians in writing.",
            "Unexplained absences for more than 3 consecutive days require a medical certificate.",
            "Students absent on exam days without prior written leave application will be awarded zero.",
        ],
    },
    {
        category: "Uniform & Appearance",
        icon: <Shirt size={22} />,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200",
        rules: [
            "Full prescribed school uniform must be worn every school day. No exceptions.",
            "Shoes must be black, clean, and polished. White socks only.",
            "Hair must be neatly cut/tied. Boys: short hair above the collar. Girls: neatly braided or tied.",
            "No jewellery or accessories other than a simple watch are permitted.",
            "PT/Sports uniform must be worn only on designated days. Not to be used outside campus.",
            "ID cards must be worn at all times within school premises.",
        ],
    },
    {
        category: "Discipline & NCC",
        icon: <Shield size={22} />,
        color: "bg-rose-50 text-rose-600 border-rose-200",
        rules: [
            "Participation in Morning Assembly and PT drill is compulsory for all students.",
            "NCC cadets must attend all parades and camps as scheduled.",
            "Any damage to school infrastructure will be charged to the responsible student's family.",
            "Students found with prohibited items (tobacco, alcohol, sharp objects) will be expelled.",
            "Disrespect to the National Flag, National Anthem, or school motto is a serious offence.",
        ],
    },
    {
        category: "Parent Guidelines",
        icon: <Users size={22} />,
        color: "bg-purple-50 text-purple-600 border-purple-200",
        rules: [
            "Parents must attend all scheduled Parent-Teacher Meetings (PTMs) — at least 2 per year.",
            "Changes in address, phone number, or emergency contacts must be updated at the school office immediately.",
            "Parents should not enter classrooms without prior appointment with the class teacher.",
            "Fees must be paid by the 10th of every month. Late payment incurs a fine of ₹50/day.",
            "Feedback and complaints should be submitted in writing to the Principal's office.",
            "Parents are requested not to park vehicles inside the school gate during pick-up and drop-off.",
        ],
    },
    {
        category: "Academic Rules",
        icon: <BookOpen size={22} />,
        color: "bg-teal-50 text-teal-600 border-teal-200",
        rules: [
            "All homework and assignments must be completed and submitted on time.",
            "Students must cover all textbooks and notebooks with brown paper by the first week of the session.",
            "School diaries must be signed by parents every day and produced when required.",
            "Students found using unfair means during tests/exams will be awarded zero and parents notified.",
            "Participation in Annual Sports Day, Science Fair, and Cultural programmes is mandatory.",
        ],
    },
]

export default function RulesPage() {
    const [dynamicRules, setDynamicRules] = useState<any[]>([])
    const [openIdx, setOpenIdx] = useState<number | null>(0)

    useEffect(() => {
        publicDataService.getRules()
            .then((res) => setDynamicRules(res?.data?.data || []))
            .catch(() => setDynamicRules([]))
    }, [])

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
                        <BookOpen size={12} /> School Handbook
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white mb-6"
                    >
                        Rules & <span className="text-gold-500">Regulations</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-white/60 max-w-2xl mx-auto text-lg mb-8"
                    >
                        The complete school handbook covering conduct, attendance, uniform, discipline, and parent guidelines.
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
                    >
                        <Printer size={18} /> Print / Download Handbook
                    </motion.button>
                </div>
            </section>

            {/* Important Notice Banner */}
            <div className="bg-amber-50 border-y border-amber-200 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                    <p className="text-amber-800 text-sm font-medium">
                        These rules apply to all students, staff, and visitors of SKP Sainik Public School. Violations may result in disciplinary action as per the school's conduct policy.
                    </p>
                </div>
            </div>

            {/* Dynamic Rules from DB (if any) */}
            {dynamicRules.length > 0 && (
                <section className="py-16 px-6 bg-white border-b border-slate-100">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-heading font-bold text-primary mb-8 flex items-center gap-3">
                            <AlertTriangle size={22} className="text-gold-500" /> Latest Circulars & Updates
                        </h2>
                        <div className="space-y-4">
                            {dynamicRules.map((rule, i) => (
                                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md transition-all">
                                    <h4 className="font-bold text-primary">{rule.title}</h4>
                                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{rule.description}</p>
                                    <p className="text-xs text-slate-400 mt-3">{new Date(rule.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Static Rules Accordion */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeUp} className="text-center mb-12">
                        <h2 className="text-3xl font-heading font-bold text-primary">School Conduct Handbook</h2>
                        <p className="text-muted-foreground mt-3">Click on a category to expand the rules.</p>
                    </motion.div>

                    <div className="space-y-4">
                        {staticRules.map((section, idx) => (
                            <motion.div key={idx} {...fadeUp} transition={{ delay: idx * 0.07 }}
                                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                                <button
                                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${section.color}`}>
                                            {section.icon}
                                        </div>
                                        <h3 className="font-heading font-bold text-primary text-lg">{section.category}</h3>
                                    </div>
                                    <ChevronDown
                                        size={20}
                                        className={`text-slate-400 transition-transform duration-300 ${openIdx === idx ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {openIdx === idx && (
                                    <div className="px-6 pb-6 border-t border-slate-100">
                                        <ul className="space-y-3 mt-4">
                                            {section.rules.map((rule, rIdx) => (
                                                <li key={rIdx} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                                                    <span className="w-6 h-6 rounded-full bg-primary/5 text-primary text-xs font-black flex items-center justify-center mt-0.5 shrink-0">
                                                        {rIdx + 1}
                                                    </span>
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer note */}
                    <motion.div {...fadeUp} className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-2xl text-center">
                        <p className="text-primary font-medium text-sm leading-relaxed">
                            For any queries regarding school rules and regulations, please contact the school office.<br />
                            <span className="font-bold">📞 9454331861 | 📧 skpspsmanihari09@gmail.com</span>
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
