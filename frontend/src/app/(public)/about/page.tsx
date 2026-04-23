"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Shield, BookOpen, UserCheck, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { publicDataService } from "@/lib/api"

export default function AboutPage() {
    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            {/* Hero Header */}
            <section className="bg-primary py-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white mb-6"
                    >
                        About Our <span className="text-gold-500">Institution</span>
                    </motion.h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        SKP SAINIK PUBLIC SCHOOL is more than just a school; it's a foundation for future leaders, built on a legacy of discipline and excellence.
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute -top-1/4 -right-1/4 w-1/2 h-full bg-gold-500 rounded-full blur-[120px]" />
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src="/images/school-img3.jpeg"
                            alt="School Building"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                        <div>
                            <span className="text-gold-500 font-bold uppercase tracking-widest text-sm">Our Philosophy</span>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-2">Nurturing Character & Competence.</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Founded in 2009, SKP school has consistently pushed the boundaries of traditional education. We combine rigorous academic standards with the discipline of a Sainik institution, ensuring our students are prepared for the challenges of the modern world while remaining rooted in core values.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FeatureItem icon={<Shield />} title="Discipline" desc="Integrated military-style values." />
                            <FeatureItem icon={<BookOpen />} title="Vision" desc="Fostering global citizenship." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="bg-white py-24 px-6 border-y border-slate-100">
                <div className="max-w-7xl mx-auto text-primary">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Message from Leadership</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left transition-all hover:shadow-lg">
                            <div className="w-24 h-24 rounded-full bg-primary shrink-0" />
                            <div>
                                <Star className="text-gold-500 mb-4" />
                                <h3 className="text-xl font-bold text-primary mb-1">Shri Satyadev Kushwaha</h3>
                                <p className="text-gold-500 font-bold text-sm uppercase mb-4">Chairman</p>
                                <p className="text-muted-foreground text-sm italic leading-relaxed">
                                    "Education is the most powerful weapon which you can use to change the world. At SKP, we forge that weapon with discipline."
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left transition-all hover:shadow-lg">
                            <div className="w-24 h-24 rounded-full bg-primary shrink-0" />
                            <div>
                                <UserCheck className="text-gold-500 mb-4" />
                                <h3 className="text-xl font-bold text-primary mb-1">Mrs. Shobha Sharma</h3>
                                <p className="text-gold-500 font-bold text-sm uppercase mb-4">Principal</p>
                                <p className="text-muted-foreground text-sm italic leading-relaxed">
                                    "Our focus is not just on producing graduates, but on producing responsible citizens with a strong moral compass."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Media Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-primary">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-gold-500 text-xs font-black uppercase tracking-widest mb-3">Stay Connected</p>
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-4">Follow SKP Sainik School</h2>
                    <p className="text-white/50 max-w-xl mx-auto mb-12">Stay up to date with school events, achievements, notices and more across all our platforms.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { href:"https://youtube.com/@sps_manihari?si=ZZ1-0mweYj9OgFcQ", label:"YouTube", handle:"@sps_manihari", bg:"hover:bg-red-600", border:"border-red-500/30", emoji:"▶️", icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, iconColor:"text-red-400" },
                            { href:"https://www.facebook.com/share/1Am8M5m43n/", label:"Facebook", handle:"SKP Sainik School", bg:"hover:bg-blue-600", border:"border-blue-500/30", emoji:"📘", icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, iconColor:"text-blue-400" },
                            { href:"https://whatsapp.com/channel/0029Vb828N4FHWq2z3g4Sh2m", label:"WhatsApp", handle:"School Channel", bg:"hover:bg-[#25D366]", border:"border-green-500/30", emoji:"💬", icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, iconColor:"text-green-400" },
                            { href:"https://www.google.com/maps/search/?api=1&query=SKP+Sainik+Public+School+Manihari+Deoria", label:"Google Maps", handle:"Get Directions", bg:"hover:bg-amber-500", border:"border-amber-500/30", emoji:"📍", icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>, iconColor:"text-amber-400" },
                        ].map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                                className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border bg-white/5 ${s.border} ${s.bg} transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                                <span className={`${s.iconColor} group-hover:text-white transition-colors`}>{s.icon}</span>
                                <div className="text-center">
                                    <p className="font-black text-white text-sm">{s.label}</p>
                                    <p className="text-white/40 text-[10px] group-hover:text-white/70 transition-colors">{s.handle}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore More Section - Dynamic */}
            <ExploreMoreSection />

        </div>
    )
}

function ExploreMoreSection() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = async (type: string) => {
        setActiveModal(type);
        setIsLoading(true);
        try {
            let res;
            if (type === 'faculty') res = await publicDataService.getTeachers();
            else if (type === 'hall-of-fame') res = await publicDataService.getToppers();
            else if (type === 'guidelines') res = await publicDataService.getRules();
            setData(res?.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-[#0A192F] py-32 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-xs">About Us</span>
                    <h2 className="text-5xl md:text-7xl font-heading font-black text-white mt-4 mb-6">Explore <span className="text-gold-500">More</span></h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg">
                        Discover our dedicated faculty, school guidelines, and celebrate the bright minds who have made us proud.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ExploreCard 
                        icon="👨‍🏫" 
                        title="Our Faculty"
                        desc="Meet our highly qualified and experienced educators who make SKP shine."
                        btnText="View Faculty"
                        onClick={() => openModal('faculty')}
                    />
                    <ExploreCard 
                        icon="📋" 
                        title="Rules & Regulations"
                        desc="Complete school handbook covering general rules, discipline, and attendance policy."
                        btnText="Read Guidelines"
                        active
                        onClick={() => openModal('guidelines')}
                    />
                    <ExploreCard 
                        icon="🏆" 
                        title="Topper Students"
                        desc="Celebrating our board exam achievers. Hall of Fame for academic excellence."
                        btnText="View Hall of Fame"
                        featured
                        onClick={() => openModal('hall-of-fame')}
                    />
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gold-500/5 blur-[150px] rounded-full pointer-events-none" />

            {/* Detail Modal */}
            <ViewDetailModal 
                isOpen={!!activeModal} 
                onClose={() => { setActiveModal(null); setData([]); }}
                type={activeModal}
                data={data}
                isLoading={isLoading}
            />
        </section>
    );
}

function ExploreCard({ icon, title, desc, btnText, active, featured, onClick }: any) {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className={cn(
                "p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-start gap-8 group h-full",
                active ? "bg-white/5 border-gold-500/30 " : "bg-white/[0.02] border-white/5 hover:border-white/20",
                featured && "relative"
            )}
        >
            {featured && (
                <div className="absolute -top-4 -right-2 bg-gradient-to-r from-gold-400 to-gold-600 text-primary text-[10px] font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                    <Star size={12} fill="currentColor" /> FEATURED
                </div>
            )}
            
            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                active ? "bg-gold-500/10" : "bg-white/5 shadow-inner"
            )}>
                {icon}
            </div>

            <div className="space-y-4 flex-grow">
                <h3 className="text-2xl font-heading font-bold text-white group-hover:text-gold-500 transition-colors">{title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{desc}</p>
            </div>

            <button 
                onClick={onClick}
                className={cn(
                    "text-sm font-black flex items-center gap-2 transition-all group/btn pt-4",
                    active ? "text-gold-500" : "text-white/60 hover:text-white"
                )}
            >
                {btnText} 
                <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
            </button>
        </motion.div>
    );
}

function ViewDetailModal({ isOpen, onClose, type, data, isLoading }: any) {
    if (!isOpen) return null;

    const titles: any = {
        'faculty': 'Our Distinguished Faculty',
        'hall-of-fame': 'Hall of Fame - Toppers',
        'guidelines': 'School Rules & Guidelines'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#0A192F]/90 backdrop-blur-xl"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[85vh] overflow-hidden relative shadow-2xl flex flex-col border border-white/10"
            >
                <div className="p-10 sm:p-14 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <span className="text-gold-500 font-black uppercase tracking-widest text-[10px]">Information Portal</span>
                        <h2 className="text-3xl font-heading font-black text-primary mt-2">{titles[type]}</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-14 h-14 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all rotate-0 hover:rotate-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-10 sm:p-14 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-primary">
                            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                            <p className="font-bold animate-pulse">Retrieving from Database...</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {data.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 italic">
                                    No records found in the database.
                                </div>
                            ) : (
                                <div className={cn(
                                    "grid gap-8",
                                    type === 'faculty' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
                                    type === 'hall-of-fame' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                                )}>
                                    {data.map((item: any, idx: number) => (
                                        <motion.div 
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={cn(
                                                "p-8 rounded-3xl transition-all h-full",
                                                type === 'guidelines' ? "bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl group" : 
                                                "bg-white border border-slate-100 hover:shadow-2xl hover:border-gold-500/30"
                                            )}
                                        >
                                            {type === 'faculty' && (
                                                <div className="space-y-6">
                                                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center overflow-hidden">
                                                        {item.profilePic ? (
                                                            <img src={item.profilePic} className="w-full h-full object-cover" alt={item.name} />
                                                        ) : (
                                                            <UserCheck className="text-white" size={32} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-primary mb-1">{item.name}</h4>
                                                        <p className="text-gold-500 font-bold text-[10px] uppercase tracking-wider mb-3">{item.designation}</p>
                                                        <div className="h-px w-10 bg-slate-200 mb-3" />
                                                        <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.qualification}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {type === 'hall-of-fame' && (
                                                <div className="text-center space-y-6">
                                                    <div className="relative inline-block">
                                                        <div className="w-24 h-24 rounded-full border-4 border-gold-400/20 p-1">
                                                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                                                                {item.profilePic ? (
                                                                    <img src={item.profilePic} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full text-slate-300">
                                                                        <Star size={32} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 bg-gold-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-lg">
                                                            {idx + 1}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-primary">{item.name}</h4>
                                                        <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Class {item.class} • {item.topperYear}</p>
                                                        <div className="mt-4 bg-gold-500/10 text-gold-600 px-4 py-2 rounded-xl text-xl font-black inline-block">
                                                            {item.topperPercent}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {type === 'guidelines' && (
                                                <div className="flex gap-6 items-start">
                                                    <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-xl font-black shrink-0 group-hover:bg-gold-500 transition-colors">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
                                                        <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="p-8 bg-slate-50 border-t border-slate-100 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    SKP Sainik Public School • Official Internal Data
                </div>
            </motion.div>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: any) {
    return (
        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:text-gold-500 transition-colors">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-primary">{title}</h4>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
        </div>
    )
}
