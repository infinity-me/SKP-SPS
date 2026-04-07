"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, 
    CreditCard, 
    User, 
    Calendar, 
    BadgeIndianRupee, 
    ArrowRight, 
    CheckCircle2, 
    AlertCircle,
    Loader2,
    ChevronLeft
} from "lucide-react"
import { feeService } from "@/lib/api"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Step = "search" | "review" | "success"

export default function PayFeesPage() {
    const [step, setStep] = useState<Step>("search")
    const [admissionNo, setAdmissionNo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [studentData, setStudentData] = useState<any>(null)
    const [selectedFees, setSelectedFees] = useState<number[]>([])
    const [isPaying, setIsPaying] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!admissionNo) return
        
        setIsLoading(true)
        setError("")
        try {
            const res = await feeService.lookup(admissionNo)
            if (res.data.success) {
                setStudentData(res.data.student)
                setStep("review")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Could not find student records.")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePayment = async () => {
        if (selectedFees.length === 0) return
        
        setIsPaying(true)
        try {
            // Pay each selected fee (Mock loop)
            for (const feeId of selectedFees) {
                await feeService.pay(feeId)
            }
            setStep("success")
        } catch (err) {
            setError("Payment failed. Please try again.")
        } finally {
            setIsPaying(false)
        }
    }

    const toggleFeeSelection = (id: number) => {
        setSelectedFees(prev => 
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        )
    }

    const calculateTotal = () => {
        return studentData?.fees
            ?.filter((f: any) => selectedFees.includes(f.id))
            ?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto w-full">
                {/* Progress Header */}
                <div className="text-center mb-12">
                    <p className="text-gold-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 italic">Official Payment Portal</p>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-primary tracking-tighter uppercase italic">Secure <span className="text-gold-500">Checkout</span></h1>
                    
                    {/* Stepper Tags */}
                    <div className="flex justify-center gap-4 mt-8">
                        {["search", "review", "success"].map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all",
                                    step === s ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" : 
                                    (i < ["search", "review", "success"].indexOf(step) ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-slate-400")
                                )}>
                                    {i < ["search", "review", "success"].indexOf(step) ? <CheckCircle2 size={12} /> : i + 1}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest hidden md:block",
                                    step === s ? "text-primary" : "text-slate-300"
                                )}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-primary/5 border border-slate-100 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: SEARCH */}
                        {step === "search" && (
                            <motion.div 
                                key="search"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-10 md:p-16 text-center"
                            >
                                <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                    <User className="text-primary" size={32} />
                                </div>
                                <h2 className="text-2xl font-heading font-black text-primary uppercase italic mb-4">Identity Verification</h2>
                                <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto">Please enter the official Admission Number to retrieve pending fee records.</p>
                                
                                <form onSubmit={handleSearch} className="max-w-md mx-auto space-y-6">
                                    <div className="relative">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Admission No (e.g. 2024001)"
                                            value={admissionNo}
                                            onChange={(e) => setAdmissionNo(e.target.value)}
                                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-2xl text-lg font-bold text-primary placeholder:text-slate-200 focus:ring-2 ring-primary/5 transition-all outline-none italic"
                                        />
                                    </div>
                                    
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold justify-center">
                                            <AlertCircle size={16} /> {error}
                                        </motion.div>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-navy-800 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                            <>Find Records <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* STEP 2: REVIEW */}
                        {step === "review" && (
                            <motion.div 
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-10 md:p-16"
                            >
                                <button onClick={() => setStep("search")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary mb-8 transition-colors">
                                    <ChevronLeft size={16} /> Back to Search
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Student Card */}
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-sm font-black text-primary uppercase tracking-widest italic mb-6 border-b border-slate-50 pb-4">Cadet Profile</h3>
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-slate-100 rounded-[2rem] overflow-hidden flex-shrink-0 border-2 border-white shadow-lg">
                                                    {studentData.user.profilePic ? (
                                                        <img src={studentData.user.profilePic} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-2xl uppercase">
                                                            {studentData.user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-heading font-black text-primary italic uppercase leading-none">{studentData.user.name}</p>
                                                    <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest mt-2">{studentData.class} - Section {studentData.section}</p>
                                                    <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400">
                                                        <span className="flex items-center gap-1"><User size={12} /> #{studentData.admissionNo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-slate-50 rounded-2xl">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Session</p>
                                                <p className="text-xs font-bold text-primary">2026 Academic</p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-2xl">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                <p className="text-xs font-bold text-emerald-600">Active Cadet</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fee Listing */}
                                    <div className="bg-slate-50 p-8 rounded-[2rem] space-y-6">
                                        <h3 className="text-sm font-black text-primary uppercase tracking-widest italic mb-2">Pending Dues</h3>
                                        
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {studentData.fees.length > 0 ? studentData.fees.map((fee: any) => (
                                                <div 
                                                    key={fee.id}
                                                    onClick={() => toggleFeeSelection(fee.id)}
                                                    className={cn(
                                                        "p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
                                                        selectedFees.includes(fee.id) ? "bg-white border-primary shadow-xl shadow-primary/5" : "bg-white/50 border-transparent hover:border-slate-200"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                        selectedFees.includes(fee.id) ? "bg-primary border-primary text-white" : "border-slate-200"
                                                    )}>
                                                        {selectedFees.includes(fee.id) && <CheckCircle2 size={12} strokeWidth={3} />}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-[11px] font-black text-primary uppercase tracking-wider">{fee.type}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1"><Calendar size={10} /> Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <p className="font-heading font-black text-primary italic">₹{fee.amount}</p>
                                                </div>
                                            )) : (
                                                <div className="text-center py-10">
                                                    <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={32} />
                                                    <p className="text-xs font-bold text-slate-500">All fees are cleared!</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-slate-200">
                                            <div className="flex justify-between items-end mb-8">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                                                    <p className="text-3xl font-heading font-black text-primary italic leading-none">₹{calculateTotal().toLocaleString()}</p>
                                                </div>
                                                <BadgeIndianRupee size={40} className="text-gold-500 opacity-20" />
                                            </div>

                                            <button 
                                                onClick={handlePayment}
                                                disabled={selectedFees.length === 0 || isPaying}
                                                className="w-full py-5 bg-gold-500 text-primary rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gold-600 transition-all shadow-xl shadow-gold-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                                            >
                                                {isPaying ? <Loader2 className="animate-spin" size={18} /> : (
                                                    <><CreditCard size={18} /> Process Payment</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {step === "success" && (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-16 text-center"
                            >
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-500/10">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h2 className="text-4xl font-heading font-black text-primary uppercase italic mb-4">Payment <span className="text-emerald-600">Success</span></h2>
                                <p className="text-slate-500 text-sm mb-12 max-w-md mx-auto leading-relaxed font-medium">Your transaction has been confirmed. The digital record for cadet <span className="text-primary font-bold italic">{studentData.user.name}</span> has been updated instantly.</p>
                                
                                <div className="max-w-sm mx-auto space-y-4">
                                    <Link href="/profile">
                                        <button className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-navy-800 transition-all shadow-xl shadow-primary/20">
                                            View in Profile History
                                        </button>
                                    </Link>
                                    <Link href="/">
                                        <button className="w-full py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-50 transition-all">
                                            Return to Homepage
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Badges */}
                <div className="mt-12 flex justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                        <CreditCard size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest italic outline-none">PCI-DSS Secure</span>
                    </div>
                    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                        <CheckCircle2 size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Official SKP Portal</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
