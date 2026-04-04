"use client"

import { useState, useEffect } from "react"
import { 
    teacherApplicationService 
} from "@/lib/api"
import { 
    Search, Filter, ExternalLink, Mail, Phone, 
    Calendar, CheckCircle2, XCircle, Clock, MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminTeacherApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadApplications()
    }, [])

    const loadApplications = async () => {
        try {
            const res = await teacherApplicationService.getAll()
            setApplications(res.data.data)
        } catch (err) {
            console.error("Failed to load applications", err)
        } finally {
            setIsLoading(false)
        }
    }

    const updateStatus = async (id: number, status: string) => {
        try {
            await teacherApplicationService.update(id, { status })
            loadApplications()
        } catch (err) {
            console.error("Failed to update status", err)
        }
    }

    const filteredApplications = applications.filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-primary font-heading">Teacher Recruitment</h1>
                    <p className="text-slate-400">Review and manage faculty applications.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search applications..." 
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary/20 transition-all text-sm w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Applicant</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Subject & Exp</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Resume</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {filteredApplications.map((app) => (
                                    <motion.tr 
                                        key={app.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-xs font-bold text-slate-500">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-primary">{app.fullName}</div>
                                            <div className="flex items-center gap-3 mt-1 text-slate-400">
                                                <div className="flex items-center gap-1 text-[10px]"><Mail size={10} /> {app.email}</div>
                                                <div className="flex items-center gap-1 text-[10px]"><Phone size={10} /> {app.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-600">{app.subject}</div>
                                            <div className="text-[10px] text-gold-600 font-black uppercase tracking-wider">{app.experience}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <a 
                                                href={app.resumeUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
                                            >
                                                Resume <ExternalLink size={12} />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={app.status} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => updateStatus(app.id, 'shortlisted')}
                                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                                                    title="Shortlist"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => updateStatus(app.id, 'rejected')}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                                    title="Reject"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {isLoading && (
                    <div className="py-20 text-center text-slate-400 font-bold italic">Loading applications...</div>
                )}
                {!isLoading && filteredApplications.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold italic">No applications found.</div>
                )}
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        pending: "bg-amber-100 text-amber-600 border-amber-200",
        shortlisted: "bg-green-100 text-green-600 border-green-200",
        rejected: "bg-red-100 text-red-600 border-red-200",
        reviewed: "bg-blue-100 text-blue-600 border-blue-200"
    }

    return (
        <span className={cn(
            "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            styles[status] || "bg-slate-100 text-slate-600"
        )}>
            {status}
        </span>
    )
}
