"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { resultService, studentService } from "@/lib/api"
import { Plus, Trash2, Edit2, X, Search, BookOpen, Award, Filter, BarChart2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const SUBJECTS = ["Mathematics","Science","English","Hindi","Social Science","Physics","Chemistry","Biology","Computer Science","Sanskrit","Physical Education","Art","General Knowledge"]
const TERMS = ["Term 1 (April–September)","Term 2 (October–March)","Annual Exam","Half Yearly","Quarterly","Unit Test 1","Unit Test 2","Pre-Board"]

function grade(marks: number, total: number) {
    const pct = (marks / total) * 100
    if (pct >= 91) return { g:"A+", c:"text-emerald-600 bg-emerald-50" }
    if (pct >= 81) return { g:"A",  c:"text-green-600 bg-green-50" }
    if (pct >= 71) return { g:"B+", c:"text-blue-600 bg-blue-50" }
    if (pct >= 61) return { g:"B",  c:"text-indigo-600 bg-indigo-50" }
    if (pct >= 51) return { g:"C",  c:"text-amber-600 bg-amber-50" }
    if (pct >= 33) return { g:"D",  c:"text-orange-600 bg-orange-50" }
    return { g:"F", c:"text-red-600 bg-red-50" }
}

const BLANK = { studentId: "", subject: "", marks: "", total: "100", term: TERMS[0] }

export default function AdminResultsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState<any>(null)
    const [form, setForm] = useState<any>(BLANK)
    const [saving, setSaving] = useState(false)
    const [filterStudent, setFilterStudent] = useState("")
    const [filterTerm, setFilterTerm] = useState("All")
    const [searchStudents, setSearchStudents] = useState("")
    const [toast, setToast] = useState<{msg:string;type:"success"|"error"}|null>(null)
    const [bulkMode, setBulkMode] = useState(false)
    const [bulkStudentId, setBulkStudentId] = useState("")
    const [bulkTerm, setBulkTerm] = useState(TERMS[0])
    const [bulkRows, setBulkRows] = useState(SUBJECTS.slice(0,6).map(s => ({subject:s, marks:"", total:"100"})))

    const showToast = (msg: string, type: "success"|"error" = "success") => {
        setToast({msg, type}); setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => { loadAll() }, [])

    async function loadAll() {
        try {
            const [rRes, sRes] = await Promise.all([resultService.getAll(), studentService.getAll()])
            setResults(rRes.data.data)
            setStudents(sRes.data.data)
        } catch { showToast("Failed to load data", "error") }
        finally { setLoading(false) }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setSaving(true)
        try {
            editing
                ? await resultService.update(editing.id, { ...form, marks: Number(form.marks), total: Number(form.total) })
                : await resultService.create({ ...form, studentId: Number(form.studentId), marks: Number(form.marks), total: Number(form.total) })
            setModal(false); setEditing(null); setForm(BLANK); loadAll()
            showToast(editing ? "Result updated!" : "Result added!")
        } catch { showToast("Error saving result", "error") }
        finally { setSaving(false) }
    }

    async function handleBulkSubmit(e: React.FormEvent) {
        e.preventDefault(); setSaving(true)
        try {
            const validRows = bulkRows.filter(r => r.marks !== "")
            await Promise.all(validRows.map(r =>
                resultService.create({ studentId: Number(bulkStudentId), subject: r.subject, marks: Number(r.marks), total: Number(r.total), term: bulkTerm })
            ))
            setBulkMode(false); loadAll()
            showToast(`${validRows.length} results uploaded!`)
        } catch { showToast("Bulk upload failed", "error") }
        finally { setSaving(false) }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this result?")) return
        await resultService.delete(id); loadAll(); showToast("Result deleted")
    }

    function openEdit(r: any) {
        setEditing(r)
        setForm({ studentId: r.studentId, subject: r.subject, marks: r.marks, total: r.total, term: r.term })
        setModal(true)
    }

    const terms = ["All", ...Array.from(new Set(results.map(r => r.term)))]
    const filteredResults = results.filter(r => {
        const name = r.student?.user?.name || ""
        return (filterTerm === "All" || r.term === filterTerm) &&
               (filterStudent === "" || String(r.studentId) === filterStudent || name.toLowerCase().includes(filterStudent.toLowerCase()))
    })

    // Group filtered results by student
    const grouped: Record<string, any[]> = {}
    filteredResults.forEach(r => {
        const key = r.studentId
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(r)
    })

    const studentList = students.filter(s =>
        (s.user?.name || "").toLowerCase().includes(searchStudents.toLowerCase()) ||
        (s.admissionNo || "").toLowerCase().includes(searchStudents.toLowerCase())
    )

    return (
        <div className="space-y-6 pb-12">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                        className={cn("fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-bold", toast.type === "success" ? "bg-emerald-600" : "bg-red-500")}>
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">Results & Report Cards</h1>
                    <p className="text-muted-foreground text-sm">{results.length} total records across {Object.keys(grouped).length} students</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setBulkMode(true)} className="flex items-center gap-2 border border-primary text-primary px-5 py-3 rounded-2xl font-bold hover:bg-primary/5 transition-all">
                        <BarChart2 size={16}/> Bulk Upload
                    </button>
                    <button onClick={() => { setEditing(null); setForm(BLANK); setModal(true) }} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
                        <Plus size={16}/> Add Result
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
                    <input type="text" placeholder="Filter by student name or ID..." value={filterStudent} onChange={e => setFilterStudent(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10"/>
                </div>
                <select value={filterTerm} onChange={e => setFilterTerm(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 outline-none appearance-none">
                    {terms.map(t => <option key={t}>{t}</option>)}
                </select>
                <p className="text-xs font-bold text-slate-400 whitespace-nowrap self-center">{filteredResults.length} results</p>
            </div>

            {/* Results grouped by student */}
            {loading ? (
                <div className="space-y-4">{Array(3).fill(0).map((_,i) => <div key={i} className="h-40 bg-slate-50 rounded-2xl animate-pulse"/>)}</div>
            ) : Object.keys(grouped).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-300">
                    <BookOpen size={48}/>
                    <p className="font-bold italic text-lg">No results found. Add results to get started.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([studentId, sResults]) => {
                        const student = sResults[0]?.student
                        const totalMarks = sResults.reduce((a, r) => a + r.marks, 0)
                        const totalMax = sResults.reduce((a, r) => a + r.total, 0)
                        const pct = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0
                        const { g, c } = grade(totalMarks, totalMax)
                        return (
                            <motion.div key={studentId} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                {/* Student Header */}
                                <div className="flex items-center justify-between p-5 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex-shrink-0">
                                            {student?.photo ? <img src={student.photo} className="w-full h-full object-cover"/> :
                                            <div className="w-full h-full flex items-center justify-center font-black text-primary/40">{(student?.user?.name||"?")[0]}</div>}
                                        </div>
                                        <div>
                                            <p className="font-black text-primary">{student?.user?.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{student?.class} – Section {student?.section} · {sResults[0]?.term}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs font-bold text-slate-400">Total Score</p>
                                            <p className="text-lg font-black text-primary">{totalMarks}/{totalMax} <span className="text-sm text-slate-400">({pct}%)</span></p>
                                        </div>
                                        <span className={cn("px-3 py-1.5 rounded-xl text-sm font-black", c)}>{g}</span>
                                    </div>
                                </div>
                                {/* Subjects Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead><tr className="bg-slate-50/50">
                                            {["Subject","Marks","Out of","Percentage","Grade","Actions"].map(h => (
                                                <th key={h} className="px-5 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {sResults.map(r => {
                                                const pct2 = Math.round((r.marks / r.total) * 100)
                                                const { g: g2, c: c2 } = grade(r.marks, r.total)
                                                return (
                                                    <tr key={r.id} className="hover:bg-slate-50/50 group transition-colors">
                                                        <td className="px-5 py-3 font-bold text-sm text-primary">{r.subject}</td>
                                                        <td className="px-5 py-3 text-sm font-black text-primary">{r.marks}</td>
                                                        <td className="px-5 py-3 text-sm text-slate-400">{r.total}</td>
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 max-w-20 bg-slate-100 rounded-full h-1.5">
                                                                    <div className="h-full rounded-full bg-primary transition-all" style={{width:`${pct2}%`}}/>
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-500">{pct2}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3"><span className={cn("px-2 py-1 rounded-lg text-xs font-black", c2)}>{g2}</span></td>
                                                        <td className="px-5 py-3">
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => openEdit(r)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Edit2 size={13}/></button>
                                                                <button onClick={() => handleDelete(r.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13}/></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {/* ADD/EDIT MODAL */}
            <AnimatePresence>
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-heading font-black text-primary">{editing ? "Edit Result" : "Add Result"}</h3>
                                <p className="text-sm text-slate-400">Enter subject marks details</p>
                            </div>
                            <button onClick={() => setModal(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {!editing && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14}/>
                                        <input placeholder="Search student..." value={searchStudents} onChange={e => setSearchStudents(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none"/>
                                    </div>
                                    {searchStudents && (
                                        <div className="max-h-36 overflow-y-auto border border-slate-100 rounded-xl shadow-sm">
                                            {studentList.slice(0,5).map(s => (
                                                <button key={s.id} type="button" onClick={() => { setForm((f: any) => ({...f, studentId: String(s.id)})); setSearchStudents(s.user?.name||"") }}
                                                    className={cn("w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors", form.studentId === String(s.id) ? "bg-primary/5 font-bold text-primary" : "text-slate-600")}>
                                                    {s.user?.name} <span className="text-[10px] text-slate-400 ml-1">{s.class} {s.section}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {form.studentId && <p className="text-xs text-emerald-600 font-bold">✓ Student selected (ID: {form.studentId})</p>}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                                <select value={form.subject} onChange={e => setForm((f: any) => ({...f, subject: e.target.value}))} required
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-primary outline-none appearance-none">
                                    <option value="">Select subject</option>
                                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marks Obtained</label>
                                    <input required type="number" min="0" placeholder="e.g. 87" value={form.marks} onChange={e => setForm((f: any) => ({...f, marks: e.target.value}))}
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Out of (Max)</label>
                                    <input required type="number" min="1" value={form.total} onChange={e => setForm((f: any) => ({...f, total: e.target.value}))}
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10"/>
                                </div>
                            </div>
                            {form.marks && form.total && (
                                <div className={cn("flex items-center gap-2 p-3 rounded-xl text-sm font-bold", grade(Number(form.marks), Number(form.total)).c)}>
                                    <Award size={16}/> Preview: {Math.round((Number(form.marks)/Number(form.total))*100)}% — Grade {grade(Number(form.marks), Number(form.total)).g}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam / Term</label>
                                <select value={form.term} onChange={e => setForm((f: any) => ({...f, term: e.target.value}))} required
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-primary outline-none appearance-none">
                                    {TERMS.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModal(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-60">
                                    {saving ? "Saving..." : editing ? "Save Changes" : "Add Result"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>

            {/* BULK UPLOAD MODAL */}
            <AnimatePresence>
            {bulkMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                            <div>
                                <h3 className="text-xl font-heading font-black text-primary">Bulk Mark Entry</h3>
                                <p className="text-sm text-slate-400">Upload marks for all subjects at once</p>
                            </div>
                            <button onClick={() => setBulkMode(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleBulkSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</label>
                                    <select value={bulkStudentId} onChange={e => setBulkStudentId(e.target.value)} required
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-primary outline-none appearance-none">
                                        <option value="">Select student</option>
                                        {students.map(s => <option key={s.id} value={s.id}>{s.user?.name} ({s.class} {s.section})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam / Term</label>
                                    <select value={bulkTerm} onChange={e => setBulkTerm(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-primary outline-none appearance-none">
                                        {TERMS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-slate-100">
                                <table className="w-full text-left">
                                    <thead><tr className="bg-slate-50">
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Marks</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Max</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {bulkRows.map((row, i) => {
                                            const p = row.marks !== "" ? Math.round((Number(row.marks)/Number(row.total))*100) : null
                                            const { g: bg, c: bc } = p !== null ? grade(Number(row.marks), Number(row.total)) : { g: "—", c: "text-slate-300 bg-slate-50" }
                                            return (
                                                <tr key={i}>
                                                    <td className="px-4 py-2">
                                                        <select value={row.subject} onChange={e => setBulkRows(rows => rows.map((r,j) => j===i ? {...r, subject:e.target.value} : r))}
                                                            className="w-full bg-transparent text-sm font-bold text-primary outline-none appearance-none">
                                                            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input type="number" min="0" placeholder="—" value={row.marks}
                                                            onChange={e => setBulkRows(rows => rows.map((r,j) => j===i ? {...r, marks:e.target.value} : r))}
                                                            className="w-20 bg-slate-50 rounded-lg px-2 py-1.5 text-sm font-bold text-primary outline-none text-center"/>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input type="number" min="1" value={row.total}
                                                            onChange={e => setBulkRows(rows => rows.map((r,j) => j===i ? {...r, total:e.target.value} : r))}
                                                            className="w-20 bg-slate-50 rounded-lg px-2 py-1.5 text-sm text-slate-500 outline-none text-center"/>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <span className={cn("px-2 py-1 rounded-lg text-xs font-black", bc)}>{bg}</span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" onClick={() => setBulkRows(r => [...r, {subject: SUBJECTS[0], marks:"", total:"100"}])}
                                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                <Plus size={13}/> Add subject row
                            </button>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setBulkMode(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" disabled={saving || !bulkStudentId} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-60">
                                    {saving ? "Uploading..." : "Upload All Marks"}
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
