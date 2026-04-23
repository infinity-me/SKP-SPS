"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "@/lib/api"
import { Plus, Trash2, Edit3, GripVertical, CheckCircle, AlertCircle, Tag, AlertTriangle, ShieldAlert } from "lucide-react"

export default function GalleryCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [newName, setNewName] = useState("")
    const [editId, setEditId] = useState<number | null>(null)
    const [editName, setEditName] = useState("")
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    useEffect(() => { fetchCategories() }, [])

    async function fetchCategories() {
        try {
            const res = await api.get(`/gallery/categories`)
            setCategories(res.data.data)
        } catch {
            showToast("Failed to load categories", "error")
        } finally {
            setLoading(false)
        }
    }

    async function handleAdd() {
        if (!newName.trim()) return
        setAdding(true)
        try {
            await api.post(`/gallery/categories`, { name: newName.trim() })
            setNewName("")
            fetchCategories()
            showToast(`"${newName}" category added!`)
        } catch (err: any) {
            showToast(err?.response?.data?.error || "Failed to add", "error")
        } finally {
            setAdding(false)
        }
    }

    async function handleEdit(id: number) {
        if (!editName.trim()) return
        try {
            const cat = categories.find(c => c.id === id)
            await api.put(`/gallery/categories/${id}`, { name: editName.trim(), order: cat?.order })
            setEditId(null)
            fetchCategories()
            showToast("Category renamed!")
        } catch {
            showToast("Rename failed", "error")
        }
    }

    async function handleDelete(id: number) {
        try {
            const res = await api.delete(`/gallery/categories/${id}`)
            setDeleteConfirm(null)
            fetchCategories()
            showToast(res.data.message)
        } catch (err: any) {
            showToast(err?.response?.data?.error || "Delete failed", "error")
            setDeleteConfirm(null)
        }
    }

    return (
        <div className="space-y-8 pb-12">
            {toast && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"}`}>
                    {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {toast.msg}
                </motion.div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Gallery Categories</h1>
                <p className="text-muted-foreground text-sm">Manage filter categories shown on the public gallery page. Deleting a category moves its photos to &quot;Uncategorized&quot;.</p>
            </div>

            {/* Add New */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-heading font-bold text-primary mb-5 flex items-center gap-2"><Tag size={18} className="text-gold-500" /> Add New Category</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="e.g. NCC, Parade, Republic Day..."
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAdd()}
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                    <button onClick={handleAdd} disabled={adding || !newName.trim()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                        <Plus size={18} /> {adding ? "Adding..." : "Add Category"}
                    </button>
                </div>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-heading font-bold text-primary">All Categories ({categories.length})</h3>
                    <span className="text-xs text-slate-400 font-medium">Photos in deleted categories → Uncategorized</span>
                </div>
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading...</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        <AnimatePresence>
                            {categories.map((cat, i) => (
                                <motion.div key={cat.id}
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors group">
                                    <GripVertical size={16} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                                        <Tag size={14} className="text-primary/40" />
                                    </div>
                                    {editId === cat.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <input autoFocus value={editName} onChange={e => setEditName(e.target.value)}
                                                onKeyDown={e => { if (e.key === "Enter") handleEdit(cat.id); if (e.key === "Escape") setEditId(null) }}
                                                className="flex-1 bg-slate-50 border border-primary/20 rounded-lg px-3 py-1.5 text-sm font-bold text-primary outline-none" />
                                            <button onClick={() => handleEdit(cat.id)} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold">Save</button>
                                            <button onClick={() => setEditId(null)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-500">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-primary">{cat.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">/{cat.slug}</p>
                                        </div>
                                    )}
                                    {cat.slug !== "all" && editId !== cat.id && (
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditId(cat.id); setEditName(cat.name) }}
                                                className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => setDeleteConfirm(cat.id)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                    {cat.slug === "all" && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-2 py-1 bg-slate-50 rounded-lg">Protected</span>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="bg-white p-8 rounded-3xl border-2 border-red-100 shadow-sm">
                <h3 className="font-heading font-black text-red-600 flex items-center gap-2 mb-2"><ShieldAlert size={18} /> Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">These actions are permanent and cannot be undone. Proceed with extreme caution.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 p-4 bg-red-50 border border-red-100 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-red-700">Reset All Categories to Default</p>
                                <p className="text-xs text-red-500 mt-1">All custom categories will be deleted. All photos will be moved to Uncategorized.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-black text-primary mb-2">Delete Category?</h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                Photos in &quot;<strong>{categories.find(c => c.id === deleteConfirm)?.name}</strong>&quot; will be moved to <strong>Uncategorized</strong>. This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">Delete</button>
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-slate-200 font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
