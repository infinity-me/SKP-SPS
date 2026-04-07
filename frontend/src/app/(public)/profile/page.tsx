"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    MapPin, 
    Trophy, 
    CreditCard, 
    Camera, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    ArrowRight,
    Edit3,
    X,
    Upload,
    ChevronRight,
    ShieldCheck,
    GraduationCap,
    School,
    Newspaper,
    Bell
} from "lucide-react"
import { authService, feeService } from "@/lib/api"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("profile")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [profilePicUrl, setProfilePicUrl] = useState("")

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await authService.getProfile()
            if (res.success) {
                setUser(res.user)
                setProfilePicUrl(res.user.profilePic || "")
            }
        } catch (error) {
            console.error("Failed to fetch profile")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        try {
            setLoading(true)
            const res = await authService.uploadAvatar(file)
            if (res.success) {
                setProfilePicUrl(res.avatarUrl)
                // Also update local storage user if needed (api.ts already does it)
                alert("Profile picture updated from device!")
                fetchProfile()
            }
        } catch (error) {
            alert("Failed to upload image. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center space-y-4">
            <AlertCircle size={48} className="text-red-500" />
            <h1 className="text-2xl font-heading font-black text-primary uppercase italic">Access Denied</h1>
            <p className="text-slate-500">Please login to view your digital profile.</p>
            <a href="/login" className="px-8 py-3 bg-primary text-white rounded-xl font-bold">Login Now</a>
        </div>
    )

    const studentData = user.studentProfile
    const teacherData = user.teacherProfile

    // Calculate Fees Summary (Student only)
    const fees = studentData?.fees || []
    const totalFees = fees.reduce((sum: number, f: any) => sum + f.amount, 0)
    const paidFees = fees.filter((f: any) => f.status === 'paid').reduce((sum: number, f: any) => sum + f.amount, 0)
    const pendingFees = totalFees - paidFees

    return (
        <div className="min-h-screen bg-slate-50/50 pt-10 pb-20 px-6 relative overflow-hidden">
            {/* 🎨 Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
            
            <div className="max-w-6xl mx-auto space-y-10 relative">
                
                {/* 🏷️ Page Header */}
                <header className="space-y-2 border-b border-slate-200 pb-8">
                    <div className="flex items-center gap-3 text-gold-500">
                        <ShieldCheck size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official School Portal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-primary uppercase italic tracking-tighter">
                        Digital <span className="text-gold-500">Profile</span> Dashboard
                    </h1>
                    <p className="text-slate-400 text-sm font-medium italic">Welcome back, {user.name}. Manage your credentials and academic record here.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Left Column: ALL MINI BOXES */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* ID Card Visualization */}
                        <div className="bg-primary rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10 group">
                            {/* ID Card Header */}
                            <div className="p-8 bg-gradient-to-br from-primary to-navy-900 border-b border-gold-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <School className="text-gold-500" size={20} />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">SKP SAINIK SCHOOL</span>
                                </div>
                                <ShieldCheck className="text-gold-500" size={20} />
                            </div>
                            
                            {/* ID Card Body */}
                            <div className="p-10 text-center space-y-6">
                                <div className="relative inline-block">
                                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-gold-500 shadow-xl bg-white/5 mx-auto">
                                        {profilePicUrl ? (
                                            <img src={profilePicUrl} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gold-500/50">
                                                <User size={64} />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 p-3 bg-gold-500 text-primary rounded-2xl shadow-xl hover:scale-110 transition-all cursor-pointer">
                                        <Camera size={18} />
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleUpdatePhoto}
                                        />
                                    </label>
                                </div>

                                <div className="space-y-1 pt-4">
                                    <h2 className="text-2xl font-heading font-black text-white uppercase italic tracking-tight">{user.name}</h2>
                                    <p className="text-gold-500 font-bold uppercase tracking-[0.2em] text-xs">
                                        {user.role === 'student' ? `CADET : ${studentData?.admissionNo || 'N/A'}` : `STAFF : ${teacherData?.staffId || 'N/A'}`}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                    <div className="text-left space-y-1">
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Identity</p>
                                        <p className="text-[11px] font-bold text-white uppercase">{user.role}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Valid Till</p>
                                        <p className="text-[11px] font-bold text-white uppercase">2026-27 Session</p>
                                    </div>
                                </div>
                            </div>

                            {/* ID Card Footer - QR & Seal */}
                            <div className="p-6 bg-gold-500/5 flex items-center justify-between border-t border-white/5">
                                <div className="flex flex-col gap-1">
                                    <p className="text-[7px] text-white/30 uppercase tracking-[0.2em] font-black">Authorized by</p>
                                    <p className="text-[9px] text-gold-500/80 uppercase font-bold tracking-widest">SKP Board of EDU</p>
                                </div>
                                <div className="relative">
                                    <ShieldCheck size={32} className="text-gold-500/20" />
                                    <CheckCircle2 size={16} className="text-gold-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </div>

                        {/* Key Information Box */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <GraduationCap className="text-gold-500" size={16} /> Key Information
                            </h3>
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 font-medium lowercase">Enrollment Status:</span>
                                    <span className="text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> Active</span>
                                </div>
                                {user.role === 'student' && (
                                    <>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-medium lowercase">Class & Section:</span>
                                            <span className="text-primary font-bold">{studentData?.class}-{studentData?.section}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-medium lowercase">Roll Number:</span>
                                            <span className="text-primary font-bold">#{studentData?.rollNo || '--'}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 📰 News & Circulars Box (NEW CONTENT BOX) */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <Bell className="text-gold-500" size={16} /> Recent Circulars
                            </h3>
                            <div className="space-y-3 pt-2">
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1 border-l-4 border-gold-500">
                                    <p className="text-[10px] font-black text-primary uppercase">Summer Break Schedule</p>
                                    <p className="text-[9px] text-slate-400 font-bold tracking-tight">Released: 12 April, 2026</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1 border-l-4 border-primary">
                                    <p className="text-[10px] font-black text-primary uppercase">Military Drill Exams</p>
                                    <p className="text-[9px] text-slate-400 font-bold tracking-tight">Released: 05 April, 2026</p>
                                </div>
                            </div>
                        </div>

                        {/* 📞 Quick Contacts Box */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <Phone className="text-gold-500" size={16} /> Help & Support
                            </h3>
                            <div className="grid grid-cols-1 gap-3 pt-2">
                                <a href="tel:+910000000000" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-gold-500/10 transition-colors group">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Emergency</span>
                                    <Phone size={14} className="text-primary group-hover:text-gold-600" />
                                </a>
                                <a href="mailto:support@skp.com" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-gold-500/10 transition-colors group">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Admin Office</span>
                                    <Mail size={14} className="text-primary group-hover:text-gold-600" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: DETAILED TABS */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 📊 Quick Stats Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Attendance", value: "94%", color: "text-emerald-500", icon: CheckCircle2 },
                                { label: "Behavior", value: "Excel", color: "text-gold-500", icon: ShieldCheck },
                                { label: "Medals", value: "02", color: "text-primary", icon: Trophy },
                                { label: "Grade", value: "A+", color: "text-secondary", icon: GraduationCap },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-1 items-center justify-center text-center">
                                    <stat.icon size={16} className={cn("mb-1", stat.color)} />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className={cn("text-lg font-heading font-black italic", stat.color)}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tabs Header */}
                        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                            {["profile", "fees", "achievements"].map((tab) => (
                                user.role !== 'student' && tab === 'fees' ? null : (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                            activeTab === tab ? "bg-primary text-gold-500 shadow-lg shadow-primary/10" : "text-slate-400 hover:text-primary"
                                        )}
                                    >
                                        {tab === "profile" ? "About Me" : tab === "fees" ? "Finance & Fees" : "Achievements"}
                                    </button>
                                )
                            ))}
                        </div>

                        <div className="min-h-[500px]">
                            <AnimatePresence mode="wait">
                                {activeTab === "profile" && (
                                    <motion.div
                                        key="profile"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-12">
                                            <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                                                <h2 className="text-2xl font-heading font-black text-primary uppercase italic">Cadet Information</h2>
                                                <button className="flex items-center gap-2 text-xs font-black uppercase text-gold-500 hover:text-primary transition-all">
                                                    <Edit3 size={16} /> Edit Profile
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Mail size={12}/> Email Address</label>
                                                    <p className="text-sm font-bold text-primary">{user.email}</p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Phone size={12}/> Contact Number</label>
                                                    <p className="text-sm font-bold text-primary">{user.phone || "Not Provided"}</p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12}/> Resident Address</label>
                                                    <p className="text-sm font-bold text-primary">{studentData?.address || "Manihari Vil., UP"}</p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12}/> Date of Birth</label>
                                                    <p className="text-sm font-bold text-primary">{studentData?.dob ? new Date(studentData.dob).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🎯 Aspirations Section */}
                                        <div className="bg-primary p-8 md:p-12 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-12 -rotate-12 opacity-5 text-gold-500">
                                                <GraduationCap size={150} />
                                            </div>
                                            <h3 className="text-xl font-heading font-black uppercase italic text-gold-500">Future Aspirations</h3>
                                            <p className="text-sm font-medium leading-relaxed opacity-80 max-w-2xl">
                                                "Committed to pursuing excellence in both academic and physical training. My goal is to represent the school in national level competitions and maintain a record of integrity and leadership in all Cadet drills."
                                            </p>
                                            <div className="pt-4 flex items-center gap-6">
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-white/40 tracking-[0.3em] mb-1">Career Path</p>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-gold-500">Defense & Engineering</p>
                                                </div>
                                                <div className="w-px h-8 bg-white/10" />
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-white/40 tracking-[0.3em] mb-1">Key Focus</p>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-gold-500">Leadership</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "fees" && (
                                    <motion.div
                                        key="fees"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Fees</p>
                                                <p className="text-2xl font-heading font-black text-primary italic">₹{totalFees.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid Amount</p>
                                                <p className="text-2xl font-heading font-black text-emerald-500 italic">₹{paidFees.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-[2rem] border border-gold-500/20 shadow-xl shadow-gold-500/5 space-y-2">
                                                <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Remaining balance</p>
                                                <p className="text-2xl font-heading font-black text-primary italic">₹{pendingFees.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                                <h3 className="font-heading font-bold text-primary uppercase italic">Transaction History</h3>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Clock size={12} /> Real-time tracking
                                                </div>
                                            </div>
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-50/50">
                                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Type</th>
                                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-sm">
                                                    {fees.map((fee: any) => (
                                                        <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-8 py-6 font-bold text-primary uppercase tracking-tight">{fee.type}</td>
                                                            <td className="px-8 py-6 font-mono text-slate-500">₹{fee.amount.toLocaleString()}</td>
                                                            <td className="px-8 py-6">
                                                                <span className={cn(
                                                                    "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                                                    fee.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                                                )}>
                                                                    {fee.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {fees.length === 0 && (
                                                        <tr>
                                                            <td colSpan={3} className="py-20 text-center text-slate-400 italic">No fee records found for this account.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "achievements" && (
                                    <motion.div
                                        key="achievements"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-8 bg-gold-500 rounded-[2.5rem] text-primary space-y-4 shadow-xl shadow-gold-500/20">
                                                <Trophy size={48} className="text-primary/50" />
                                                <h3 className="text-2xl font-heading font-black uppercase italic tracking-tighter">Academic Star</h3>
                                                <p className="text-sm font-medium opacity-80">Consistent performance in quarterly assessments and term finals.</p>
                                            </div>
                                            <div className="p-8 bg-primary rounded-[2.5rem] text-white border border-white/10 space-y-4 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-8 rotate-12 opacity-5 text-gold-500">
                                                    <Trophy size={100} />
                                                </div>
                                                <Trophy size={48} className="text-gold-500" />
                                                <h3 className="text-2xl font-heading font-black uppercase italic tracking-tighter">Milestone Reached</h3>
                                                <p className="text-sm font-medium opacity-60">Successfully completed the 2025 Military Leadership Drill program.</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-12 text-center rounded-[3rem] border border-dashed border-slate-200">
                                            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-6 text-slate-300">
                                                <GraduationCap size={32} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 lowercase">Your achievements and certificates are verified by the school board.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
