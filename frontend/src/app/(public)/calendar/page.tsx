"use client"

import { motion } from "framer-motion"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Bell } from "lucide-react"

export default function CalendarPage() {
    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <section className="bg-primary py-20 px-6 text-center">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">Academic <span className="text-gold-500">Calendar</span></h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">Stay updated with all school events, holidays, and examination schedules.</p>
                </div>
            </section>

            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                            <h2 className="text-2xl font-heading font-bold text-primary">February 2026</h2>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft /></button>
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="bg-slate-50 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 28 }).map((_, i) => (
                                <div key={i} className="bg-white aspect-square p-2 group cursor-pointer hover:bg-slate-50 transition-all flex flex-col justify-between">
                                    <span className={`text-sm font-bold ${[1, 8, 15, 22].includes(i + 1) ? "text-red-500" : "text-primary"}`}>{i + 1}</span>
                                    {(i + 1) === 11 && <div className="w-full h-1 bg-gold-500 rounded-full" />}
                                    {(i + 1) === 25 && <div className="w-full h-1 bg-blue-500 rounded-full" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-heading font-bold text-primary mb-8 flex items-center gap-2">
                                <Bell className="text-gold-500" size={20} /> Upcoming Events
                            </h3>
                            <div className="space-y-8">
                                <EventItem date="Feb 11" title="Mahashivratri" type="Holiday" color="red" />
                                <EventItem date="Feb 25" title="Annual Sports Meet" type="Event" color="blue" />
                                <EventItem date="Mar 10" title="Term End Exams" type="Academic" color="gold" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function EventItem({ date, title, type, color }: any) {
    const colors: any = {
        red: "bg-red-500",
        blue: "bg-blue-500",
        gold: "bg-gold-500 font-bold text-ash"
    }
    return (
        <div className="flex gap-4">
            <div className={`w-12 h-12 ${colors[color]} rounded-xl shrink-0 flex flex-col items-center justify-center text-white overflow-hidden shadow-lg`}>
                <span className="text-[10px] font-black uppercase">{date.split(' ')[0]}</span>
                <span className="text-lg font-bold leading-none">{date.split(' ')[1]}</span>
            </div>
            <div>
                <h4 className="font-bold text-primary text-sm">{title}</h4>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">{type}</p>
            </div>
        </div>
    )
}
