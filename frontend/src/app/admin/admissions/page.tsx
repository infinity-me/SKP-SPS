"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import api from "@/lib/api"
import { ToggleLeft, ToggleRight, Save, Users, AlertCircle, CheckCircle, Calendar, FileText } from "lucide-react"
const CLASSES = ["Nursery","LKG","UKG","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII","Class IX","Class X","Class XI","Class XII"]

export default function AdmissionSettingsPage() {
    const [settings, setSettings] = useState<any>(null)
    const [seats, setSeats] = useState<Record<string, number>>({})
    const [bannerText, setBannerText] = useState("")
    const [lastDateText, setLastDateText] = useState("")
    const [saving, setSaving] = useState(false)
    const [toggling, setToggling] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
    const [loading, setLoading] = useState(true)

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            const res = await api.get(`/admissions/settings`)
            const d = res.data.data
            setSettings(d)
            setSeats(d.seats || {})
            setBannerText(d.bannerText)
            setLastDateText(d.lastDateText)
        } catch {
            showToast("Failed to load settings", "error")
        } finally {
            setLoading(false)
        }
    }

    async function handleToggle() {
        setToggling(true)
        try {
            const res = await api.patch(`/admissions/settings/toggle`, {})
            setSettings(res.data.data)
            showToast(res.data.message)
        } catch {
            showToast("Toggle failed", "error")
        } finally {
            setToggling(false)
        }
    }

    async function handleSave() {
        setSaving(true)
        try {
            await api.put(`/admissions/settings`, { isOpen: settings?.isOpen, bannerText, lastDateText, seats })
            showToast("Settings saved successfully!")
        } catch {
            showToast("Failed to save settings", "error")
        } finally {
            setSaving(false)
        }
    }

    const totalSeats = Object.values(seats).reduce((a, b) => a + Number(b), 0)

    if (loading) return <div className="flex items-center justify-center h-64 text-slate-400 font-medium">Loading admission settings...</div>

    return (
        <div className="space-y-8 pb-12">
            {/* Toast */}
            {toast && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"}`}>
                    {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {toast.msg}
                </motion.div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Admission Settings</h1>
                    <p className="text-muted-foreground text-sm">Control admission status, seat availability, and public-facing banner text.</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 disabled:opacity-60">
                    <Save size={18} /> {saving ? "Saving..." : "Save All Changes"}
                </button>
            </div>

            {/* Admission Toggle Card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-3xl border-2 transition-all ${settings?.isOpen ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-3 ${settings?.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {settings?.isOpen ? "● ADMISSIONS OPEN" : "● ADMISSIONS CLOSED"}
                        </div>
                        <h2 className="text-xl font-heading font-black text-primary">Admission Status Control</h2>
                        <p className="text-sm text-muted-foreground mt-1">This controls the live banner and urgency section on the public website.</p>
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
                        <p className="text-xs text-slate-400">Shown in the sticky notification bar on public website</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> Last Date Text</label>
                        <input value={lastDateText} onChange={e => setLastDateText(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
                        <p className="text-xs text-slate-400">Shown on admission section and CTA buttons</p>
                    </div>
                </div>
            </div>

            {/* Seat Management */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading font-black text-primary flex items-center gap-2"><Users size={18} className="text-blue-500" /> Class-wise Seat Availability</h3>
                    <div className="px-4 py-2 bg-primary/5 rounded-xl">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total: </span>
                        <span className="text-lg font-black text-primary">{totalSeats}</span>
                        <span className="text-xs text-slate-400 ml-1">seats</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Set available seats per class. These numbers show as &quot;Limited Seats&quot; counters on the public admissions page.</p>
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
        </div>
    )
}
