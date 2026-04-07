"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CreditCard, BadgeIndianRupee, Check, ShieldCheck, HelpCircle, ArrowRight, Loader2 } from "lucide-react"
import { feeStructureService } from "@/lib/api"
import Link from "next/link"

export default function FeesPublicPage() {
    const [feeStructure, setFeeStructure] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStructure = async () => {
            try {
                const res = await feeStructureService.getAll()
                setFeeStructure(res.data.data)
            } catch (error) {
                console.error("Failed to fetch fee structure")
            } finally {
                setIsLoading(false)
            }
        }
        fetchStructure()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-primary pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/20 via-transparent to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase tracking-tighter italic"
                    >
                        Fee <span className="text-gold-500">Structure</span>
                    </motion.h1>
                    <p className="text-white/70 max-w-2xl mx-auto font-medium text-sm md:text-base">Transparent and merit-based education at SKP Sainik Public School. Invest in your cadet's future today.</p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Fee Table or Loading */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                            <div className="p-10 border-b border-slate-50">
                                <h3 className="text-2xl font-heading font-black text-primary uppercase italic">Academic Session 2026-27</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Class-wise fee distribution for new and existing students.</p>
                            </div>
                            
                            {isLoading ? (
                                <div className="flex-grow flex items-center justify-center">
                                    <Loader2 className="animate-spin text-gold-500" size={40} />
                                </div>
                            ) : feeStructure.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class / Grade</th>
                                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Component</th>
                                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 font-medium">
                                            {feeStructure.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-10 py-6 font-bold text-primary">{row.className}</td>
                                                    <td className="px-10 py-6 text-slate-500 text-sm">{row.feeType}</td>
                                                    <td className="px-10 py-6 text-right font-heading font-black text-primary italic">₹{row.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center justify-center text-slate-400 italic text-sm font-medium">
                                    No fee structure information available currently.
                                </div>
                            )}
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-gold-500/10 border border-gold-500/20 rounded-[2rem]">
                                <ShieldCheck className="text-gold-500 mb-4" size={32} />
                                <h4 className="text-primary font-black uppercase text-sm mb-2 italic">Secure Payments</h4>
                                <p className="text-slate-600 text-xs font-medium leading-relaxed">All transactions are processed through encrypted gateways. Receipts are generated instantly for your records.</p>
                            </div>
                            <div className="p-8 bg-primary text-white rounded-[2rem]">
                                <HelpCircle className="text-gold-500 mb-4" size={32} />
                                <h4 className="text-white font-black uppercase text-sm mb-2 italic">Fee Concessions</h4>
                                <p className="text-white/60 text-xs font-medium leading-relaxed">Concessions are available for siblings and meritorious students. Contact the admin office for details.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pay Section */}
                    <aside className="space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary rounded-[3rem] p-10 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 text-gold-500 opacity-10">
                                <CreditCard size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-heading font-black text-white italic uppercase mb-4">Online Payment</h3>
                                <p className="text-white/60 text-sm mb-8 font-medium">Quickly settle your cadet's dues through our secure portal.</p>
                                <Link href="/pay-fees">
                                    <button className="w-full py-5 bg-gold-500 text-primary font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/20 mb-4 flex items-center justify-center gap-2 group">
                                        Pay Fees Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest italic">Supports Cards, UPI, Netbanking</p>
                            </div>
                        </motion.div>

                        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 space-y-6">
                            <h4 className="text-xs font-black text-primary uppercase italic tracking-widest border-b border-slate-50 pb-4">Required Documents</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 w-5 h-5 bg-green-100 flex items-center justify-center text-green-600 rounded-full flex-shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-primary">Admission Receipt</p>
                                        <p className="text-[10px] text-slate-400 font-medium">For new enrollments.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 w-5 h-5 bg-green-100 flex items-center justify-center text-green-600 rounded-full flex-shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-primary">Previous Fee Slip</p>
                                        <p className="text-[10px] text-slate-400 font-medium">For monthly clearances.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
