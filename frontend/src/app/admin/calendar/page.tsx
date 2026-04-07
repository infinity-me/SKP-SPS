"use client"

import { useState, useEffect } from "react"
import { calendarService } from "@/lib/api"
import { 
    Plus, 
    Calendar as CalendarIcon, 
    Trash2, 
    Edit, 
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AdminCalendarPage() {
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: "",
        date: new Date().toISOString().split('T')[0],
        type: "event",
        description: ""
    })

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (isEdit && selectedEvent) {
                await calendarService.update(selectedEvent.id, formData)
            } else {
                await calendarService.create(formData)
            }
            setIsModalOpen(false)
            fetchEvents()
        } catch (error) {
            alert("Error saving event")
        }
    }

    const handleEdit = (event: any) => {
        setSelectedEvent(event)
        setIsEdit(true)
        setFormData({
            title: event.title,
            date: new Date(event.date).toISOString().split('T')[0],
            type: event.type,
            description: event.description || ""
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Permanently delete this event from calendar?")) {
            try {
                await calendarService.delete(id)
                fetchEvents()
            } catch (error) {
                alert("Error deleting event")
            }
        }
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight italic uppercase text-[#01142F]">Academic Calendar</h1>
                    <p className="text-slate-500 text-sm">Schedule school holidays, exam dates, and annual events.</p>
                </div>
                <button 
                    onClick={() => {
                        setIsEdit(false)
                        setFormData({ title: "", date: new Date().toISOString().split('T')[0], type: "event", description: "" })
                        setIsModalOpen(true)
                    }}
                    className="bg-primary text-white flex items-center gap-2 px-6 py-3 rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10"
                >
                    <Plus size={18} /> Schedule Event
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <CalendarIcon className="text-primary" size={24} />
                        <h3 className="font-heading font-bold text-primary">All Scheduled Events</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Title</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-primary">{new Date(event.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-primary">{event.title}</td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600",
                                            event.type === "holiday" && "bg-red-100 text-red-700",
                                            event.type === "exam" && "bg-blue-100 text-blue-700",
                                            event.type === "academic" && "bg-green-100 text-green-700"
                                        )}>
                                            {event.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-xs text-slate-400 max-w-xs truncate">{event.description || "N/A"}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(event)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <CalendarIcon className="mx-auto text-slate-100 mb-4" size={64} />
                                        <p className="text-slate-400 font-bold italic">No events scheduled at the moment.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between text-primary">
                            <div>
                                <h3 className="text-xl font-heading font-black italic uppercase">{isEdit ? "Update Schedule" : "New Calendar Entry"}</h3>
                                <p className="text-sm text-slate-400">Enter event specifications below.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Title</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                                    <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary appearance-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="event">General Event</option>
                                        <option value="holiday">Holiday</option>
                                        <option value="exam">Examination</option>
                                        <option value="academic">Academic Day</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea rows={2} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary font-body resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" className="flex-grow py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-primary/10">
                                    {isEdit ? "Update Entry" : "Save Entry"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
