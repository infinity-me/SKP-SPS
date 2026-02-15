"use client"

import { useState, useEffect } from "react"
import { photoService } from "@/lib/api"
import { Plus, Trash2, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { motion } from "framer-motion"

export default function GalleryPage() {
    const [photos, setPhotos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        url: "",
        caption: "",
        category: "General"
    })

    useEffect(() => {
        fetchPhotos()
    }, [])

    const fetchPhotos = async () => {
        try {
            const res = await photoService.getAll()
            setPhotos(res.data.data)
        } catch (error) {
            console.error("Failed to fetch photos")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await photoService.upload(formData)
            setIsModalOpen(false)
            setFormData({ url: "", caption: "", category: "General" })
            fetchPhotos()
        } catch (error) {
            alert("Error adding photo")
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("Remove this photo from gallery?")) {
            try {
                await photoService.delete(id)
                fetchPhotos()
            } catch (error) {
                alert("Error deleting photo")
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">School Gallery</h1>
                    <p className="text-slate-500 text-sm">Manage the photos displayed in the public gallery section.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10"
                >
                    <Plus size={18} /> Add Photo
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {photos.map((photo) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group relative aspect-square"
                    >
                        <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <p className="text-white font-bold text-sm mb-1">{photo.caption}</p>
                            <p className="text-gold-500 text-[10px] font-black uppercase tracking-widest mb-4">{photo.category}</p>
                            <button
                                onClick={() => handleDelete(photo.id)}
                                className="w-full py-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                            >
                                Delete Photo
                            </button>
                        </div>
                    </motion.div>
                ))}
                {photos.length === 0 && !isLoading && (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <ImageIcon className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-slate-400 font-medium">No photos in gallery yet.</p>
                    </div>
                )}
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
                                <h3 className="text-xl font-heading font-black">Add New Photo</h3>
                                <p className="text-sm text-slate-400">Enter image details below.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        required
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                        value={formData.url}
                                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Caption</label>
                                <input
                                    required
                                    placeholder="School Annual Function 2026"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                    value={formData.caption}
                                    onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary font-bold appearance-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Campus">Campus</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Events">Events</option>
                                </select>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-grow py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-primary/10"
                                >
                                    Add to Gallery
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
