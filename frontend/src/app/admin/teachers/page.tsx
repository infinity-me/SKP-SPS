"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { teacherService, teacherApplicationService } from "@/lib/api"
import { Plus, Search, Edit2, Trash2, X, Camera, Phone, GraduationCap, Clock, CheckCircle, LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

const DESIGNATIONS = ["Principal","Vice Principal","PGT - Mathematics","PGT - Science","PGT - English","PGT - Hindi","PGT - Social Science","TGT - Mathematics","TGT - Science","TGT - English","TGT - Hindi","PRT","Art Teacher","PT Teacher","Computer Teacher","Librarian","Admin Staff"]
const BLANK = { name:"", staffId:"", designation:"", subject:"", phone:"", email:"", photo:"", experience:"" }

function PhotoUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const ref = useRef<HTMLInputElement>(null)
    const [mode, setMode] = useState<"url"|"file">(value?.startsWith("data:") ? "file" : "url")

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return
        const reader = new FileReader()
        reader.onload = () => onChange(reader.result as string)
        reader.readAsDataURL(file)
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setMode("url")} className={cn("flex-1 py-2 rounded-xl text-xs font-bold", mode==="url"?"bg-primary text-white":"bg-slate-50 text-slate-400")}>Image URL</button>
                <button type="button" onClick={() => setMode("file")} className={cn("flex-1 py-2 rounded-xl text-xs font-bold", mode==="file"?"bg-primary text-white":"bg-slate-50 text-slate-400")}>Upload File</button>
            </div>
            {mode === "url" ? (
                <input type="url" placeholder="https://example.com/photo.jpg" value={value?.startsWith("data:") ? "" : (value || "")} onChange={e => onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
            ) : (
                <div onClick={() => ref.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                    {value?.startsWith("data:") || (value && !value.startsWith("data:") && value.trim()) ? (
                        <img src={value} alt="preview" className="h-24 w-24 object-cover rounded-full mx-auto mb-2 border-4 border-white shadow-lg" />
                    ) : <Camera size={36} className="mx-auto text-slate-200 mb-2" />}
                    <p className="text-xs text-slate-400 font-medium">Click to upload or drag photo here</p>
                    <input ref={ref} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </div>
            )}
        </div>
    )
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([])
    const [apps, setApps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterDesignation, setFilterDesignation] = useState("All")
    const [viewMode, setViewMode] = useState<"grid"|"list">("grid")
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState<any>(null)
    const [form, setForm] = useState(BLANK)
    const [saving, setSaving] = useState(false)
    const [tab, setTab] = useState<"staff"|"applications">("staff")

    useEffect(() => { load() }, [])

    async function load() {
        try {
            const [tRes, aRes] = await Promise.all([teacherService.getAll(), teacherApplicationService.getAll()])
            setTeachers(tRes.data.data)
            setApps(aRes.data.data)
        } catch { } finally { setLoading(false) }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setSaving(true)
        try {
            editing ? await teacherService.update(editing.id, form) : await teacherService.create(form)
            setModal(false); setEditing(null); setForm(BLANK); load()
        } catch { alert("Error saving teacher") } finally { setSaving(false) }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this teacher?")) return
        try { await teacherService.delete(id); load() } catch { alert("Error deleting teacher") }
    }

    async function updateAppStatus(id: number, status: string) {
        try { await teacherApplicationService.update(id, { status }); load() } catch { alert("Error") }
    }

    const designations = ["All", ...Array.from(new Set(teachers.map((t:any) => t.designation).filter(Boolean)))]

    const filtered = teachers.filter(t => {
        const name = t.user?.name || ""
        return (name.toLowerCase().includes(search.toLowerCase()) || t.staffId?.toLowerCase().includes(search.toLowerCase())) &&
            (filterDesignation === "All" || t.designation === filterDesignation)
    })

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">Staff Directory</h1>
                    <p className="text-muted-foreground text-sm">{teachers.length} faculty members · {apps.filter((a:any)=>a.status==="pending").length} pending applications</p>
                </div>
                <button onClick={() => { setEditing(null); setForm(BLANK); setModal(true) }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
                    <Plus size={18} /> Add Teacher
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white border border-slate-100 p-1 rounded-2xl w-fit shadow-sm">
                {[["staff","Faculty Staff"],["applications","Applications"]].map(([v, l]) => (
                    <button key={v} onClick={() => setTab(v as any)}
                        className={cn("px-5 py-2.5 rounded-xl text-sm font-bold transition-all", tab===v?"bg-primary text-white shadow-lg shadow-primary/10":"text-slate-500 hover:text-primary")}>
                        {l} {v === "applications" && apps.filter((a:any)=>a.status==="pending").length > 0 && (
                            <span className="ml-1.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                                {apps.filter((a:any)=>a.status==="pending").length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {tab === "staff" && (
                <>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search name or staff ID..." value={search} onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10" />
                        </div>
                        <select value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)}
                            className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 outline-none appearance-none">
                            {designations.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                            <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode==="grid"?"bg-white shadow text-primary":"text-slate-400")}><LayoutGrid size={16}/></button>
                            <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode==="list"?"bg-white shadow text-primary":"text-slate-400")}><List size={16}/></button>
                        </div>
                        <p className="text-xs font-bold text-slate-400 whitespace-nowrap self-center">{filtered.length} shown</p>
                    </div>

                    {/* Grid View */}
                    {viewMode === "grid" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {loading ? Array(6).fill(0).map((_,i) => <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse" />) :
                            filtered.map((t, i) => (
                                <motion.div key={t.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                                    <div className="relative h-36 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                        {t.photo ? (
                                            <img src={t.photo} alt={t.user?.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center text-4xl font-black text-white/60">
                                                {(t.user?.name||"?")[0]}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-center justify-center gap-3">
                                            <button onClick={() => { setEditing(t); setForm({...BLANK, ...t, name:t.user?.name||"", phone:t.user?.phone||"", email:t.user?.email||""}); setModal(true) }}
                                                className="p-2 bg-white rounded-xl text-primary hover:bg-gold-500 transition-colors"><Edit2 size={15}/></button>
                                            <button onClick={() => handleDelete(t.id)}
                                                className="p-2 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={15}/></button>
                                        </div>
                                    </div>
                                    <div className="p-5 text-center">
                                        <h3 className="font-heading font-black text-primary text-base">{t.user?.name}</h3>
                                        <p className="text-[10px] text-gold-500 font-black uppercase tracking-widest mt-1">{t.designation}</p>
                                        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-slate-400 font-bold">
                                            <span className="flex items-center gap-1"><GraduationCap size={11}/> {t.staffId}</span>
                                            {t.subject && <span className="flex items-center gap-1">📚 {t.subject}</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {!loading && filtered.length === 0 && <div className="col-span-full py-20 text-center text-slate-400 italic">No faculty found.</div>}
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === "list" && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead><tr className="bg-slate-50/50">
                                    {["Teacher","Staff ID","Designation","Subject","Actions"].map(h => (
                                        <th key={h} className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filtered.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50/50 group">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                                                        {t.photo ? <img src={t.photo} className="w-full h-full object-cover" /> :
                                                        <div className="w-full h-full flex items-center justify-center font-black text-primary/40">{(t.user?.name||"?")[0]}</div>}
                                                    </div>
                                                    <p className="font-bold text-sm text-primary">{t.user?.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-xs font-mono text-slate-500">{t.staffId}</td>
                                            <td className="px-6 py-3 text-xs text-gold-600 font-bold">{t.designation}</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">{t.subject || "—"}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditing(t); setForm({...BLANK,...t,name:t.user?.name||"",phone:t.user?.phone||"",email:t.user?.email||""}); setModal(true) }}
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Edit2 size={15}/></button>
                                                    <button onClick={() => handleDelete(t.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Applications Tab */}
            {tab === "applications" && (
                <div className="space-y-4">
                    {apps.map((app: any) => (
                        <div key={app.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-black text-primary">{app.name}</p>
                                <p className="text-sm text-slate-500">{app.subject} · {app.experience}</p>
                                <p className="text-xs text-slate-400">{app.email} · {app.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    app.status==="Approved"?"bg-emerald-50 text-emerald-600":app.status==="Rejected"?"bg-red-50 text-red-500":"bg-amber-50 text-amber-600")}>
                                    {app.status || "Pending"}
                                </span>
                                {app.status !== "Approved" && <button onClick={() => updateAppStatus(app.id, "Approved")} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">Approve</button>}
                                {app.status !== "Rejected" && <button onClick={() => updateAppStatus(app.id, "Rejected")} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all">Reject</button>}
                            </div>
                        </div>
                    ))}
                    {apps.length === 0 && <div className="py-20 text-center text-slate-400 italic">No applications yet.</div>}
                </div>
            )}

            {/* ADD/EDIT MODAL */}
            <AnimatePresence>
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="text-xl font-heading font-black text-primary">{editing ? "Edit Teacher" : "Add Teacher"}</h3>
                            <button onClick={() => setModal(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photo</label>
                                <PhotoUploader value={form.photo} onChange={v => setForm(f => ({...f, photo: v}))} />
                            </div>
                            {[["name","Full Name",true],["staffId","Staff ID",true],["phone","Phone Number",false],["email","Email Address",false],["subject","Subject Taught",false],["experience","Experience (e.g. 5 Years)",false]].map(([k, l, req]) => (
                                <div key={k as string} className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{l}</label>
                                    <input required={!!req} value={(form as any)[k as string]} onChange={e => setForm(f => ({...f, [k as string]: e.target.value}))}
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                </div>
                            ))}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                                <select value={form.designation} onChange={e => setForm(f => ({...f, designation: e.target.value}))}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-primary outline-none appearance-none">
                                    <option value="">Select designation</option>
                                    {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModal(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-xl shadow-primary/20">
                                    {saving ? "Saving..." : editing ? "Save Changes" : "Add Teacher"}
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
