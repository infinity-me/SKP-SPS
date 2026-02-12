"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { studentService, attendanceService } from "@/lib/api"
import {
    Users,
    CheckSquare,
    Upload,
    MessageSquare,
    ArrowUpRight,
    ClipboardList,
    UserPlus
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts"

const attendanceData = [
    { name: "Mon", present: 42, total: 45 },
    { name: "Tue", present: 44, total: 45 },
    { name: "Wed", present: 40, total: 45 },
    { name: "Thu", present: 45, total: 45 },
    { name: "Fri", present: 43, total: 45 },
]

const performanceData = [
    { name: "Grade A", value: 30 },
    { name: "Grade B", value: 45 },
    { name: "Grade C", value: 20 },
    { name: "Grade D", value: 5 },
]

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

export default function TeacherDashboard() {
    const [students, setStudents] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await studentService.getStudents()
                setStudents(res.data.data)
            } catch (error) {
                console.error("Failed to fetch teacher data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const markAllPresent = async () => {
        // Simulation: Mark all students present for today
        alert("Marking attendance for 45 students...")
    }
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Teacher Console</h1>
                    <p className="text-muted-foreground text-sm">Class 10-A • 45 Students • Academic Session 2026</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={markAllPresent}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                    >
                        <CheckSquare size={18} /> Mark Attendance
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <TeacherStatCard label="Today's Attendance" value="95.5%" sub="43/45 Present" icon={<Users className="text-blue-500" />} />
                <TeacherStatCard label="Average GPA" value="3.8" sub="Class Performance" icon={<ClipboardList className="text-purple-500" />} />
                <TeacherStatCard label="Pending Results" value="12" sub="Unit Test - Physics" icon={<ClipboardList className="text-orange-500" />} />
                <TeacherStatCard label="New Admission" value="1" sub="Joined this week" icon={<UserPlus className="text-green-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-heading font-bold text-primary mb-8">Weekly Attendance Registry</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
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
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="present" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-heading font-bold text-primary mb-8 text-center" >Grade Distribution</h3>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={performanceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TeacherStatCard({ label, value, sub, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group">
            <div className="p-3 bg-slate-50 rounded-xl mb-4 w-fit group-hover:bg-primary/5 transition-colors">
                {icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-heading font-black text-primary mb-1">{value}</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{sub}</p>
        </div>
    )
}
