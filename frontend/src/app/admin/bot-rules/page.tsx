"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { botRuleService } from "@/lib/api"
import {
    MessageSquare, Plus, Trash2, ToggleLeft, ToggleRight,
    Edit2, Save, X, Sparkles, Search
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function BotRulesPage() {
    const [rules, setRules] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [form, setForm] = useState({
        trigger: "",
        response: "",
        category: "General",
        language: "Bilingual"
    })
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => { load() }, [])

    const load = async () => {
        try {
            const res = await botRuleService.getAll()
            setRules(res.data.data)
        } catch (e) { console.error(e) }
        finally { setIsLoading(false) }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editingId) {
                await botRuleService.update(editingId, form)
            } else {
                await botRuleService.create(form)
            }
            resetForm()
            load()
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const resetForm = () => {
        setForm({ trigger: "", response: "", category: "General", language: "Bilingual" })
        setShowForm(false)
        setEditingId(null)
    }

    const handleEdit = (rule: any) => {
        setForm({
            trigger: rule.trigger,
            response: rule.response,
            category: rule.category,
            language: rule.language
        })
        setEditingId(rule.id)
        setShowForm(true)
    }

    const toggleActive = async (id: number, current: boolean) => {
        await botRuleService.update(id, { isActive: !current })
        load()
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this rule?")) return
        await botRuleService.delete(id)
        load()
    }

    const filteredRules = rules.filter(r => 
        r.trigger.toLowerCase().includes(search.toLowerCase()) || 
        r.response.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-primary font-heading flex items-center gap-3">
                        <MessageSquare className="text-gold-500" size={28} />
                        Bot Knowledge Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        "Train" your bot by adding keywords and custom responses. Zero AI, total control.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    {editingId ? "Edit Rule" : "Add New Rule"}
                </button>
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-black text-primary text-lg">{editingId ? "Edit Rule" : "Create Auto-Response"}</h2>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Triggers */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Triggers (Comma separated keywords)</label>
                                <input
                                    required
                                    type="text"
                                    value={form.trigger}
                                    onChange={e => setForm(f => ({ ...f, trigger: e.target.value }))}
                                    placeholder="e.g. fees, paisa, amount, shulk"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-primary text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all"
                                />
                            </div>

                            {/* Category & Language */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                                    <select 
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-primary text-sm outline-none"
                                    >
                                        <option>General</option>
                                        <option>Academic</option>
                                        <option>Administrative</option>
                                        <option>Admission</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Language</label>
                                    <select 
                                        value={form.language}
                                        onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-primary text-sm outline-none"
                                    >
                                        <option>Bilingual</option>
                                        <option>English</option>
                                        <option>Hindi</option>
                                    </select>
                                </div>
                            </div>

                            {/* Response */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bot Response</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={form.response}
                                    onChange={e => setForm(f => ({ ...f, response: e.target.value }))}
                                    placeholder="Enter what the bot should say when these triggers are matched..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-primary text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all resize-none"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? "Saving..." : <><Save size={18} /> {editingId ? "Update Rule" : "Save Rule"}</>}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rules List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{filteredRules.length} Active Rule{rules.length !== 1 ? "s" : ""}</p>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search keywords..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-full text-xs outline-none focus:ring-2 focus:ring-primary/5 shadow-sm"
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    <AnimatePresence>
                        {filteredRules.map(r => (
                            <motion.div
                                key={r.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "p-8 transition-colors hover:bg-slate-50/50 group",
                                    !r.isActive && "opacity-40"
                                )}
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="space-y-3 flex-grow">
                                        {/* Triggers */}
                                        <div className="flex flex-wrap gap-2">
                                            {r.trigger.split(',').map((t: string, idx: number) => (
                                                <span key={idx} className="px-3 py-1 bg-gold-500/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-gold-500/20">
                                                    {t.trim()}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Response */}
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="text-gold-500" size={12} />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bot Response</span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                                                {r.response}
                                            </p>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Save size={12}/> {r.category}</span>
                                            <span className="flex items-center gap-1.5"><Sparkles size={12}/> {r.language}</span>
                                            <span>Updated {new Date(r.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="shrink-0 flex items-center gap-2">
                                        <button
                                            onClick={() => toggleActive(r.id, r.isActive)}
                                            className={cn(
                                                "transition-colors",
                                                r.isActive ? "text-emerald-500" : "text-slate-300"
                                            )}
                                        >
                                            {r.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(r)}
                                            className="p-2 text-slate-300 hover:text-primary hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {!isLoading && filteredRules.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold italic">
                        {search ? "No rules match your search." : "No custom rules yet. Add your first rule!"}
                    </div>
                )}
                {isLoading && (
                    <div className="py-20 text-center text-slate-400 font-bold italic animate-pulse">Loading Rules...</div>
                )}
            </div>
        </div>
    )
}
