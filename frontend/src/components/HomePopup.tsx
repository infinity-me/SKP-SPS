"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { popupService } from "@/lib/api"

interface PopupData {
    isActive: boolean
    title: string
    subtitle: string
    buttonText: string
    buttonLink: string
    images: string[]
}

export default function HomePopup() {
    const [data, setData] = useState<PopupData | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)

        // 1. Immediately try to load from cache for instant 0.3s display
        const cachedStr = localStorage.getItem("popupDataCache")
        if (cachedStr) {
            try {
                const cachedData = JSON.parse(cachedStr)
                setData(cachedData)
                if (cachedData.isActive) {
                    setTimeout(() => setIsVisible(true), 300)
                }
            } catch (e) {
                console.error("Cache parse error", e)
            }
        }

        // 2. Fetch fresh popup settings in the background
        const fetchPopupSettings = async () => {
            try {
                const res = await popupService.get()
                const json = res.data
                
                if (json.success && json.data) {
                    // Only update state if we didn't use cache OR if cache is different (simplified here)
                    if (!cachedStr) {
                        setData(json.data)
                        if (json.data.isActive) {
                            setTimeout(() => setIsVisible(true), 300)
                        }
                    }
                    
                    // Always silently update cache for next reload
                    localStorage.setItem("popupDataCache", JSON.stringify(json.data))
                }
            } catch (error) {
                console.error("Failed to fetch popup data:", error)
            }
        }

        fetchPopupSettings()
    }, [])

    // Image loop
    useEffect(() => {
        if (!isVisible || !data || !data.images || data.images.length <= 1) return

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % data.images.length)
        }, 3000) // Change image every 3 seconds

        return () => clearInterval(interval)
    }, [isVisible, data])

    const closePopup = () => {
        setIsVisible(false)
    }

    if (!isMounted || !isVisible || !data) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[480px] bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
                    >
                        {/* Close button inside modal (like the screenshot) */}
                        <button 
                            onClick={closePopup}
                            className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors shadow-sm"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>

                        {/* Top Carousel Area */}
                        <div className="relative w-full aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden">
                            {data.images && data.images.length > 0 ? (
                                <AnimatePresence initial={false}>
                                    <motion.img
                                        key={currentImageIndex}
                                        src={data.images[currentImageIndex]}
                                        alt={`Popup slider ${currentImageIndex}`}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-navy-900 flex items-center justify-center p-8">
                                    <div className="text-white/20 font-heading font-black text-4xl text-center leading-tight">
                                        SKP SAINIK <br/> PUBLIC SCHOOL
                                    </div>
                                </div>
                            )}
                            
                            {/* Gradient Overlay for seamless blend to white content */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
                        </div>

                        {/* Bottom Content Area */}
                        <div className="relative z-20 pb-8 px-8 flex flex-col items-center text-center -mt-8">
                            <h2 className="text-3xl font-heading font-black text-primary mb-2 leading-tight">
                                {data.title}
                            </h2>
                            <p className="text-slate-500 font-medium mb-8">
                                {data.subtitle}
                            </p>
                            
                            <Link 
                                href={data.buttonLink}
                                onClick={closePopup}
                                className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 bg-gold-500 text-primary font-bold rounded-2xl overflow-hidden transition-all shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-1"
                            >
                                <span className="relative z-10">{data.buttonText}</span>
                                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
