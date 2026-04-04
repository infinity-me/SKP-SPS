"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <section className="bg-primary py-20 px-6 text-center">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">Contact <span className="text-gold-500">Us</span></h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">We are here to help. Reach out to us for any queries or information.</p>
                </div>
            </section>

            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-heading font-bold text-primary">Get in Touch</h2>
                            <p className="text-muted-foreground leading-relaxed">Whether you're a prospective parent, a student, or a community member, we'd love to hear from you.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ContactCard icon={<Phone />} title="Phone" detail="+91 9876543210" sub="Mon-Sat, 8am-4pm" />
                            <ContactCard icon={<Mail />} title="Email" detail="info@skpsainik.edu.in" sub="Response within 24hrs" />
                            <ContactCard icon={<MapPin />} title="Location" detail="Manihari, Uttar Pradesh" sub="View on Google Maps" />
                            <ContactCard icon={<Clock />} title="Hours" detail="8:00 AM - 4:00 PM" sub="Administration Working Hours" />
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100">
                        <h3 className="text-2xl font-heading font-bold text-primary mb-8">Send a Message</h3>
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/20" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                    <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/20">
                                    <option>Admission Inquiry</option>
                                    <option>Fee Related</option>
                                    <option>General Feedback</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                                <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/20" />
                            </div>
                            <button className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-navy-800 transition-all shadow-lg shadow-primary/20">
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

function ContactCard({ icon, title, detail, sub }: any) {
    return (
        <div className="p-6 bg-white rounded-2xl border border-slate-100 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-4">
                {icon}
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
            <p className="font-bold text-primary mb-1">{detail}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{sub}</p>
        </div>
    )
}
