"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
    Settings, 
    Bell, 
    Shield, 
    User, 
    Globe,
    Save,
    MoreHorizontal
} from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground text-sm">Configure core school settings, notifications, and administrative security.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10">
                    <Save size={18} /> Save All Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 space-y-2">
                    <SettingsMenu />
                </div>

                <div className="md:col-span-3 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-lg font-heading font-black text-primary mb-1">School Profile</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update basic organizational information.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">School Name</label>
                                <input 
                                    type="text" 
                                    defaultValue="SKP SAINIK PUBLIC SCHOOL"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registration No</label>
                                <input 
                                    type="text" 
                                    defaultValue="REGN-2026-UP-001"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Email</label>
                                <input 
                                    type="email" 
                                    defaultValue="info@skpschool.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    defaultValue="+91 000 000 0000"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <h3 className="text-sm font-heading font-black text-primary mb-6 flex items-center gap-2">
                                <Shield size={18} className="text-gold-500" /> Administrative Security
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="text-sm font-bold text-primary">Two-Factor Authentication</p>
                                        <p className="text-xs text-slate-400 font-medium">Add an extra layer of security to the admin account.</p>
                                    </div>
                                    <div className="h-6 w-12 bg-primary rounded-full relative">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="text-sm font-bold text-primary">IP Whitelisting</p>
                                        <p className="text-xs text-slate-400 font-medium">Restrict admin panel access to trusted IP addresses.</p>
                                    </div>
                                    <div className="h-6 w-12 bg-slate-200 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SettingsMenu() {
    const menu = [
        { name: "General Profile", icon: <User size={18} />, active: true },
        { name: "Notifications", icon: <Bell size={18} />, active: false },
        { name: "Security", icon: <Shield size={18} />, active: false },
        { name: "Branding & UI", icon: <Globe size={18} />, active: false },
        { name: "System Logs", icon: <MoreHorizontal size={18} />, active: false },
    ]

    return (
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {menu.map(item => (
                <button
                    key={item.name}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/10' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
                >
                    <span className={item.active ? 'text-gold-500' : 'text-slate-400'}>{item.icon}</span>
                    {item.name}
                </button>
            ))}
        </div>
    )
}
