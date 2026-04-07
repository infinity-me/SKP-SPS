"use client"

import { useState, useEffect } from "react"
import { calendarService } from "@/lib/api"
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function CalendarPage() {
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await calendarService.getAll()
            setEvents(res.data.data)
        } catch (error) {
            console.error("Failed to fetch events")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-primary pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase tracking-tighter italic"
                    >
                        Academic <span className="text-gold-500">Calendar</span>
                    </motion.h1>
                    <p className="text-white/70 max-w-2xl mx-auto font-medium">Keep track of school events, holidays, examinations, and important dates.</p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="space-y-8">
                    {events.length === 0 && !isLoading ? (
                        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white">
                            <CalendarIcon size={64} className="mx-auto text-slate-100 mb-6" />
                            <p className="text-slate-400 font-bold italic">No upcoming events scheduled.</p>
                        </div>
                    ) : (
                        events.map((event, index) => (
                            <motion.div 
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center gap-8 group hover:border-gold-500/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                            >
                                <div className="flex-shrink-0 w-24 h-24 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                                    </span>
                                    <span className="text-3xl font-heading font-black leading-none">
                                        {new Date(event.date).getDate()}
                                    </span>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h3 className="text-xl font-heading font-black text-primary uppercase italic group-hover:text-gold-500 transition-colors">{event.title}</h3>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            event.type === "holiday" ? "bg-red-100 text-red-700" :
                                            event.type === "exam" ? "bg-blue-100 text-blue-700" :
                                            event.type === "academic" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                        )}>
                                            {event.type}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{event.description || "School event scheduled for all students."}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-gold-500 transition-all duration-500">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
