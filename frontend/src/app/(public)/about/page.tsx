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
