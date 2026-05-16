"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { botRuleService, chatbotSettingsService } from "@/lib/api"
import {
    MessageSquare, Plus, Trash2, ToggleLeft, ToggleRight,
    Edit2, Save, X, Sparkles, Search, Bot, Settings,
    Phone, Mail, GraduationCap, User, Info, Zap, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "rules" | "settings"

const SETTINGS_FIELDS = [
    { key: "schoolFullName", label: "School Full Name", icon: <GraduationCap size={16} />, placeholder: "SKP Sainik Public School, Manihari, Kannauj, UP", multiline: false },
    { key: "founded", label: "Founded / Established By", icon: <Info size={16} />, placeholder: "2009 by Shri Satyadev Kushwaha", multiline: false },
    { key: "affiliation", label: "Board Affiliation", icon: <Info size={16} />, placeholder: "CBSE", multiline: false },
    { key: "principal", label: "Principal Name", icon: <User size={16} />, placeholder: "Mrs. Shobha Sharma", multiline: false },
    { key: "phone", label: "Contact Phone", icon: <Phone size={16} />, placeholder: "+91 9454331861", multiline: false },
    { key: "email", label: "Contact Email", icon: <Mail size={16} />, placeholder: "skpspsmanihari09@gmail.com", multiline: false },
    { key: "admissionInfo", label: "Admission Info (shown to users)", icon: <Info size={16} />, placeholder: "Admissions open for 2026-27: Classes Nursery to XII", multiline: false },
    { key: "admissionPage", label: "Admission Page URL", icon: <Info size={16} />, placeholder: "skpsps.in/admission", multiline: false },
    { key: "botPersonality", label: "Bot Personality / Tone", icon: <Bot size={16} />, placeholder: "Friendly, professional, and disciplined — like a helpful school counsellor.", multiline: true },
    { key: "customSystemNote", label: "Extra AI Instructions (optional)", icon: <Zap size={16} />, placeholder: "e.g. Always mention the school's 100% CBSE result in replies about results.", multiline: true },
]

export default function BotRulesPage() {
    const [activeTab, setActiveTab] = useState<Tab>("rules")

    // ── Rules State ──────────────────────────────────────────────────────────
    const [rules, setRules] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [form, setForm] = useState({ trigger: "", response: "", category: "General", language: "Bilingual" })
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState("")

    // ── Settings State ───────────────────────────────────────────────────────
    const [settings, setSettings] = useState<any>(null)
    const [settingsLoading, setSettingsLoading] = useState(true)
    const [settingsSaving, setSettingsSaving] = useState(false)
    const [settingsSaved, setSettingsSaved] = useState(false)

    useEffect(() => { loadRules() }, [])
    useEffect(() => { loadSettings() }, [])

    const loadRules = async () => {
        try {
            const res = await botRuleService.getAll()
            setRules(res.data.data)
        } catch (e) { console.error(e) }
        finally { setIsLoading(false) }
    }

    const loadSettings = async () => {
        try {
            const res = await chatbotSettingsService.get()
            setSettings(res.data.data)
        } catch (e) { console.error(e) }
        finally { setSettingsLoading(false) }
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
            loadRules()
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const resetForm = () => {
        setForm({ trigger: "", response: "", category: "General", language: "Bilingual" })
        setShowForm(false)
        setEditingId(null)
    }

    const handleEdit = (rule: any) => {
        setForm({ trigger: rule.trigger, response: rule.response, category: rule.category, language: rule.language })
        setEditingId(rule.id)
        setShowForm(true)
    }

    const toggleActive = async (id: number, current: boolean) => {
        await botRuleService.update(id, { isActive: !current })
        loadRules()
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this rule?")) return
        await botRuleService.delete(id)
        loadRules()
    }

    const handleSettingsSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSettingsSaving(true)
        try {
            const res = await chatbotSettingsService.update(settings)
            setSettings(res.data.data)
            setSettingsSaved(true)
            setTimeout(() => setSettingsSaved(false), 3000)
        } catch (e) { console.error(e) }
        finally { setSettingsSaving(false) }
    }

    const filteredRules = rules.filter(r =>
        r.trigger.toLowerCase().includes(search.toLowerCase()) ||
        r.response.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-4 md:p-8 space-y-6 min-h-screen bg-slate-50">
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-primary font-heading flex items-center gap-3">
                        <Bot className="text-gold-500" size={28} />
                        Chatbot Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Control every aspect of the school chatbot — auto-reply rules and AI behaviour.
                    </p>
                </div>
                {/* Stats badges */}
                <div className="flex gap-3 flex-wrap">
                    <div className="px-4 py-2 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-500 flex items-center gap-2 shadow-sm">
                        <MessageSquare size={14} className="text-gold-500" />
                        {rules.filter(r => r.isActive).length} Active Rules
                    </div>
                    <div className="px-4 py-2 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-500 flex items-center gap-2 shadow-sm">
                        <Sparkles size={14} className="text-purple-400" />
                        Groq AI Powered
                    </div>
                </div>
            </div>

            {/* ── Tabs ───────────────────────────────────────────────────────── */}
            <div className="flex gap-1 bg-white border border-slate-100 p-1.5 rounded-2xl w-fit shadow-sm">
                {[
                    { id: "rules" as Tab, label: "Auto-Reply Rules", icon: <MessageSquare size={15} /> },
                    { id: "settings" as Tab, label: "AI Settings", icon: <Settings size={15} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                            activeTab === tab.id
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "text-slate-400 hover:text-primary hover:bg-slate-50"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── AUTO-REPLY RULES TAB ────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {activeTab === "rules" && (
                    <motion.div key="rules" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* How it works card */}
                        <div className="bg-gradient-to-r from-primary/5 to-gold-500/5 border border-primary/10 rounded-2xl p-5 flex gap-4 items-start">
                            <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                                <Zap size={18} className="text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-primary text-sm">How Auto-Reply Rules Work</p>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    When a user message contains any of the trigger keywords, the bot instantly replies with your custom response — <strong>bypassing the AI entirely</strong>. Perfect for pinned announcements, fee deadlines, or important notices.
                                </p>
                            </div>
                        </div>

                        {/* Add button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => { resetForm(); setShowForm(v => !v) }}
                                className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
                            >
                                <Plus size={18} />
                                {showForm && !editingId ? "Cancel" : "Add New Rule"}
                            </button>
                        </div>

                        {/* Add/Edit Form */}
                        <AnimatePresence>
                            {showForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-black text-primary text-lg">{editingId ? "Edit Rule" : "Create Auto-Response"}</h2>
                                        <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-all">
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
                                            <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm">
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                                            >
                                                {saving ? "Saving..." : <><Save size={16} /> {editingId ? "Update Rule" : "Save Rule"}</>}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Rules List */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 md:px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{filteredRules.length} Rule{filteredRules.length !== 1 ? "s" : ""}</p>
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
                                            className={cn("p-6 md:p-8 transition-colors hover:bg-slate-50/50 group", !r.isActive && "opacity-40")}
                                        >
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="space-y-3 flex-grow min-w-0">
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
                                                        <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{r.response}</p>
                                                    </div>

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <span>{r.category}</span>
                                                        <span>{r.language}</span>
                                                        <span>Updated {new Date(r.updatedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="shrink-0 flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleActive(r.id, r.isActive)}
                                                        className={cn("transition-colors", r.isActive ? "text-emerald-500" : "text-slate-300")}
                                                        title={r.isActive ? "Disable rule" : "Enable rule"}
                                                    >
                                                        {r.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(r)}
                                                        className="p-2 text-slate-300 hover:text-primary hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                                                        title="Edit rule"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(r.id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete rule"
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
                                    {search ? "No rules match your search." : (
                                        <div className="space-y-3">
                                            <MessageSquare size={40} className="mx-auto text-slate-200" />
                                            <p>No custom rules yet.</p>
                                            <button
                                                onClick={() => setShowForm(true)}
                                                className="text-primary text-sm font-black flex items-center gap-1 mx-auto hover:underline"
                                            >
                                                <Plus size={14} /> Add your first rule
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {isLoading && (
                                <div className="py-20 text-center text-slate-400 font-bold italic animate-pulse">Loading Rules...</div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── AI SETTINGS TAB ─────────────────────────────────────────── */}
                {activeTab === "settings" && (
                    <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                        {/* Info card */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-5 flex gap-4 items-start">
                            <div className="p-2 bg-purple-100 rounded-xl shrink-0">
                                <Bot size={18} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="font-bold text-primary text-sm">AI Knowledge Base</p>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    These settings define what the AI chatbot <strong>"knows"</strong> about your school. Changes here are reflected immediately in all future chatbot replies — no code changes needed.
                                </p>
                            </div>
                        </div>

                        {settingsLoading ? (
                            <div className="py-20 text-center text-slate-400 font-bold italic animate-pulse">Loading Settings...</div>
                        ) : settings ? (
                            <form onSubmit={handleSettingsSave} className="space-y-6">
                                {/* School Info */}
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <GraduationCap size={18} className="text-gold-500" />
                                        <h2 className="font-black text-primary text-base">School Quick Facts</h2>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-2 bg-slate-50 px-2 py-0.5 rounded-full">Shown to AI</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {SETTINGS_FIELDS.slice(0, 8).map(field => (
                                            <div key={field.key} className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <span className="text-slate-300">{field.icon}</span>
                                                    {field.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings[field.key] || ""}
                                                    onChange={e => setSettings((s: any) => ({ ...s, [field.key]: e.target.value }))}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-primary text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Behaviour */}
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles size={18} className="text-purple-400" />
                                        <h2 className="font-black text-primary text-base">AI Behaviour</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {SETTINGS_FIELDS.slice(8).map(field => (
                                            <div key={field.key} className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <span className="text-slate-300">{field.icon}</span>
                                                    {field.label}
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={settings[field.key] || ""}
                                                    onChange={e => setSettings((s: any) => ({ ...s, [field.key]: e.target.value }))}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-primary text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all resize-none"
                                                />
                                                {field.key === "customSystemNote" && (
                                                    <p className="text-[10px] text-slate-400 px-1">
                                                        💡 Use this to inject special instructions. E.g.: "Always mention our 100% board result when students ask about academics."
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end gap-3 pb-8">
                                    <button
                                        type="submit"
                                        disabled={settingsSaving}
                                        className={cn(
                                            "px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 text-sm shadow-lg",
                                            settingsSaved
                                                ? "bg-emerald-500 text-white shadow-emerald-200"
                                                : "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                                        )}
                                    >
                                        {settingsSaving ? "Saving..." : settingsSaved ? (
                                            <><Sparkles size={16} /> Settings Saved!</>
                                        ) : (
                                            <><Save size={16} /> Save AI Settings</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="py-20 text-center text-red-400 font-bold">Could not load settings. Make sure the backend is running.</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
