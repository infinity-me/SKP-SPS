"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { feeService, circularService } from "@/lib/api"
import {
    Calendar,
    BookOpen,
    Trophy,
    CreditCard,
    Bell,
    ArrowRight,
    Clock,
    AlertCircle
} from "lucide-react"

export default function StudentDashboard() {
    const [fees, setFees] = useState([])
    const [circulars, setCirculars] = useState([])
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const userData = JSON.parse(storedUser)
            setUser(userData)

            const fetchData = async () => {
                try {
                    const [feeRes, circRes] = await Promise.all([
                        feeService.getForStudent(userData.id),
                        circularService.getAll()
                    ])
                    setFees(feeRes.data.data)
                    setCirculars(circRes.data.data)
                } catch (error) {
                    console.error("Failed to fetch student data")
                } finally {
                    setIsLoading(false)
                }
            }
            fetchData()
        }
    }, [])

    const pendingFees = fees.filter((f: any) => f.status === 'pending')
    const totalPending = pendingFees.reduce((acc: number, f: any) => acc + f.amount, 0)
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Academic Overview</h1>
                    <p className="text-muted-foreground text-sm">Welcome back, Abhishek. Your academic journey is on track.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <OverviewCard
                    label="Attendance"
                    value="94%"
                    sub="Last 30 days"
                    icon={<Calendar className="text-blue-500" />}
                    trend="+2%"
                />
                <OverviewCard
                    label="Current Rank"
                    value="12th"
                    sub="In Class 10th-A"
                    icon={<Trophy className="text-gold-500" />}
                    trend="Top 15%"
                />
                <OverviewCard
                    label="Pending Fees"
                    value={`₹${totalPending.toLocaleString()}`}
                    sub={pendingFees.length > 0 ? `Due ${(pendingFees[0] as any).dueDate}` : "All clear"}
                    icon={<CreditCard className="text-red-500" />}
                    status={pendingFees.length > 0 ? "Action Required" : "Paid"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="font-heading font-bold text-primary flex items-center gap-2">
                                <BookOpen size={18} className="text-gold-500" />
                                Active Homework
                            </h3>
                            <button className="text-xs font-bold text-gold-500 uppercase tracking-widest">View All</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { title: "Mathematics - Trigonometry", due: "Tomorrow", subject: "Maths", color: "bg-blue-500" },
                                { title: "Science - Physics Experiment", due: "Feb 15", subject: "Science", color: "bg-green-500" },
                            ].map((hw, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-1 h-10 rounded-full", hw.color)} />
                                        <div>
                                            <p className="font-bold text-primary text-sm group-hover:text-gold-500 transition-colors">{hw.title}</p>
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">{hw.subject} • Due {hw.due}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gold-500 mb-6 border border-white/10">
                                <Bell size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-4">Latest Notices</h3>
                            <div className="space-y-6">
                                {circulars.slice(0, 3).map((circ: any, i) => (
                                    <div key={i} className="border-l-2 border-gold-500 pl-4 py-1">
                                        <p className="font-bold text-sm mb-1">{circ.title}</p>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                            {circ.category} • {new Date(circ.date || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                                {circulars.length === 0 && (
                                    <p className="text-white/30 text-xs italic">No new notices.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function OverviewCard({ label, value, sub, icon, trend, status }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                    {icon}
                </div>
                {trend && <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
                {status && <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-full">{status}</span>}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-heading font-black text-primary mb-1">{value}</h3>
            <p className="text-slate-400 text-xs font-medium">{sub}</p>
        </div>
    )
}
