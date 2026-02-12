"use client"

import { motion } from "framer-motion"
import { CreditCard, ShieldCheck, Download, HelpCircle } from "lucide-react"

export default function FeesPage() {
    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <section className="bg-primary py-20 px-6 relative text-center">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">Fee <span className="text-gold-500">Structure</span></h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">Transparent and competitive fee structure for the academic year 2026-27.</p>
                </div>
            </section>

            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-8 py-6 text-sm font-black text-primary uppercase tracking-widest">Class Segment</th>
                                        <th className="px-8 py-6 text-sm font-black text-primary uppercase tracking-widest">Admission Fee</th>
                                        <th className="px-8 py-6 text-sm font-black text-primary uppercase tracking-widest">Monthly Tuition</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        { class: "Pre-Primary (LKG - UKG)", admission: "₹5,000", monthly: "₹1,800" },
                                        { class: "Primary (1st - 5th)", admission: "₹7,000", monthly: "₹2,200" },
                                        { class: "Middle (6th - 8th)", admission: "₹8,000", monthly: "₹2,800" },
                                        { class: "Secondary (9th - 10th)", admission: "₹10,000", monthly: "₹3,500" },
                                        { class: "Senior Secondary (11th - 12th)", admission: "₹12,000", monthly: "₹4,500" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6 font-bold text-primary">{row.class}</td>
                                            <td className="px-8 py-6 text-slate-500">{row.admission}</td>
                                            <td className="px-8 py-6 text-primary font-bold">{row.monthly}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gold-500/5 p-8 rounded-3xl border border-gold-500/20">
                            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                                <ShieldCheck className="text-gold-500" /> Note on Scholarships
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                We offer merit-based scholarships and concessions for children of defense personnel, single parents, and siblings. Please visit the administrative office for more details.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20">
                            <h3 className="text-xl font-heading font-bold mb-4">Payment Methods</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gold-500" />
                                    <span className="text-sm font-medium">Online via Student Portal</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gold-500" />
                                    <span className="text-sm font-medium">Direct Bank Transfer (NEFT/IMPS)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gold-500" />
                                    <span className="text-sm font-medium">Cheque/Demand Draft</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-gold-500 text-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold-400 transition-all shadow-lg">
                                <Download size={18} /> Download Fee Chart
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-primary mb-6">FAQ</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="font-bold text-sm text-primary mb-2">When is the fee due?</p>
                                    <p className="text-xs text-muted-foreground">Fees are due by the 10th of every month.</p>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-primary mb-2">Is there a fine for late payment?</p>
                                    <p className="text-xs text-muted-foreground">Yes, a fine of ₹50 per day is applicable after the 15th.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
