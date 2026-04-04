"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, CreditCard, Receipt, ShieldCheck, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PayFeesPage() {
    const [studentId, setStudentId] = useState("")
    const [studentData, setStudentData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleLookup = () => {
        setIsLoading(true)
        setTimeout(() => {
            setStudentData({
                name: "Abhishek Maurya",
                class: "10th",
                section: "A",
                pendingFees: [
                    { month: "February 2026", type: "Tuition Fee", amount: 4500 },
                    { month: "February 2026", type: "Activity Fee", amount: 500 },
                ],
                totalPending: 5000,
            })
            setIsLoading(false)
        }, 1500)
    }

    const handlePayment = () => {
        alert("Razorpay Checkout will open now. (Simulation)")
    }

    return (
        <div className="min-h-screen bg-primary pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Fee Payment Portal</h1>
                    <p className="text-white/60">Enter your School ID or Admission Number to proceed with payment.</p>
                </div>

                <div className="space-y-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="text"
                                    placeholder="Admission No / School ID"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-gold-500/50 transition-all font-mono"
                                />
                            </div>
                            <button
                                onClick={handleLookup}
                                disabled={!studentId || isLoading}
                                className="px-8 py-4 bg-gold-500 text-primary rounded-2xl font-bold hover:bg-gold-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? "Fetching..." : "Search Records"}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {studentData && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                            >
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                                        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                                            <div>
                                                <h2 className="text-2xl font-heading font-bold text-primary">{studentData.name}</h2>
                                                <p className="text-muted-foreground">Class {studentData.class} - {studentData.section}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold uppercase tracking-widest text-gold-500">School ID</span>
                                                <p className="font-mono font-bold text-primary">{studentId}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider">Breakdown</h3>
                                            {studentData.pendingFees.map((fee: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center py-2">
                                                    <div>
                                                        <p className="font-semibold text-primary">{fee.type}</p>
                                                        <p className="text-xs text-muted-foreground">{fee.month}</p>
                                                    </div>
                                                    <p className="font-bold text-primary">₹{fee.amount}</p>
                                                </div>
                                            ))}
                                            <div className="border-t border-slate-100 pt-6 mt-4 flex justify-between items-center">
                                                <p className="text-lg font-bold text-primary">Total Amount Due</p>
                                                <p className="text-2xl font-heading font-black text-primary">₹{studentData.totalPending}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-6 flex gap-4">
                                        <ShieldCheck className="text-gold-500 shrink-0" size={24} />
                                        <p className="text-sm text-gold-500/80 leading-relaxed">
                                            All transactions are secured with 256-bit encryption. You will receive an instant digital receipt upon successful payment.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                                        <h3 className="text-xl font-heading font-bold text-primary mb-6">Payment Method</h3>
                                        <div className="space-y-3">
                                            <div className="p-4 border-2 border-gold-500 bg-gold-500/5 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="text-gold-500" />
                                                    <span className="font-bold text-primary">Online Payment</span>
                                                </div>
                                                <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            Pay Now <ArrowRight size={18} />
                                        </button>

                                        <div className="mt-6 flex items-center justify-center gap-4 opacity-40">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Secured via Razorpay</div>
                                        </div>
                                    </div>

                                    <Link href="/login" className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                        <Receipt size={20} />
                                        View Payment History
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
