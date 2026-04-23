"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Quote, ArrowRight, Star, GraduationCap, BookOpen, Heart, Target } from "lucide-react"

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 },
}

const milestones = [
    { year: "2009", event: "School Founded", desc: "SKP Sainik Public School established in Manihari, Deoria, UP." },
    { year: "2011", event: "CBSE Affiliation", desc: "Received Central Board of Secondary Education affiliation." },
    { year: "2015", event: "NCC Unit Launched", desc: "National Cadet Corps unit inaugurated for defence training." },
    { year: "2018", event: "Smart Classrooms", desc: "Interactive digital boards installed in all classrooms." },
    { year: "2022", event: "100% Board Results", desc: "Achieved perfect pass rate in CBSE Class X & XII boards." },
    { year: "2025", event: "Digital Portal", desc: "Launched full digital student management and payment portal." },
]

export default function PrincipalDeskPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="bg-primary py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute -top-1/4 -right-1/4 w-1/2 h-full bg-gold-500 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Star size={12} fill="currentColor" /> Leadership
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white mb-6"
                    >
                        Principal's <span className="text-gold-500">Desk</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 max-w-2xl mx-auto text-lg"
                    >
                        A word from the heart of SKP Sainik Public School — our guiding philosophy and vision for every cadet.
                    </motion.p>
                </div>
            </section>

            {/* Principal's Message */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
                    {/* Photo Card */}
                    <motion.div {...fadeUp} className="lg:col-span-2 flex flex-col items-center gap-6">
                        <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl border-4 border-gold-500/20 overflow-hidden">
                            <GraduationCap size={80} className="text-gold-500/60" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-heading font-black text-primary">Mrs. Shobha Sharma</h2>
                            <p className="text-gold-500 font-bold uppercase tracking-widest text-sm mt-1">Principal</p>
                            <p className="text-muted-foreground text-sm mt-2">M.A., B.Ed. | 20+ Years Experience</p>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {["CBSE Expert", "Military Values", "Child Psychologist"].map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-bold text-primary">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Message Content */}
                    <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.15 }} className="lg:col-span-3 space-y-8">
                        <div>
                            <span className="text-gold-500 font-bold uppercase tracking-widest text-xs">Message from the Principal</span>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-2">
                                Every Child Carries <span className="text-gold-500">Infinite Potential</span>
                            </h2>
                        </div>

                        <Quote size={40} className="text-gold-500/20" />

                        <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                Dear Parents and Students, it is with great pride and immense joy that I welcome you to SKP Sainik Public School — an institution built not just on academic foundations, but on the bedrock of character, discipline, and national spirit.
                            </p>
                            <p>
                                It is truly said that children are buds — when nurtured properly, they blossom into beautiful flowers. Every child who enters our gates carries within them immense potential. Our mission, as educators and mentors, is to identify that hidden talent, channelize their energy, and mould them into creative, dynamic, and responsible citizens of tomorrow.
                            </p>
                            <p>
                                At SKP, we believe education goes far beyond textbooks. Our unique blend of CBSE academics with military-style discipline, NCC training, and holistic character development creates young men and women who are not just grade-achievers, but nation-builders.
                            </p>
                            <p>
                                I invite every parent to partner with us in this sacred journey. Together — school and family — we can ensure that every child reaches not just their academic potential, but their fullest human potential.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                            <div className="flex-grow">
                                <p className="font-black text-primary text-lg italic">Mrs. Shobha Sharma</p>
                                <p className="text-muted-foreground text-sm">Principal, SKP Sainik Public School</p>
                            </div>
                            <div className="w-16 h-1 bg-gold-500 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-gold-500 font-bold uppercase tracking-widest text-xs">Our Direction</span>
                        <h2 className="text-4xl font-heading font-bold text-primary mt-3">Our Vision & Mission</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: <Target size={28} />,
                                color: "bg-blue-50 text-blue-600 border-blue-200",
                                title: "Our Vision",
                                desc: "To create a nurturing and dynamic learning environment where students develop a passion for knowledge, critical thinking, and lifelong learning. We aim to empower every learner to achieve their full potential, embrace discipline, and become responsible citizens who contribute positively to society and serve the nation with pride.",
                            },
                            {
                                icon: <Heart size={28} />,
                                color: "bg-rose-50 text-rose-600 border-rose-200",
                                title: "Our Mission",
                                desc: "To provide an inclusive, disciplined, and academically rigorous education that nurtures intellectual curiosity, physical fitness, moral values, and a deep sense of national duty. Every student leaving SKP should be equipped not just with knowledge, but with the wisdom and character to lead.",
                            },
                            {
                                icon: <BookOpen size={28} />,
                                color: "bg-amber-50 text-amber-600 border-amber-200",
                                title: "Academic Excellence",
                                desc: "Consistent CBSE board results with 100% pass rates. Personalised mentoring ensures every student reaches their potential. Our students regularly qualify for NDA, medical, engineering, and top universities across India.",
                            },
                            {
                                icon: <GraduationCap size={28} />,
                                color: "bg-emerald-50 text-emerald-600 border-emerald-200",
                                title: "Holistic Development",
                                desc: "Beyond academics — we nurture emotional intelligence, creativity, physical fitness, and social skills. Through NCC, sports, music, drama, and community service, every student grows into a well-rounded individual ready for the world.",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                {...fadeUp}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`p-8 bg-white rounded-3xl border hover:shadow-xl transition-all duration-300`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color} border`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-heading font-bold text-primary mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* School Milestones */}
            <section className="py-24 px-6 bg-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-500/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div {...fadeUp} className="text-center mb-16">
                        <span className="text-gold-500 font-bold uppercase tracking-widest text-xs">Our Journey</span>
                        <h2 className="text-4xl font-heading font-bold text-white mt-3">School Milestones</h2>
                        <p className="text-white/40 mt-3">A timeline of growth, excellence, and achievement.</p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gold-500/20 transform md:-translate-x-1/2" />
                        <div className="space-y-12">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={i}
                                    {...fadeUp}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className={`relative flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
                                >
                                    <div className="md:w-1/2 flex-shrink-0 flex flex-col items-start gap-2 pl-20 md:pl-0 md:items-end">
                                        <span className="text-gold-500 font-black text-2xl">{m.year}</span>
                                        <h4 className="text-white font-bold text-lg">{m.event}</h4>
                                        <p className="text-white/40 text-sm leading-relaxed md:text-right">{m.desc}</p>
                                    </div>
                                    <div className="absolute left-6 md:left-1/2 top-2 w-5 h-5 bg-gold-500 rounded-full border-4 border-primary shadow-[0_0_0_4px_rgba(212,175,55,0.2)] transform md:-translate-x-1/2 flex-shrink-0" />
                                    <div className="md:w-1/2 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto text-center">
                    <h3 className="text-2xl font-heading font-bold text-primary mb-4">
                        Ready to Join the SKP Family?
                    </h3>
                    <p className="text-muted-foreground mb-8">
                        Give your child the foundation they deserve — academic excellence, military discipline, and lifelong values.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/admission" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group">
                            Apply for Admission <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
