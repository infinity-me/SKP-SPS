"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { studentService } from "@/lib/api"
import { Plus, Search, Edit2, Trash2, X, Upload, Camera, LayoutGrid, List, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const CLASSES = ["All","Nursery","LKG","UKG","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII","Class IX","Class X","Class XI","Class XII"]
const SECTIONS = ["All","A","B","C","D"]
const BLANK_FORM = { firstName:"", lastName:"", admissionNo:"", class:"", section:"A", parentName:"", phone:"", photo:"", isTopper:false, topperYear:"", topperPercent:"" }

function ImageUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const ref = useRef<HTMLInputElement>(null)
    const [urlMode, setUrlMode] = useState(!value?.startsWith("data:"))

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => onChange(reader.result as string)
        reader.readAsDataURL(file)
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setUrlMode(true)} className={cn("flex-1 py-2 rounded-xl text-xs font-bold transition-all", urlMode ? "bg-primary text-white" : "bg-slate-50 text-slate-400")}>URL</button>
                <button type="button" onClick={() => setUrlMode(false)} className={cn("flex-1 py-2 rounded-xl text-xs font-bold transition-all", !urlMode ? "bg-primary text-white" : "bg-slate-50 text-slate-400")}>Upload File</button>
            </div>
            {urlMode ? (
                <input type="url" placeholder="https://example.com/photo.jpg" value={value?.startsWith("data:") ? "" : value} onChange={e => onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
            ) : (
                <div onClick={() => ref.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                    {value?.startsWith("data:") ? (
                        <img src={value} alt="preview" className="h-20 w-20 object-cover rounded-full mx-auto mb-2" />
                    ) : (
                        <Camera size={32} className="mx-auto text-slate-300 mb-2" />
                    )}
                    <p className="text-xs text-slate-400 font-medium">Click to upload photo</p>
                    <input ref={ref} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </div>
            )}
        </div>
    )
}

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeClass, setActiveClass] = useState("All")
    const [activeSection, setActiveSection] = useState("All")
    const [viewMode, setViewMode] = useState<"grid"|"list">("grid")
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState<any>(null)
    const [form, setForm] = useState(BLANK_FORM)
    const [saving, setSaving] = useState(false)

    useEffect(() => { load() }, [])

    async function load() {
        try {
            const res = await studentService.getAll()
            setStudents(res.data.data)
        } catch { } finally { setLoading(false) }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            editing ? await studentService.update(editing.id, form) : await studentService.create(form)
            setModal(false); setEditing(null); setForm(BLANK_FORM); load()
        } catch { alert("Error saving") } finally { setSaving(false) }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this student?")) return
        await studentService.delete(id); load()
    }

    function openModal(s: any = null) {
        setEditing(s)
        if (s) {
            const [firstName, ...rest] = (s.user?.name || "").split(" ")
            setForm({ ...BLANK_FORM, ...s, firstName, lastName: rest.join(" "), phone: s.user?.phone || "" })
        } else { setForm(BLANK_FORM) }
        setModal(true)
    }

    const filtered = students.filter(s => {
        const name = s.user?.name || ""
        const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo?.toLowerCase().includes(search.toLowerCase())
        const matchClass = activeClass === "All" || s.class === activeClass
        const matchSection = activeSection === "All" || s.section === activeSection
        return matchSearch && matchClass && matchSection
    })

    // Group by class for stats
    const classGroups = CLASSES.slice(1).map(c => ({ name: c, count: students.filter(s => s.class === c).length })).filter(g => g.count > 0)

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">Students Directory</h1>
                    <p className="text-muted-foreground text-sm">{students.length} total students enrolled</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
                    <Plus size={18} /> Add Student
                </button>
            </div>

            {/* Class Stats Bar */}
            {classGroups.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {classGroups.map(g => (
                        <button key={g.name} onClick={() => setActiveClass(g.name === activeClass ? "All" : g.name)}
                            className={cn("flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all", activeClass === g.name ? "bg-primary text-white shadow-lg shadow-primary/10" : "bg-white border border-slate-100 text-slate-600 hover:border-primary/30")}>
                            {g.name} <span className={cn("ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]", activeClass === g.name ? "bg-white/20" : "bg-slate-100")}>{g.count}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search name or admission no..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <select value={activeClass} onChange={e => setActiveClass(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 outline-none appearance-none">
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={activeSection} onChange={e => setActiveSection(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 outline-none appearance-none">
                    {SECTIONS.map(s => <option key={s}>Section: {s}</option>)}
                </select>
                <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                    <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white shadow text-primary" : "text-slate-400 hover:text-primary")}><LayoutGrid size={16}/></button>
                    <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white shadow text-primary" : "text-slate-400 hover:text-primary")}><List size={16}/></button>
                </div>
                <p className="text-xs font-bold text-slate-400 whitespace-nowrap">{filtered.length} shown</p>
            </div>

            {/* GRID VIEW */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {loading ? Array(10).fill(0).map((_, i) => <div key={i} className="h-52 bg-slate-50 rounded-2xl animate-pulse" />) :
                    filtered.map((s, i) => (
                        <motion.div key={s.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.03 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
                            <div className="relative aspect-square bg-slate-50">
                                {s.photo ? (
                                    <img src={s.photo} alt={s.user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
                                        {(s.user?.name||"?")[0]}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button onClick={() => openModal(s)} className="p-2 bg-white rounded-xl text-primary hover:bg-gold-500 transition-colors"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDelete(s.id)} className="p-2 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                                </div>
                                {s.isTopper && <span className="absolute top-2 right-2 bg-gold-500 text-primary text-[9px] font-black px-2 py-0.5 rounded-full">⭐ TOPPER</span>}
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-black text-primary truncate">{s.user?.name || "—"}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{s.class} – Sec {s.section}</p>
                                <p className="text-[10px] font-mono text-slate-300">{s.admissionNo}</p>
                            </div>
                        </motion.div>
                    ))}
                    {!loading && filtered.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400 italic">No students found. Try adjusting filters.</div>
                    )}
                </div>
            )}

            {/* LIST VIEW */}
            {viewMode === "list" && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="bg-slate-50/50">
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission No</th>
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class / Sec</th>
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                                <th className="px-6 py-3"></th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? <tr><td colSpan={6} className="py-12 text-center text-slate-400">Loading...</td></tr> :
                                filtered.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                                                    {s.photo ? <img src={s.photo} className="w-full h-full object-cover" /> :
                                                    <div className="w-full h-full flex items-center justify-center font-black text-slate-300 text-sm">{(s.user?.name||"?")[0]}</div>}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-primary">{s.user?.name || "—"}</p>
                                                    {s.isTopper && <span className="text-[9px] text-gold-500 font-black">⭐ TOPPER</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-xs font-mono text-slate-500">{s.admissionNo}</td>
                                        <td className="px-6 py-3 text-sm font-bold text-slate-600">{s.class} – {s.section}</td>
                                        <td className="px-6 py-3 text-sm text-slate-500">{s.parentName}</td>
                                        <td className="px-6 py-3 text-sm text-slate-500">{s.phone}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openModal(s)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Edit2 size={15}/></button>
                                                <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && filtered.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-slate-400 italic">No students found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL */}
            <AnimatePresence>
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-xl font-heading font-black text-primary">{editing ? "Edit Student" : "Add New Student"}</h3>
                                <p className="text-sm text-slate-400">Fill in student details below</p>
                            </div>
                            <button onClick={() => setModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Photo Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Photo</label>
                                <ImageUploader value={form.photo} onChange={v => setForm(f => ({...f, photo: v}))} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[["firstName","First Name"],["lastName","Last Name"],["admissionNo","Admission No"],["parentName","Parent/Guardian"],["phone","Phone Number"]].map(([k, l]) => (
                                    <div key={k} className={cn("space-y-2", k === "parentName" || k === "phone" ? "" : "")}>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{l}</label>
                                        <input required={k !== "phone"} value={(form as any)[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</label>
                                    <select value={form.class} onChange={e => setForm(f => ({...f, class: e.target.value}))} required
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-primary outline-none appearance-none">
                                        <option value="">Select class</option>
                                        {CLASSES.slice(1).map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section</label>
                                    <select value={form.section} onChange={e => setForm(f => ({...f, section: e.target.value}))}
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-primary outline-none appearance-none">
                                        {["A","B","C","D"].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={form.isTopper} onChange={e => setForm(f => ({...f, isTopper: e.target.checked}))}
                                        className="w-5 h-5 rounded-md text-primary" />
                                    <span className="text-sm font-bold text-primary">Mark as Topper (Hall of Fame)</span>
                                </label>
                                {form.isTopper && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Topper Year</label>
                                            <input placeholder="2024-25" value={form.topperYear} onChange={e => setForm(f => ({...f, topperYear: e.target.value}))}
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score / %</label>
                                            <input placeholder="96.8%" value={form.topperPercent} onChange={e => setForm(f => ({...f, topperPercent: e.target.value}))}
                                                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModal(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-60">
                                    {saving ? "Saving..." : editing ? "Save Changes" : "Create Student"}
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
