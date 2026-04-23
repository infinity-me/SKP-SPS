"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import api from "@/lib/api"
import { Edit3, Save, RefreshCw, CheckCircle, AlertCircle, Globe, Phone, Info } from "lucide-react"

const SECTIONS = [
    { key: "homepage", label: "Homepage", icon: <Globe size={16} /> },
    { key: "about", label: "About / Principal", icon: <Info size={16} /> },
    { key: "contact", label: "Contact Info", icon: <Phone size={16} /> },
]

export default function ContentEditorPage() {
    const [content, setContent] = useState<any[]>([])
    const [edits, setEdits] = useState<Record<string, string>>({})
    const [activeSection, setActiveSection] = useState("homepage")
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => { fetchContent() }, [])

    async function fetchContent() {
        setLoading(true)
        try {
            const res = await api.get(`/site-content`)
            setContent(res.data.data)
            const map: Record<string, string> = {}
            res.data.data.forEach((c: any) => { map[c.key] = c.value })
            setEdits(map)
        } catch {
            showToast("Failed to load content", "error")
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        setSaving(true)
        try {
            // Only send keys that belong to the active section
            const sectionKeys = content.filter(c => c.section === activeSection).map(c => c.key)
            const updates: Record<string, string> = {}
            sectionKeys.forEach(k => { if (edits[k] !== undefined) updates[k] = edits[k] })
            await api.patch(`/site-content`, updates)
            showToast(`${activeSection} content saved!`)
        } catch {
            showToast("Save failed", "error")
        } finally {
            setSaving(false)
        }
    }

    const filtered = content.filter(c => c.section === activeSection)
    const isLong = (key: string) => key.includes("message") || key.includes("tagline") || key.includes("subtitle") || key.includes("address")

    return (
        <div className="space-y-8 pb-12">
            {toast && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"}`}>
                    {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {toast.msg}
                </motion.div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Website Content Editor</h1>
                    <p className="text-muted-foreground text-sm">Edit key text sections on the public website without touching code.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchContent} className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 disabled:opacity-60">
                        <Save size={18} /> {saving ? "Saving..." : "Save Section"}
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-700">
                <Info size={18} className="shrink-0 mt-0.5" />
                <p>Changes take effect immediately on the public website. Use the <strong>Refresh</strong> button to reload latest values from database.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Section Tabs */}
                <div className="md:col-span-1">
                    <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                        {SECTIONS.map(s => (
                            <button key={s.key} onClick={() => setActiveSection(s.key)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeSection === s.key ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-slate-500 hover:bg-slate-50 hover:text-primary"}`}>
                                <span className={activeSection === s.key ? "text-gold-500" : "text-slate-400"}>{s.icon}</span>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Fields */}
                <div className="md:col-span-3">
                    {loading ? (
                        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">Loading content...</div>
                    ) : (
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="font-heading font-black text-primary flex items-center gap-2">
                                <Edit3 size={18} className="text-gold-500" /> Editing: {SECTIONS.find(s => s.key === activeSection)?.label}
                            </h3>
                            {filtered.length === 0 && (
                                <p className="text-slate-400 italic text-sm">No content fields found for this section.</p>
                            )}
                            {filtered.map(item => (
                                <div key={item.key} className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</label>
                                    {isLong(item.key) ? (
                                        <textarea
                                            rows={3}
                                            value={edits[item.key] ?? ""}
                                            onChange={e => setEdits(prev => ({ ...prev, [item.key]: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={edits[item.key] ?? ""}
                                            onChange={e => setEdits(prev => ({ ...prev, [item.key]: e.target.value }))}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        />
                                    )}
                                    <p className="text-[10px] text-slate-300 font-mono">key: {item.key}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
