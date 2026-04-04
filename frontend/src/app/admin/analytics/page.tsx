"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { analyticsService } from "@/lib/api"
import { 
    Users, 
    GraduationCap, 
    BadgeIndianRupee, 
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Calendar
} from "lucide-react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts"

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await analyticsService.getStats()
                setStats(res.data.data)
            } catch (error) {
                console.error("Failed to fetch analytics")
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (isLoading) return <div className="p-8 text-slate-400 font-bold animate-pulse">Loading Analytics...</div>

    const chartData = [
        { name: "Mon", value: 400 },
        { name: "Tue", value: 300 },
        { name: "Wed", value: 600 },
        { name: "Thu", value: 800 },
        { name: "Fri", value: 500 },
        { name: "Sat", value: 900 },
        { name: "Sun", value: 700 },
    ]

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Performance Analytics</h1>
                    <p className="text-muted-foreground text-sm">Real-time school growth and financial health metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Students" 
                    value={stats?.studentCount || 0} 
                    change="+5.2%" 
                    icon={<GraduationCap className="text-blue-500" />} 
                />
                <StatCard 
                    label="Staff Members" 
                    value={stats?.teacherCount || 0} 
                    change="+2" 
                    icon={<Users className="text-purple-500" />} 
                />
                <StatCard 
                    label="Total Revenue" 
                    value={`₹${(stats?.totalRevenue / 1000).toFixed(1)}k`} 
                    change="+12%" 
                    icon={<BadgeIndianRupee className="text-gold-500" />} 
                />
                <StatCard 
                    label="Pending Dues" 
                    value={`₹${(stats?.pendingFees / 1000).toFixed(1)}k`} 
                    change="-3%" 
                    icon={<TrendingUp className="text-red-500" />} 
                    negative 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-heading font-bold text-primary mb-8">Daily Traffic Overview</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                <Area type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-heading font-bold text-primary mb-8">Recent Activity</h3>
                    <div className="space-y-6">
                        {stats?.recentAdmissions.length > 0 ? stats.recentAdmissions.map((adm: any) => (
                            <div key={adm.id} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                    {adm.firstName[0]}{adm.lastName[0]}
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-bold text-primary">{adm.firstName} {adm.lastName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applied for Class {adm.class}</p>
                                </div>
                                <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                                    {new Date(adm.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 text-sm italic py-12">No recent registration activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, change, icon, negative = false }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${negative ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {negative ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                    {change}
                </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-heading font-black text-primary">{value}</h3>
        </motion.div>
    )
}
