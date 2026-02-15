"use client"

import { useState, useEffect } from "react"
import { circularService } from "@/lib/api"
import { Plus, Search, Edit2, Trash2, X, Bell } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function CircularsPage() {
    const [circulars, setCirculars] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCircular, setEditingCircular] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: "",
        category: "General",
        description: "",
        date: new Date().toISOString()
    })

    useEffect(() => {
        fetchCirculars()
    }, [])

    const fetchCirculars = async () => {
        try {
            const res = await circularService.getAll()
            setCirculars(res.data.data)
        } catch (error) {
            console.error("Failed to fetch circulars")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingCircular) {
                await circularService.update(editingCircular.id, formData)
            } else {
                await circularService.post(formData)
            }
            setIsModalOpen(false)
            setEditingCircular(null)
            setFormData({ title: "", category: "General", description: "", date: new Date().toISOString() })
            fetchCirculars()
        } catch (error) {
            alert("Error saving notice")
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this notice?")) {
            try {
                await circularService.delete(id)
                fetchCirculars()
            } catch (error) {
                alert("Error deleting notice")
            }
        }
    }

    const openModal = (circular: any = null) => {
        if (circular) {
            setEditingCircular(circular)
            setFormData({ ...circular })
        } else {
            setEditingCircular(null)
            setFormData({ title: "", category: "General", description: "", date: new Date().toISOString() })
        }
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">Circulars & Notices</h1>
                    <p className="text-slate-500 text-sm">Post announcements, news and important updates for school.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10"
                >
                    <Plus size={18} /> New Notice
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {circulars.map((circular) => (
                    <motion.div
                        key={circular.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-primary group-hover:bg-primary/5 transition-colors">
                                <Bell size={20} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                circular.category === "Important" ? "bg-red-50 text-red-600" :
                                    circular.category === "Event" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                            )}>
                                {circular.category}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{circular.title}</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-3">{circular.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {new Date(circular.date).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(circular)}
                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(circular.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {circulars.length === 0 && !isLoading && (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        <p>No circulars posted yet.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white text-primary">
                            <div>
                                <h3 className="text-xl font-heading font-black">{editingCircular ? "Edit Notice" : "Post New Notice"}</h3>
                                <p className="text-sm text-slate-400">Fill in the details to publish an announcement.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                                <input
                                    required
                                    placeholder="e.g. Annual Sports Day 2026"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary appearance-none font-bold"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Important">Important</option>
                                    <option value="Event">Event</option>
                                    <option value="Holiday">Holiday</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Write the notice content here..."
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-grow py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-primary/10"
                                >
                                    {editingCircular ? "Update Notice" : "Publish Notice"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
