"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { feeService } from "@/lib/api"
import { 
    CreditCard, 
    BadgeIndianRupee, 
    MoreHorizontal, 
    FileCheck,
    Search,
    Download
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function FeesPage() {
    const [fees, setFees] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await feeService.getAll()
                setFees(res.data.data)
            } catch (error) {
                console.error("Failed to fetch fees")
            } finally {
                setIsLoading(false)
            }
        }
        fetchFees()
    }, [])

    const filteredFees = fees.filter((f: any) => 
        f.student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Finance Management</h1>
                    <p className="text-muted-foreground text-sm">Monitor fee collections, outstanding dues, and financial reports.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} /> General Report
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10">
                        <CreditCard size={18} /> New Collection
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-primary rounded-3xl text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <BadgeIndianRupee className="text-gold-500 mb-6" size={32} />
                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">M-T-D Revenue</h3>
                        <p className="text-3xl font-heading font-black">₹{fees.reduce((acc, curr: any) => curr.status === 'paid' ? acc + curr.amount : acc, 0).toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-3xl relative overflow-hidden group">
                    <CreditCard className="text-red-500 mb-6" size={32} />
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</h3>
                    <p className="text-3xl font-heading font-black text-primary">₹{fees.reduce((acc, curr: any) => curr.status === 'pending' ? acc + curr.amount : acc, 0).toLocaleString()}</p>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-3xl relative overflow-hidden group">
                    <FileCheck className="text-green-500 mb-6" size={32} />
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Paid Invoices</h3>
                    <p className="text-3xl font-heading font-black text-primary">{fees.filter((f: any) => f.status === 'paid').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h3 className="font-heading font-bold text-primary">Transactions Log</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find by Admin No or Fee Type..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none ring-0 placeholder:text-slate-300 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Type</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-6 h-12 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : filteredFees.length > 0 ? (
                                filteredFees.map((row: any, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-primary">{row.type}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Q4 Session</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-500 font-medium">#{row.student.admissionNo}</td>
                                        <td className="px-8 py-6 text-sm text-slate-500 font-medium">{new Date(row.dueDate).toLocaleDateString()}</td>
                                        <td className="px-8 py-6 text-sm font-heading font-black text-primary">₹{row.amount.toLocaleString()}</td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider",
                                                row.status === "paid" ? "bg-green-100 text-green-700" :
                                                row.status === "pending" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-16 text-center text-slate-400 font-bold italic">No financial records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
