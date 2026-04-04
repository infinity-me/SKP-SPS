"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { noticeService } from "@/lib/api"
import {
    Bell, Plus, Trash2, ToggleLeft, ToggleRight,
    Megaphone, AlertTriangle, CheckCircle2, Info, X
} from "lucide-react"
import { cn } from "@/lib/utils"

const TYPE_OPTIONS = [
    { value: "info",    label: "Info",    icon: <Info size={14} />,           color: "text-sky-500 bg-sky-50 border-sky-200" },
    { value: "success", label: "Success", icon: <CheckCircle2 size={14} />,   color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { value: "warning", label: "Warning", icon: <AlertTriangle size={14} />,  color: "text-amber-600 bg-amber-50 border-amber-200" },
    { value: "urgent",  label: "Urgent",  icon: <Megaphone size={14} />,      color: "text-red-600 bg-red-50 border-red-200" },
]

export default function AdminNoticesPage() {
    const [notices, setNotices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ message: "", type: "info" })
    const [saving, setSaving] = useState(false)

    useEffect(() => { load() }, [])

    const load = async () => {
        try {
            const res = await noticeService.getAll()
            setNotices(res.data.data)
        } catch (e) { console.error(e) }
        finally { setIsLoading(false) }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await noticeService.create(form)
            setForm({ message: "", type: "info" })
            setShowForm(false)
            load()
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const toggleActive = async (id: number, current: boolean) => {
        await noticeService.update(id, { isActive: !current })
        load()
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this notice?")) return
        await noticeService.remove(id)
        load()
    }

    const typeCfg = (type: string) =>
        TYPE_OPTIONS.find(t => t.value === type) ?? TYPE_OPTIONS[0]

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-primary font-heading flex items-center gap-3">
                        <Bell className="text-gold-500" size={28} />
                        Notices & Announcements
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Manage the floating scrolling notice bar shown across the portal.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    New Notice
                </button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-black text-primary text-lg">Add New Notice</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-5">
                            {/* Type selector */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notice Type</label>
                                <div className="flex flex-wrap gap-3">
                                    {TYPE_OPTIONS.map(t => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, type: t.value }))}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all",
                                                form.type === t.value ? t.color : "text-slate-400 bg-slate-50 border-slate-100"
                                            )}
                                        >
                                            {t.icon} {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    placeholder="e.g. Admissions for 2025-26 are now open. Apply before 31st March!"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-primary text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Post Notice"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notices list */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{notices.length} Notice{notices.length !== 1 ? "s" : ""}</p>
                </div>

                <div className="divide-y divide-slate-50">
                    <AnimatePresence>
                        {notices.map(n => {
                            const cfg = typeCfg(n.type)
                            return (
                                <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={cn(
                                        "flex items-start gap-5 px-8 py-5 transition-colors",
                                        !n.isActive && "opacity-40"
                                    )}
                                >
                                    {/* Type badge */}
                                    <span className={cn(
                                        "shrink-0 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border mt-0.5",
                                        cfg.color
                                    )}>
                                        {cfg.icon}
                                        {cfg.label}
                                    </span>

                                    {/* Message */}
                                    <p className="flex-1 text-sm text-slate-700 font-medium leading-relaxed">
                                        {n.message}
                                    </p>

                                    {/* Date */}
                                    <span className="shrink-0 text-[10px] text-slate-400 font-medium mt-0.5">
                                        {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                    </span>

                                    {/* Active toggle */}
                                    <button
                                        onClick={() => toggleActive(n.id, n.isActive)}
                                        title={n.isActive ? "Deactivate" : "Activate"}
                                        className={cn(
                                            "shrink-0 transition-colors",
                                            n.isActive ? "text-emerald-500" : "text-slate-300"
                                        )}
                                    >
                                        {n.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(n.id)}
                                        className="shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {!isLoading && notices.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold italic">
                        No notices yet. Click "New Notice" to create one.
                    </div>
                )}
                {isLoading && (
                    <div className="py-20 text-center text-slate-400 font-bold italic">Loading…</div>
                )}
            </div>
        </div>
    )
}
