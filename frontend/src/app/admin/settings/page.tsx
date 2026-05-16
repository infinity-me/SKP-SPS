"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { systemSettingsService } from "@/lib/api"
import {
    Settings, Bell, Shield, User, Globe, Save,
    CheckCircle, AlertCircle, Loader2, MoreHorizontal,
    School, Phone, Mail, MapPin, Link2, Calendar,
    GraduationCap, Palette, Lock, Clock, Wifi, Eye, EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"

type Section = "profile" | "notifications" | "security" | "branding" | "logs"

const MENU: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "profile",       label: "General Profile",  icon: <User size={16} /> },
    { id: "notifications", label: "Notifications",    icon: <Bell size={16} /> },
    { id: "security",      label: "Security",         icon: <Shield size={16} /> },
    { id: "branding",      label: "Branding & UI",    icon: <Globe size={16} /> },
    { id: "logs",          label: "System Logs",      icon: <MoreHorizontal size={16} /> },
]

const SYSTEM_LOGS = [
    { time: "Today, 12:44 PM", event: "Admin logged in",          level: "info" },
    { time: "Today, 11:30 AM", event: "Settings updated",         level: "success" },
    { time: "Today, 10:15 AM", event: "New admission received",   level: "info" },
    { time: "Yesterday",       event: "Bot rule added",           level: "info" },
    { time: "Yesterday",       event: "Failed login attempt",     level: "warn" },
    { time: "2 days ago",      event: "Gallery updated",          level: "info" },
    { time: "2 days ago",      event: "Circular published",       level: "success" },
    { time: "3 days ago",      event: "Fee payment received",     level: "success" },
]

interface Settings {
    schoolName: string; registrationNo: string; primaryEmail: string; phone: string
    address: string; website: string; principalName: string; established: string; affiliation: string
    notifyAdmission: boolean; notifyFeePayment: boolean; notifyNewTeacher: boolean
    notifySystemAlerts: boolean; emailDigestFreq: string
    twoFactorAuth: boolean; ipWhitelisting: boolean; sessionTimeout: number; allowedIPs: string
    primaryColor: string; accentColor: string; logoUrl: string; faviconUrl: string; schoolTagline: string
    updatedAt?: string
}

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<Section>("profile")
    const [settings, setSettings]     = useState<Settings | null>(null)
    const [loading, setLoading]        = useState(true)
    const [saving, setSaving]          = useState(false)
    const [saved, setSaved]            = useState(false)
    const [error, setError]            = useState("")
    const [showIPs, setShowIPs]        = useState(false)

    const load = useCallback(async () => {
        try {
            const res = await systemSettingsService.get()
            setSettings(res.data.data)
        } catch (e: any) {
            setError("Could not load settings. Is the backend running?")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const set = (key: keyof Settings, value: any) =>
        setSettings(s => s ? { ...s, [key]: value } : s)

    const handleSave = async () => {
        if (!settings) return
        setSaving(true); setError("")
        try {
            const res = await systemSettingsService.update(settings)
            setSettings(res.data.data)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (e: any) {
            setError(e?.response?.data?.error || "Save failed. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-96 gap-3 text-slate-400">
            <Loader2 size={24} className="animate-spin" />
            <span className="font-bold text-sm">Loading settings…</span>
        </div>
    )

    if (!settings) return (
        <div className="flex items-center justify-center h-96 gap-3 text-red-400">
            <AlertCircle size={24} />
            <span className="font-bold text-sm">{error || "Settings unavailable"}</span>
        </div>
    )

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight flex items-center gap-3">
                        <Settings size={24} className="text-gold-500" />
                        System Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Configure core school settings, notifications, and administrative security.
                        {settings.updatedAt && (
                            <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                Last saved {new Date(settings.updatedAt).toLocaleString()}
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || activeSection === "logs"}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg disabled:opacity-60",
                        saved
                            ? "bg-emerald-500 text-white shadow-emerald-200"
                            : "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                    )}
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> :
                     saved  ? <CheckCircle size={16} /> : <Save size={16} />}
                    {saving ? "Saving…" : saved ? "Saved!" : "Save All Changes"}
                </button>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
                        <AlertCircle size={16} /> {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar nav */}
                <div className="md:col-span-1">
                    <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
                        {MENU.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all",
                                    activeSection === item.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/10"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                                )}
                            >
                                <span className={activeSection === item.id ? "text-gold-500" : "text-slate-400"}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Panel */}
                <div className="md:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                            {/* ── GENERAL PROFILE ─────────────────────────────────── */}
                            {activeSection === "profile" && (
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                    <SectionHeader icon={<School size={18} className="text-gold-500" />} title="School Profile" sub="Update basic organizational information." />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field label="School Name" icon={<School size={14} />}>
                                            <Input value={settings.schoolName} onChange={v => set("schoolName", v)} placeholder="SKP Sainik Public School" />
                                        </Field>
                                        <Field label="Registration No" icon={<GraduationCap size={14} />}>
                                            <Input value={settings.registrationNo} onChange={v => set("registrationNo", v)} placeholder="REGN-2026-UP-001" />
                                        </Field>
                                        <Field label="Primary Email" icon={<Mail size={14} />}>
                                            <Input value={settings.primaryEmail} onChange={v => set("primaryEmail", v)} placeholder="admin@school.in" type="email" />
                                        </Field>
                                        <Field label="Phone Number(s)" icon={<Phone size={14} />}>
                                            <Input value={settings.phone} onChange={v => set("phone", v)} placeholder="9454331861" />
                                        </Field>
                                        <Field label="Full Address" icon={<MapPin size={14} />} className="md:col-span-2">
                                            <Input value={settings.address} onChange={v => set("address", v)} placeholder="Manihari, Kannauj, UP" />
                                        </Field>
                                        <Field label="Website URL" icon={<Link2 size={14} />}>
                                            <Input value={settings.website} onChange={v => set("website", v)} placeholder="https://skpsps.in" />
                                        </Field>
                                        <Field label="Principal Name" icon={<User size={14} />}>
                                            <Input value={settings.principalName} onChange={v => set("principalName", v)} placeholder="Mrs. Shobha Sharma" />
                                        </Field>
                                        <Field label="Established Year" icon={<Calendar size={14} />}>
                                            <Input value={settings.established} onChange={v => set("established", v)} placeholder="2009" />
                                        </Field>
                                        <Field label="Board Affiliation" icon={<GraduationCap size={14} />}>
                                            <Input value={settings.affiliation} onChange={v => set("affiliation", v)} placeholder="CBSE" />
                                        </Field>
                                    </div>
                                </div>
                            )}

                            {/* ── NOTIFICATIONS ───────────────────────────────────── */}
                            {activeSection === "notifications" && (
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                    <SectionHeader icon={<Bell size={18} className="text-gold-500" />} title="Notification Preferences" sub="Control which events trigger email alerts to admins." />
                                    <div className="space-y-4">
                                        <Toggle label="New Admission Received" desc="Send an email when a student submits an admission form." value={settings.notifyAdmission} onChange={v => set("notifyAdmission", v)} />
                                        <Toggle label="Fee Payment Confirmed" desc="Get notified whenever a fee payment is processed." value={settings.notifyFeePayment} onChange={v => set("notifyFeePayment", v)} />
                                        <Toggle label="Teacher Application" desc="Alert when a new teacher job application is submitted." value={settings.notifyNewTeacher} onChange={v => set("notifyNewTeacher", v)} />
                                        <Toggle label="System Alerts" desc="Receive critical system and server error notifications." value={settings.notifySystemAlerts} onChange={v => set("notifySystemAlerts", v)} />
                                    </div>
                                    <div className="pt-4 border-t border-slate-50">
                                        <Field label="Email Digest Frequency" icon={<Bell size={14} />}>
                                            <select
                                                value={settings.emailDigestFreq}
                                                onChange={e => set("emailDigestFreq", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-primary text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5"
                                            >
                                                {["Instant", "Hourly", "Daily", "Weekly", "Never"].map(f => <option key={f}>{f}</option>)}
                                            </select>
                                        </Field>
                                    </div>
                                </div>
                            )}

                            {/* ── SECURITY ────────────────────────────────────────── */}
                            {activeSection === "security" && (
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                    <SectionHeader icon={<Shield size={18} className="text-gold-500" />} title="Administrative Security" sub="Harden access controls for the admin panel." />
                                    <div className="space-y-4">
                                        <Toggle label="Two-Factor Authentication" desc="Require a one-time code in addition to the password on every admin login." value={settings.twoFactorAuth} onChange={v => set("twoFactorAuth", v)} />
                                        <Toggle label="IP Whitelisting" desc="Block access to the admin panel from non-approved IP addresses." value={settings.ipWhitelisting} onChange={v => set("ipWhitelisting", v)} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                        <Field label="Session Timeout (minutes)" icon={<Clock size={14} />}>
                                            <Input
                                                value={String(settings.sessionTimeout)}
                                                onChange={v => set("sessionTimeout", parseInt(v) || 60)}
                                                placeholder="60" type="number"
                                            />
                                        </Field>
                                        <Field label="Allowed IPs (comma separated)" icon={<Wifi size={14} />} className="md:col-span-2">
                                            <div className="relative">
                                                <textarea
                                                    rows={3}
                                                    value={showIPs ? settings.allowedIPs : settings.allowedIPs.replace(/\d{1,3}/g, "●●●")}
                                                    onChange={e => set("allowedIPs", e.target.value)}
                                                    placeholder="192.168.1.1, 203.0.113.0"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-primary text-sm font-mono outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white resize-none pr-12"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowIPs(s => !s)}
                                                    className="absolute right-4 top-4 text-slate-300 hover:text-primary"
                                                >
                                                    {showIPs ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </Field>
                                    </div>
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-700 font-bold">
                                        ⚠️ Enabling IP Whitelisting without adding your IP first will lock you out of the admin panel.
                                    </div>
                                </div>
                            )}

                            {/* ── BRANDING & UI ───────────────────────────────────── */}
                            {activeSection === "branding" && (
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                                    <SectionHeader icon={<Palette size={18} className="text-gold-500" />} title="Branding & UI" sub="Customize the visual identity of the school portal." />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Field label="School Tagline" icon={<School size={14} />} className="md:col-span-2">
                                            <Input value={settings.schoolTagline} onChange={v => set("schoolTagline", v)} placeholder="Shaping Tomorrow's Leaders Today" />
                                        </Field>
                                        <Field label="Primary Color" icon={<Palette size={14} />}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={settings.primaryColor}
                                                    onChange={e => set("primaryColor", e.target.value)}
                                                    className="w-12 h-12 rounded-xl border-2 border-slate-100 cursor-pointer bg-transparent"
                                                />
                                                <Input value={settings.primaryColor} onChange={v => set("primaryColor", v)} placeholder="#0a2342" />
                                            </div>
                                        </Field>
                                        <Field label="Accent / Gold Color" icon={<Palette size={14} />}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={settings.accentColor}
                                                    onChange={e => set("accentColor", e.target.value)}
                                                    className="w-12 h-12 rounded-xl border-2 border-slate-100 cursor-pointer bg-transparent"
                                                />
                                                <Input value={settings.accentColor} onChange={v => set("accentColor", v)} placeholder="#d4af37" />
                                            </div>
                                        </Field>
                                        <Field label="Logo URL" icon={<Link2 size={14} />}>
                                            <Input value={settings.logoUrl} onChange={v => set("logoUrl", v)} placeholder="https://..." />
                                        </Field>
                                        <Field label="Favicon URL" icon={<Link2 size={14} />}>
                                            <Input value={settings.faviconUrl} onChange={v => set("faviconUrl", v)} placeholder="https://..." />
                                        </Field>
                                    </div>
                                    {/* Live Preview */}
                                    <div className="pt-6 border-t border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Live Brand Preview</p>
                                        <div className="rounded-2xl border border-slate-100 overflow-hidden">
                                            <div className="flex items-center gap-3 px-6 py-4" style={{ backgroundColor: settings.primaryColor }}>
                                                {settings.logoUrl && <img src={settings.logoUrl} alt="logo" className="h-8 w-8 rounded object-cover" onError={e => (e.currentTarget.style.display = "none")} />}
                                                <div>
                                                    <p className="font-bold text-sm" style={{ color: settings.accentColor }}>{settings.schoolName}</p>
                                                    <p className="text-[10px] opacity-60 text-white">{settings.schoolTagline}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 flex gap-3 flex-wrap">
                                                <div className="px-4 py-2 text-white text-xs font-bold rounded-xl" style={{ backgroundColor: settings.primaryColor }}>Primary Button</div>
                                                <div className="px-4 py-2 text-primary text-xs font-bold rounded-xl border-2" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Accent Button</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── SYSTEM LOGS ─────────────────────────────────────── */}
                            {activeSection === "logs" && (
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                    <SectionHeader icon={<MoreHorizontal size={18} className="text-gold-500" />} title="System Logs" sub="Recent activity from the admin panel." />
                                    <div className="divide-y divide-slate-50">
                                        {SYSTEM_LOGS.map((log, i) => (
                                            <div key={i} className="flex items-center justify-between py-4 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-2 h-2 rounded-full shrink-0", {
                                                        "bg-emerald-400": log.level === "success",
                                                        "bg-blue-400":    log.level === "info",
                                                        "bg-amber-400":   log.level === "warn",
                                                    })} />
                                                    <p className="text-sm font-bold text-primary">{log.event}</p>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest shrink-0">{log.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">Full audit logs available via server console</p>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

// ── Reusable sub-components ────────────────────────────────────────────

function SectionHeader({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-gold-500/10 rounded-xl shrink-0">{icon}</div>
            <div>
                <h3 className="text-lg font-heading font-black text-primary">{title}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{sub}</p>
            </div>
        </div>
    )
}

function Field({ label, icon, children, className }: { label: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <span className="text-slate-300">{icon}</span>{label}
            </label>
            {children}
        </div>
    )
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-primary text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all"
        />
    )
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
    return (
        <div
            className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors group"
            onClick={() => onChange(!value)}
        >
            <div>
                <p className="text-sm font-bold text-primary">{label}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{desc}</p>
            </div>
            <div className={cn("w-12 h-6 rounded-full relative transition-colors shrink-0 ml-4", value ? "bg-primary" : "bg-slate-200")}>
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all", value ? "right-1" : "left-1")} />
            </div>
        </div>
    )
}
