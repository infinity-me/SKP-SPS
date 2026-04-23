"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Plus, Edit2, Trash2, X, Save, Camera, Upload } from "lucide-react"
import { boardTopperService } from "@/lib/api"

const BLANK = { name: "", boardClass: "Class X", year: new Date().getFullYear().toString(), rank: "", marks: "", percentage: "", photo: "" }

function PhotoPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const ref = useRef<HTMLInputElement>(null)
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return
        const reader = new FileReader()
        reader.onload = () => onChange(reader.result as string)
        reader.readAsDataURL(file)
    }
    return (
        <div className="flex flex-col items-center gap-2">
            <div onClick={() => ref.current?.click()}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors">
                {value ? <img src={value} alt="photo" className="w-full h-full object-cover" /> : <Camera size={24} className="text-slate-300" />}
            </div>
            <button type="button" onClick={() => ref.current?.click()}
                className="flex items-center gap-1.5 text-xs font-bold text-primary/60 hover:text-primary transition-colors">
                <Upload size={11} /> Upload Photo
            </button>
            <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
    )
}

export default function ToppersAdminPage() {
    const [toppers, setToppers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState<any>(null)
    const [form, setForm] = useState({ ...BLANK })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => { load() }, [])

    async function load() {
        setLoading(true)
        try {
            const res = await boardTopperService.getAll()
            const raw: any[] = res?.data?.data || []
            raw.sort((a, b) => b.year > a.year ? -1 : 1)
            setToppers(raw)
        } catch (e: any) {
            setError(e?.response?.data?.error || "Failed to load toppers")
        } finally { setLoading(false) }
    }

    function openAdd() { setEditing(null); setForm({ ...BLANK }); setModal(true) }
    function openEdit(t: any) { setEditing(t); setForm({ name: t.name, boardClass: t.boardClass, year: t.year, rank: t.rank || "", marks: t.marks || "", percentage: t.percentage, photo: t.photo || "" }); setModal(true) }

    async function handleDelete(id: number) {
        if (!confirm("Remove this topper from the board results spotlight?")) return
        try { await boardTopperService.delete(id); load() }
        catch { alert("Failed to remove") }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault(); setSaving(true)
        try {
            if (editing) { await boardTopperService.update(editing.id, form) }
            else { await boardTopperService.create(form) }
            setModal(false); load()
        } catch (e: any) { alert(e?.response?.data?.error || "Error saving topper") }
        finally { setSaving(false) }
    }

    // Group by year
    const grouped: Record<string, any[]> = {}
    for (const t of toppers) {
        const yr = t.year || "Unknown"
        if (!grouped[yr]) grouped[yr] = []
        grouped[yr].push(t)
    }
    const years = Object.keys(grouped).sort((a, b) => b > a ? 1 : -1)

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary flex items-center gap-2">
                        <Trophy size={22} className="text-gold-500" /> Board Results Spotlight
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Manage toppers shown in the homepage hero and Hall of Fame. Changes go live instantly.
                    </p>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
                    <Plus size={18} /> Add Topper
                </button>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">{error}</div>}

            {/* List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1,2,3].map(i => <div key={i} className="h-28 bg-slate-50 rounded-2xl animate-pulse" />)}
                </div>
            ) : toppers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 gap-4 text-slate-300">
                    <Trophy size={56} />
                    <p className="font-black text-lg text-slate-400">No Board Toppers Yet</p>
                    <p className="text-sm text-slate-300">Click "Add Topper" to add your first board result achiever.</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {years.map(year => (
                        <div key={year}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Board Results</span>
                                <span className="font-heading font-black text-xl text-primary">{year}</span>
                                <div className="flex-1 h-px bg-slate-100" />
                                <span className="text-xs font-bold text-slate-400">{grouped[year].length} topper{grouped[year].length > 1 ? "s" : ""}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {grouped[year].map((t: any, i: number) => (
                                    <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                        className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:border-gold-500/20 transition-all flex items-center gap-4 group">
                                        {/* Avatar */}
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-primary/5 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                                            {t.photo
                                                ? <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                                                : <span className="font-black text-primary text-xl">{t.name?.[0]}</span>}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-primary text-sm truncate">{t.name}</p>
                                            <p className="text-[10px] font-bold text-gold-600 uppercase tracking-wide mt-0.5">{t.rank || "Topper"}</p>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                {t.marks && <span className="text-[10px] font-bold text-slate-400">{t.marks}</span>}
                                                {t.marks && <span className="w-1 h-1 rounded-full bg-slate-200" />}
                                                <span className="text-[10px] font-bold text-slate-400">{t.boardClass}</span>
                                            </div>
                                        </div>
                                        {/* % + actions */}
                                        <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center shadow-md shadow-gold-500/20">
                                                <span className="text-primary font-black text-[10px] text-center leading-tight">{t.percentage}%</span>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(t)}
                                                    className="w-6 h-6 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                                                    <Edit2 size={11} />
                                                </button>
                                                <button onClick={() => handleDelete(t.id)}
                                                    className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                                    <Trash2 size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setModal(false)} className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto z-10">
                            <div className="flex items-center justify-between p-6 border-b border-slate-50">
                                <h2 className="font-heading font-black text-primary flex items-center gap-2">
                                    <Trophy size={18} className="text-gold-500" />
                                    {editing ? "Edit Topper" : "Add Board Result Topper"}
                                </h2>
                                <button onClick={() => setModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-5">
                                <PhotoPicker value={form.photo} onChange={v => setForm(f => ({ ...f, photo: v }))} />

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Anshu Yadav"
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Board Year</label>
                                        <input required value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2026"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</label>
                                        <input required value={form.boardClass} onChange={e => setForm(f => ({ ...f, boardClass: e.target.value }))} placeholder="Class X"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</label>
                                        <input value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))} placeholder="Joint 1st Rank"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marks</label>
                                        <input value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} placeholder="570/600"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentage (%)</label>
                                    <input required value={form.percentage} onChange={e => setForm(f => ({ ...f, percentage: e.target.value }))} placeholder="95 or 93.33"
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setModal(false)}
                                        className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                    <button type="submit" disabled={saving}
                                        className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-60 flex items-center justify-center gap-2">
                                        {saving ? "Saving..." : <><Save size={16} />{editing ? "Save Changes" : "Add Topper"}</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
