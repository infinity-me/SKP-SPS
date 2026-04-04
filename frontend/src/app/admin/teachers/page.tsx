"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { teacherService } from "@/lib/api"
import { 
    Users, 
    MoreHorizontal, 
    Plus, 
    Search,
    MapPin,
    GraduationCap,
    Clock
} from "lucide-react"

export default function TeachersPage() {
    const [teachers, setTeachers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await teacherService.getAll()
                setTeachers(res.data.data)
            } catch (error) {
                console.error("Failed to fetch teachers")
            } finally {
                setIsLoading(false)
            }
        }
        fetchTeachers()
    }, [])

    const filteredTeachers = teachers.filter((t: any) => 
        t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.staffId.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Staff Directory</h1>
                    <p className="text-muted-foreground text-sm">Manage and monitor academic staff performance and assignments.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10">
                    <Plus size={18} /> Add Teacher
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or Staff ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/5 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-3 text-xs font-bold text-slate-500 hover:text-primary transition-colors">Filters</button>
                    <button className="flex-1 md:flex-none px-4 py-3 text-xs font-bold text-slate-500 hover:text-primary transition-colors">Export CSV</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse" />)
                ) : filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher: any, i) => (
                        <motion.div
                            key={teacher.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button className="text-slate-300 hover:text-primary transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-primary font-black text-2xl mb-4 group-hover:bg-primary group-hover:text-gold-500 transition-all">
                                    {teacher.user.name[0]}
                                </div>
                                <h3 className="text-lg font-heading font-black text-primary mb-1">{teacher.user.name}</h3>
                                <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest mb-6">{teacher.designation}</p>

                                <div className="w-full grid grid-cols-2 gap-4 text-left border-t border-slate-50 pt-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Staff ID</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <GraduationCap size={14} className="text-slate-300" />
                                            {teacher.staffId}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Experience</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <Clock size={14} className="text-slate-300" />
                                            5+ Years
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">
                        No teachers found matching your search.
                    </div>
                )}
            </div>
        </div>
    )
}
