"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
    User, Mail, Phone, BookOpen, GraduationCap, 
    Briefcase, Link as LinkIcon, Send, CheckCircle2, 
    ArrowLeft, ClipboardCheck
} from "lucide-react"
import { teacherApplicationService } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function TeacherApplicationPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        qualification: "",
        experience: "",
        resumeUrl: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await teacherApplicationService.submit(formData)
            if (response.data.success) {
                setIsSubmitted(true)
            } else {
                setError(response.data.message || "Failed to submit application")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred during submission")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-3xl shadow-xl max-w-md text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-primary">Application Sent!</h1>
                    <p className="text-slate-500">
                        Thank you for your interest in joining **SKP SAINIK PUBLIC SCHOOL**. Our recruitment team will review your profile and contact you shortly.
                    </p>
                    <Link 
                        href="/" 
                        className="inline-block w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all"
                    >
                        Return Home
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header section */}
            <div className="bg-primary text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image src="/images/school-img1.jpeg" alt="Background" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all mb-8 font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black font-heading mb-4"
                    >
                        Join Our <span className="text-gold-500">Faculty</span>
                    </motion.h1>
                    <p className="text-white/60 text-lg md:text-xl max-w-2xl font-light">
                        Expertise, Passion, and Excellence. We are looking for dedicated educators to shape the future of our students.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="max-w-4xl mx-auto px-6 -mt-12 pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100"
                >
                    <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                        <div className="bg-gold-500/10 text-gold-600 p-3 rounded-2xl">
                            <ClipboardCheck size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-primary">Application Form</h2>
                            <p className="text-slate-400 text-sm">Please fill in all details accurately.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Details */}
                            <InputGroup 
                                label="Full Name" 
                                name="fullName"
                                placeholder="e.g., Dr. Rajesh Kumar" 
                                icon={<User size={18} />} 
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <InputGroup 
                                label="Email Address" 
                                name="email"
                                type="email"
                                placeholder="rajesh@example.com" 
                                icon={<Mail size={18} />} 
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <InputGroup 
                                label="Phone Number" 
                                name="phone"
                                placeholder="+91 00000 00000" 
                                icon={<Phone size={18} />} 
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            <InputGroup 
                                label="Subject Expertise" 
                                name="subject"
                                placeholder="e.g., Physics, Mathematics" 
                                icon={<BookOpen size={18} />} 
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />

                            {/* Qualifications */}
                            <InputGroup 
                                label="Highest Qualification" 
                                name="qualification"
                                placeholder="e.g., Ph.D, M.Sc B.Ed" 
                                icon={<GraduationCap size={18} />} 
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                            />
                            <InputGroup 
                                label="Experience (Years)" 
                                name="experience"
                                placeholder="e.g., 5+ Years" 
                                icon={<Briefcase size={18} />} 
                                value={formData.experience}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Resume Section */}
                        <div className="space-y-3 pt-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <LinkIcon size={12} />
                                Resume Link (Google Drive / LinkedIn / Dropbox)
                            </label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                    <LinkIcon size={18} />
                                </div>
                                <input
                                    required
                                    name="resumeUrl"
                                    placeholder="Paste your public resume link here"
                                    value={formData.resumeUrl}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-primary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all font-medium"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 px-1 italic">
                                * Ensure the link is public or shared with our recruitment email.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3 ml-auto"
                        >
                            {isLoading ? "Submitting..." : (
                                <>
                                    Submit Application
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

function InputGroup({ label, placeholder, name, type = "text", icon, value, onChange, required }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
            <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                    {icon}
                </div>
                <input
                    required={required}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-primary outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all font-medium"
                />
            </div>
        </div>
    )
}
