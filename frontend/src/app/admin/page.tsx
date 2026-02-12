"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { admissionService, studentService } from "@/lib/api"
import {
    Users,
    UserCheck,
    BadgeIndianRupee,
    TrendingUp,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts"

const stats = [
    { label: "Total Students", value: "1,248", change: "+12%", trendingUp: true, icon: <Users className="text-blue-500" /> },
    { label: "Active Teachers", value: "86", change: "+2", trendingUp: true, icon: <UserCheck className="text-green-500" /> },
    { label: "Revenue (MTD)", value: "₹8.4L", change: "+18%", trendingUp: true, icon: <BadgeIndianRupee className="text-gold-500" /> },
    { label: "Pending Fees", value: "₹2.1L", change: "-5%", trendingUp: false, icon: <TrendingUp className="text-red-500" /> },
]

const chartData = [
    { name: "Jul", value: 4000 },
    { name: "Aug", value: 3000 },
    { name: "Sep", value: 2000 },
    { name: "Oct", value: 2780 },
    { name: "Nov", value: 1890 },
    { name: "Dec", value: 2390 },
    { name: "Jan", value: 3490 },
]

export default function AdminDashboard() {
    const [admissions, setAdmissions] = useState([])
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [admRes, stuRes] = await Promise.all([
                    admissionService.getAdmissions(),
                    studentService.getStudents()
                ])
                setAdmissions(admRes.data.data)
                setStudents(stuRes.data.data)
            } catch (error) {
                console.error("Failed to fetch dashboard data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">System Overview</h1>
                    <p className="text-muted-foreground text-sm">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Export Report</button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10">Add Student</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Students", value: students.length.toString(), change: "+12%", trendingUp: true, icon: <Users className="text-blue-500" /> },
                    { label: "Active Teachers", value: "86", change: "+2", trendingUp: true, icon: <UserCheck className="text-green-500" /> },
                    { label: "Admissions (New)", value: admissions.length.toString(), change: "+18%", trendingUp: true, icon: <BadgeIndianRupee className="text-gold-500" /> },
                    { label: "Pending Fees", value: "₹2.1L", change: "-5%", trendingUp: false, icon: <TrendingUp className="text-red-500" /> },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                                {stat.icon}
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                                stat.trendingUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            )}>
                                {stat.trendingUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-heading font-black text-primary">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-heading font-bold text-primary">Fee Collection Trends</h3>
                        <select className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-400 px-3 py-1 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <BadgeIndianRupee className="text-gold-500 mb-6" size={48} />
                        <h3 className="text-2xl font-heading font-black text-white leading-tight mb-4">
                            Total Outstanding <br /> <span className="text-gold-500">Inventory Value</span>
                        </h3>
                        <p className="text-white/50 text-sm leading-relaxed mb-8">
                            Stocks for uniforms and stationery are currently at 85% capacity.
                        </p>
                    </div>
                    <button className="relative z-10 w-full py-4 bg-gold-500 text-primary rounded-2xl font-bold hover:bg-gold-400 transition-all flex items-center justify-center gap-2">
                        Manage Store <ArrowUpRight size={18} />
                    </button>

                    {/* Decorative pattern */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl -z-0" />
                    <div className="absolute top-0 right-0 p-8 text-white/5">
                        <TrendingUp size={120} />
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-heading font-bold text-primary">Recent Admissions</h3>
                    <button className="text-xs font-bold text-gold-500 hover:text-gold-400 uppercase tracking-widest">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied For</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {admissions.slice(0, 5).map((row: any, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-bold text-primary">{row.firstName} {row.lastName}</p>
                                        <p className="text-[10px] text-slate-400">{row.email}</p>
                                    </td>
                                    <td className="px-8 py-4 text-sm text-slate-500 font-medium">Class {row.class}</td>
                                    <td className="px-8 py-4 text-sm text-slate-500 font-medium">
                                        {new Date(row.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={cn(
                                            "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                            row.status === "Approved" ? "bg-green-50 text-green-600" :
                                                row.status === "pending" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="text-slate-300 hover:text-primary transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {admissions.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 text-sm italic">
                                        No recent admissions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

