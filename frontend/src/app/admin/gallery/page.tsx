"use client"

import { useState, useEffect, useRef } from "react"
import { photoService } from "@/lib/api"
import api from "@/lib/api"
import { Plus, Trash2, X, ImageIcon, Upload, Camera, Link as LinkIcon, Tag, LayoutGrid, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const CATEGORIES = ["All","Events","Sports","Academic","Cultural","Infrastructure","NCC","Parade","Republic Day","Annual Function","Science Exhibition"]

export default function GalleryPage() {
    const [photos, setPhotos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [activeCategory, setActiveCategory] = useState("All")
    const [dbCategories, setDbCategories] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [uploadMode, setUploadMode] = useState<"url"|"file">("file")
    const [form, setForm] = useState({ url:"", caption:"", category:"Events" })
    const [preview, setPreview] = useState<string>("")
    const [lightbox, setLightbox] = useState<any>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const dropRef = useRef<HTMLDivElement>(null)

    useEffect(() => { fetchPhotos(); fetchCategories() }, [])

    async function fetchPhotos() {
        try {
            const res = await photoService.getAll()
            setPhotos(res.data.data)
        } catch { } finally { setLoading(false) }
    }

    async function fetchCategories() {
        try {
            const res = await api.get("/gallery/categories")
            const cats = res.data.data.map((c: any) => c.name).filter((n: string) => n !== "All")
            setDbCategories(cats)
        } catch { }
    }

    function handleFileSelect(file: File) {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            setPreview(result)
            setForm(f => ({ ...f, url: result }))
        }
        reader.readAsDataURL(file)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith("image/")) handleFileSelect(file)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.url) return alert("Please add an image URL or upload a file")
        setUploading(true)
        try {
            await photoService.upload(form)
            setModal(false)
            setForm({ url:"", caption:"", category:"Events" })
            setPreview("")
            fetchPhotos()
        } catch { alert("Error adding photo") } finally { setUploading(false) }
    }

    async function handleDelete(id: number) {
        if (!confirm("Remove this photo?")) return
        await photoService.delete(id); fetchPhotos()
    }

    const allCats = ["All", ...Array.from(new Set([...dbCategories, ...photos.map((p:any) => p.category).filter(Boolean)]))]
    const filtered = activeCategory === "All" ? photos : photos.filter((p:any) => p.category === activeCategory)

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">School Gallery</h1>
                    <p className="text-muted-foreground text-sm">{photos.length} photos · {allCats.length - 1} categories</p>
                </div>
                <button onClick={() => { setModal(true); setPreview(""); setForm({url:"",caption:"",category:"Events"}) }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
                    <Upload size={18} /> Upload Photo
                </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {allCats.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                        className={cn("flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap", 
                            activeCategory === cat ? "bg-primary text-white shadow-lg shadow-primary/10" : "bg-white border border-slate-100 text-slate-600 hover:border-primary/30")}>
                        {cat}
                        {cat !== "All" && <span className={cn("ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full", activeCategory === cat ? "bg-white/20" : "bg-slate-100")}>
                            {photos.filter((p:any) => p.category === cat).length}
                        </span>}
                    </button>
                ))}
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Upload Card */}
                <div onClick={() => { setModal(true); setPreview(""); setForm({url:"",caption:"",category:"Events"}) }}
                    className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Plus size={22} className="text-primary group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors text-center px-2">Add Photo</p>
                </div>

                {loading ? Array(8).fill(0).map((_,i) => <div key={i} className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />) :
                filtered.map((photo, i) => (
                    <motion.div key={photo.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.03 }}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer"
                        onClick={() => setLightbox(photo)}>
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <p className="text-white text-xs font-bold truncate">{photo.caption}</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-gold-400 font-bold">{photo.category}</span>
                                <button onClick={e => { e.stopPropagation(); handleDelete(photo.id) }}
                                    className="p-1.5 bg-red-500/90 rounded-lg text-white hover:bg-red-600 transition-colors">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {!loading && filtered.length === 0 && (
                    <div className="col-span-full py-24 flex flex-col items-center gap-4 text-slate-300">
                        <ImageIcon size={48} />
                        <p className="font-bold italic">No photos in this category yet.</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-heading font-black text-primary">Add Photo</h3>
                                <p className="text-sm text-slate-400">Upload from device or paste image URL</p>
                            </div>
                            <button onClick={() => setModal(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Mode Toggle */}
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setUploadMode("file")} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all", uploadMode==="file"?"bg-primary text-white":"bg-slate-50 text-slate-500")}>
                                    <Camera size={14}/> Upload File
                                </button>
                                <button type="button" onClick={() => setUploadMode("url")} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all", uploadMode==="url"?"bg-primary text-white":"bg-slate-50 text-slate-500")}>
                                    <LinkIcon size={14}/> Image URL
                                </button>
                            </div>

                            {/* Drop Zone */}
                            {uploadMode === "file" ? (
                                <div ref={dropRef} onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                                    onClick={() => fileRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                                    {preview ? (
                                        <img src={preview} className="max-h-40 mx-auto rounded-xl object-contain mb-3" alt="preview" />
                                    ) : (
                                        <>
                                            <Upload size={36} className="mx-auto text-slate-300 mb-3" />
                                            <p className="text-sm font-bold text-slate-500">Click or drag & drop photo here</p>
                                            <p className="text-xs text-slate-300 mt-1">JPG, PNG, WebP up to 10MB</p>
                                        </>
                                    )}
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if(f) handleFileSelect(f) }} />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input required={uploadMode==="url"} type="url" placeholder="https://example.com/photo.jpg"
                                            value={form.url?.startsWith("data:") ? "" : form.url}
                                            onChange={e => { setForm(f => ({...f, url: e.target.value})); setPreview("") }}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                                    </div>
                                </div>
                            )}

                            {/* Caption */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Caption</label>
                                <input required placeholder="e.g. Annual Sports Day 2026" value={form.caption} onChange={e => setForm(f => ({...f, caption: e.target.value}))}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Tag size={11}/> Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-primary outline-none appearance-none">
                                    {[...new Set([...CATEGORIES.slice(1), ...dbCategories])].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setModal(false)} className="flex-1 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" disabled={uploading || !form.url} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-60">
                                    {uploading ? "Uploading..." : "Add to Gallery"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>

            {/* Lightbox */}
            <AnimatePresence>
            {lightbox && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
                    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} onClick={e => e.stopPropagation()}
                        className="max-w-3xl w-full">
                        <img src={lightbox.url} alt={lightbox.caption} className="w-full max-h-[75vh] object-contain rounded-2xl" />
                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <p className="text-white font-bold">{lightbox.caption}</p>
                                <p className="text-gold-400 text-sm">{lightbox.category}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { handleDelete(lightbox.id); setLightbox(null) }} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all">Delete</button>
                                <button onClick={() => setLightbox(null)} className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-all">Close</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </div>
    )
}
