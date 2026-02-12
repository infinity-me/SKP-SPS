"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Calculator, Award } from "lucide-react"

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Cinematic Background Image */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/images/school-img3.jpeg"
                    alt="SKP School Campus"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30 z-10" />
            </motion.div>

            <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-20">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-500 text-xs font-bold tracking-widest uppercase border border-gold-500/20 mb-6 inline-block">
                            Nurturing Excellence Since 2005
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                            Shaping Minds, <br />
                            <span className="text-gold-500">Building Futures.</span>
                        </h1>
                        <p className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed font-light">
                            Welcome to SKP SAINIK PUBLIC SCHOOL. A premier institution in Manihari, dedicated to discipline, academic excellence, and holistic development.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gold-500 text-primary rounded-xl font-bold text-lg flex items-center gap-2 shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-all"
                            >
                                Inquire Now <ArrowRight size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                            >
                                Virtual Tour
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10"
                    >
                        {[
                            { label: "Students", value: "1200+", icon: <BookOpen className="text-gold-500" /> },
                            { label: "Faculty", value: "85+", icon: <Award className="text-gold-500" /> },
                            { label: "Labs", value: "12+", icon: <Calculator className="text-gold-500" /> },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-white font-bold text-xl md:text-2xl">
                                    {stat.icon}
                                    {stat.value}
                                </div>
                                <div className="text-white/50 text-xs md:text-sm font-medium uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-gold-500 rounded-full" />
                </div>
            </motion.div>
        </section>
    )
}
