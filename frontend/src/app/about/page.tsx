"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Shield, BookOpen, UserCheck, Star } from "lucide-react"

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
                <div className="max-w-7xl mx-auto">
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
        </div>
    )
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
