"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ToggleLeft, ToggleRight, Save, Users, AlertCircle, CheckCircle,
    Calendar, FileText, Phone, Mail, MapPin, ChevronDown, ChevronUp,
    Inbox, Settings2, Trash2, Eye, RefreshCw, Search, SlidersHorizontal,
    GraduationCap, Building2, User
} from "lucide-react"
import { admissionService, admissionSettingsService } from "@/lib/api"
import { cn } from "@/lib/utils"

const CLASSES = ["Nursery","LKG","UKG","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII","Class IX","Class X","Class XI","Class XII"]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pending:  { label: "Pending",  color: "text-yellow-700",  bg: "bg-yellow-50",  border: "border-yellow-200" },
    called:   { label: "Called",   color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200"   },
    accepted: { label: "Accepted", color: "text-green-700",   bg: "bg-green-50",   border: "border-green-200"  },
    rejected: { label: "Rejected", color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"    },
}

interface Application {
    id: number
    firstName: string
    lastName: string
    dob?: string
    gender?: string
    classApplied: string
    fatherName?: string
    motherName?: string
    occupation?: string
    phone: string
    email: string
    address?: string
    previousSchool?: string
    lastClass?: string
    reasonLeaving?: string
    achievements?: string
    status: string
    adminNotes?: string
    createdAt: string
}

/* ─── Application Card ────────────────────────────────────────────────────── */
function ApplicationCard({ app, onUpdate, onDelete }: {
    app: Application
    onUpdate: (id: number, status: string, notes: string) => Promise<void>
    onDelete: (id: number) => void
}) {
    const [expanded, setExpanded] = useState(false)
    const [status, setStatus] = useState(app.status)
    const [notes, setNotes] = useState(app.adminNotes || "")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending

    const handleSave = async () => {
        setSaving(true)
        try {
            await onUpdate(app.id, status, notes)
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } finally {
            setSaving(false)
        }
    }

    const hasChanges = status !== app.status || notes !== (app.adminNotes || "")

    return (
        <motion.div
            layout
            className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden transition-all", cfg.border)}
        >
            {/* Card Header */}
            <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-black text-primary text-sm">
                                {app.firstName} {app.lastName}
                            </h3>
                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border", cfg.bg, cfg.color, cfg.border)}>
                                {cfg.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1"><GraduationCap size={11} /> {app.classApplied}</span>
                            <span className="flex items-center gap-1"><Phone size={11} /> {app.phone}</span>
                            <span className="hidden sm:flex items-center gap-1"><Mail size={11} /> {app.email}</span>
                            <span className="text-slate-300">
                                {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className="text-slate-300">#{app.id}</span>
                    {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-6 border-t border-slate-100 pt-5 space-y-6">

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InfoBlock label="Date of Birth" value={app.dob || "—"} />
                                <InfoBlock label="Gender" value={app.gender || "—"} />
                                <InfoBlock label="Father's Name" value={app.fatherName || "—"} />
                                <InfoBlock label="Mother's Name" value={app.motherName || "—"} />
                                <InfoBlock label="Occupation" value={app.occupation || "—"} />
                                <InfoBlock label="Email" value={app.email} />
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <InfoBlock label="Address" value={app.address || "—"} />
                                </div>
                                {app.previousSchool && <InfoBlock label="Previous School" value={app.previousSchool} />}
                                {app.lastClass && <InfoBlock label="Last Class" value={app.lastClass} />}
                                {app.reasonLeaving && <InfoBlock label="Reason Leaving" value={app.reasonLeaving} />}
                                {app.achievements && <InfoBlock label="Achievements" value={app.achievements} />}
                            </div>

                            {/* Admin Actions */}
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Settings2 size={12} /> Admin Actions
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Status</label>
                                        <select
                                            value={status}
                                            onChange={e => setStatus(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/10"
                                        >
                                            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                                                <option key={val} value={val}>{cfg.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Notes</label>
                                        <input
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            placeholder="e.g. Called on 24 Apr, asked to visit on 1 May"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !hasChanges}
                                        className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : saved ? (
                                            <CheckCircle size={13} />
                                        ) : (
                                            <Save size={13} />
                                        )}
                                        {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
                                    </button>
                                    <a
                                        href={`tel:${app.phone}`}
                                        className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all"
                                    >
                                        <Phone size={13} /> Call Now
                                    </a>
                                    <button
                                        onClick={() => onDelete(app.id)}
                                        className="ml-auto flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-medium text-slate-700">{value}</p>
        </div>
    )
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function AdminAdmissionsPage() {
    const [activeTab, setActiveTab] = useState<"applications" | "settings">("applications")
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState("all")
    const [search, setSearch] = useState("")

    // Settings state
    const [settings, setSettings] = useState<any>(null)
    const [seats, setSeats] = useState<Record<string, number>>({})
    const [bannerText, setBannerText] = useState("")
    const [lastDateText, setLastDateText] = useState("")
    const [saving, setSaving] = useState(false)
    const [toggling, setToggling] = useState(false)
    const [settingsLoading, setSettingsLoading] = useState(true)

    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => { fetchApplications() }, [filterStatus])
    useEffect(() => { fetchSettings() }, [])

    async function fetchApplications() {
        setLoading(true)
        try {
            const res = await admissionService.getAll(filterStatus)
            setApplications(res.data?.data || [])
        } catch {
            showToast("Failed to load applications", "error")
        } finally {
            setLoading(false)
        }
    }

    async function fetchSettings() {
        setSettingsLoading(true)
        try {
            const res = await admissionSettingsService.get()
            const d = res.data.data
            setSettings(d)
            setSeats(d.seats || {})
            setBannerText(d.bannerText)
            setLastDateText(d.lastDateText)
        } catch {
            showToast("Failed to load settings", "error")
        } finally {
            setSettingsLoading(false)
        }
    }

    async function handleUpdate(id: number, status: string, adminNotes: string) {
        await admissionService.updateStatus(id, { status, adminNotes })
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status, adminNotes } : a))
        showToast("Application updated!")
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this application permanently?")) return
        try {
            await admissionService.remove(id)
            setApplications(prev => prev.filter(a => a.id !== id))
            showToast("Application deleted")
        } catch {
            showToast("Failed to delete", "error")
        }
    }

    async function handleToggle() {
        setToggling(true)
        try {
            const res = await admissionSettingsService.toggle()
            setSettings(res.data.data)
            showToast(res.data.message)
        } catch {
            showToast("Toggle failed", "error")
        } finally {
            setToggling(false)
        }
    }

    async function handleSaveSettings() {
        setSaving(true)
        try {
            await admissionSettingsService.update({ isOpen: settings?.isOpen, bannerText, lastDateText, seats })
            showToast("Settings saved!")
        } catch {
            showToast("Failed to save settings", "error")
        } finally {
            setSaving(false)
        }
    }

    const filtered = applications.filter(a => {
        const q = search.toLowerCase()
        return !q || `${a.firstName} ${a.lastName} ${a.phone} ${a.email} ${a.classApplied}`.toLowerCase().includes(q)
    })

    const counts = Object.fromEntries(
        ["all", "pending", "called", "accepted", "rejected"].map(s => [
            s,
            s === "all" ? applications.length : applications.filter(a => a.status === s).length
        ])
    )

    return (
        <div className="space-y-6 pb-12">
            {/* Toast */}
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"}`}
                >
                    {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {toast.msg}
                </motion.div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Admissions</h1>
                    <p className="text-muted-foreground text-sm">Manage applications and admission settings.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeTab === "applications" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
                    >
                        <Inbox size={16} /> Applications
                        {counts.pending > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-black">{counts.pending}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeTab === "settings" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
                    >
                        <Settings2 size={16} /> Settings
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* ── APPLICATIONS TAB ── */}
                {activeTab === "applications" && (
                    <motion.div
                        key="applications"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-5"
                    >
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-grow">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by name, phone, class..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {["all", "pending", "called", "accepted", "rejected"].map(s => {
                                    const cfg = s === "all" ? null : STATUS_CONFIG[s]
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => setFilterStatus(s)}
                                            className={cn(
                                                "px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                                                filterStatus === s
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            {s} {counts[s] > 0 && `(${counts[s]})`}
                                        </button>
                                    )
                                })}
                                <button onClick={fetchApplications} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                    <RefreshCw size={14} className="text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Applications List */}
                        {loading ? (
                            <div className="flex items-center justify-center h-48 text-slate-400 font-medium text-sm">
                                Loading applications...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                <Inbox size={40} className="mb-3 opacity-30" />
                                <p className="font-bold">No applications found</p>
                                <p className="text-xs mt-1">
                                    {search ? "Try a different search term" : "New applications will appear here"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map(app => (
                                    <ApplicationCard
                                        key={app.id}
                                        app={app}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── SETTINGS TAB ── */}
                {activeTab === "settings" && (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {settingsLoading ? (
                            <div className="flex items-center justify-center h-48 text-slate-400 font-medium text-sm">
                                Loading settings...
                            </div>
                        ) : (
                            <>
                                {/* Save Button */}
                                <div className="flex justify-end">
                                    <button onClick={handleSaveSettings} disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 disabled:opacity-60">
                                        <Save size={16} /> {saving ? "Saving..." : "Save All Changes"}
                                    </button>
                                </div>

                                {/* Toggle Card */}
                                <motion.div
                                    className={`p-8 rounded-3xl border-2 transition-all ${settings?.isOpen ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div>
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-3 ${settings?.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                                {settings?.isOpen ? "● ADMISSIONS OPEN" : "● ADMISSIONS CLOSED"}
                                            </div>
                                            <h2 className="text-xl font-heading font-black text-primary">Admission Status Control</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Controls the live banner and urgency section on public website.</p>
                                        </div>
                                        <button onClick={handleToggle} disabled={toggling}
                                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg disabled:opacity-60 ${settings?.isOpen ? "bg-red-600 text-white hover:bg-red-700" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
                                            {toggling ? "Updating..." : settings?.isOpen
                                                ? <><ToggleRight size={24} /> Close Admissions</>
                                                : <><ToggleLeft size={24} /> Open Admissions</>}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Banner Text */}
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                    <h3 className="font-heading font-black text-primary flex items-center gap-2"><FileText size={18} className="text-gold-500" /> Website Banner Text</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Banner Headline</label>
                                            <input value={bannerText} onChange={e => setBannerText(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
                                            <p className="text-xs text-slate-400">Shown in the sticky notification bar</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> Last Date Text</label>
                                            <input value={lastDateText} onChange={e => setLastDateText(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
                                            <p className="text-xs text-slate-400">Shown on admission CTA buttons</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Seat Management */}
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-heading font-black text-primary flex items-center gap-2"><Users size={18} className="text-blue-500" /> Class-wise Seat Availability</h3>
                                        <div className="px-4 py-2 bg-primary/5 rounded-xl">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total: </span>
                                            <span className="text-lg font-black text-primary">{Object.values(seats).reduce((a, b) => a + Number(b), 0)}</span>
                                            <span className="text-xs text-slate-400 ml-1">seats</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {CLASSES.map(cls => (
                                            <div key={cls} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">{cls}</label>
                                                <input
                                                    type="number" min="0" max="100"
                                                    value={seats[cls] ?? 40}
                                                    onChange={e => setSeats(prev => ({ ...prev, [cls]: parseInt(e.target.value) || 0 }))}
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base font-black text-primary outline-none focus:ring-2 focus:ring-primary/10 text-center"
                                                />
                                                <p className="text-[10px] text-slate-400 text-center mt-1">seats</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
