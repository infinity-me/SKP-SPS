"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { popupService } from "@/lib/api"
import { Save, Image as ImageIcon, Trash2, Plus, Eye, EyeOff, Loader2 } from "lucide-react"

export default function PopupSettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })
    
    const [formData, setFormData] = useState({
        isActive: true,
        title: "Admissions Open",
        subtitle: "For Session 2026-2027",
        buttonText: "Apply Now",
        buttonLink: "/admission",
        images: [] as string[]
    })

    useEffect(() => {
        fetchPopupData()
    }, [])

    const fetchPopupData = async () => {
        try {
            const res = await popupService.get()
            const data = res.data
            if (data.success && data.data) {
                setFormData({
                    isActive: data.data.isActive,
                    title: data.data.title,
                    subtitle: data.data.subtitle,
                    buttonText: data.data.buttonText,
                    buttonLink: data.data.buttonLink,
                    images: data.data.images || []
                })
            }
        } catch (error) {
            console.error("Failed to fetch popup setting", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setMessage({ text: "Please select a valid image file.", type: "error" });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, base64String]
            }));
        };
        reader.readAsDataURL(file);
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setMessage({ text: "", type: "" })
        
        try {
            const res = await popupService.update(formData)
            const data = res.data
            
            if (data.success) {
                setMessage({ text: "Popup settings updated successfully!", type: "success" })
            } else {
                setMessage({ text: data.message || "Failed to update settings.", type: "error" })
            }
        } catch (error) {
            setMessage({ text: "An error occurred while saving.", type: "error" })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Start Popup Configuration</h1>
                <p className="text-muted-foreground text-sm">Manage the popup that appears when visitors first open the website.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                {/* General Settings */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                    <div>
                        <h3 className="font-bold text-primary flex items-center gap-2">
                            {formData.isActive ? <Eye className="text-green-500 w-5 h-5"/> : <EyeOff className="text-slate-400 w-5 h-5"/>}
                            Popup Visibility
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">When active, the popup will show once per session for website visitors.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>

                {/* Text Settings */}
                <div className="space-y-4">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Content Formatting</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="flex text-xs font-bold text-slate-400 uppercase tracking-wider">Main Title</label>
                            <input 
                                type="text" 
                                name="title"
                                value={formData.title} 
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-primary font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex text-xs font-bold text-slate-400 uppercase tracking-wider">Subtitle</label>
                            <input 
                                type="text" 
                                name="subtitle"
                                value={formData.subtitle} 
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-slate-600"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="flex text-xs font-bold text-slate-400 uppercase tracking-wider">Button Text</label>
                            <input 
                                type="text" 
                                name="buttonText"
                                value={formData.buttonText} 
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-primary font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex text-xs font-bold text-slate-400 uppercase tracking-wider">Button Link (URL)</label>
                            <input 
                                type="text" 
                                name="buttonLink"
                                value={formData.buttonLink} 
                                onChange={handleChange}
                                placeholder="e.g. /admission or https://..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-slate-600 font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Image Settings */}
                <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Slideshow Gallery</h3>
                            <p className="text-xs text-slate-500">Upload images to loop in the popup. Keep sizes small for better loading.</p>
                        </div>
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                            <Plus size={18} />
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>

                    {formData.images.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 mb-3 shadow-sm">
                                <ImageIcon size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 mb-1">No images added</p>
                            <p className="text-xs text-slate-400">Click the + button to upload photos for the slideshow</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((img, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={idx} 
                                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                                >
                                    <img src={img} alt={`Slide ${idx+1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <button 
                                            onClick={() => removeImage(idx)}
                                            className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-navy-800 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? "Saving..." : "Save Popup Settings"}
                    </button>
                </div>
            </div>
        </div>
    )
}
