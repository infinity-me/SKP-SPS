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
                            <ContactCard 
                                icon={<Phone />} 
                                title="Phone" 
                                detail="9454331861, 8449790561" 
                                sub="Mon-Sat, 8am-4pm" 
                            />
                            <ContactCard 
                                icon={<Mail />} 
                                title="Email" 
                                detail="skpspsmanihari09@gmail.com" 
                                sub="Response within 24hrs" 
                                href="mailto:skpspsmanihari09@gmail.com"
                            />
                            <ContactCard 
                                icon={<MapPin />} 
                                title="Location" 
                                detail="Manihari, Deoria, UP" 
                                sub="View on Google Maps" 
                                href="https://www.google.com/maps/search/?api=1&query=SKP+Sainik+Public+School+Manihari+Deoria"
                            />
                            <ContactCard 
                                icon={<Clock />} 
                                title="Hours" 
                                detail="8:00 AM - 4:00 PM" 
                                sub="Administration Working Hours" 
                            />
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-xl font-heading font-bold text-primary mb-4">Follow &amp; Connect</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { href:"https://youtube.com/@sps_manihari?si=ZZ1-0mweYj9OgFcQ", label:"YouTube", sub:"@sps_manihari", bg:"bg-red-50 hover:bg-red-600", iconBg:"bg-red-100", textColor:"text-red-600 group-hover:text-white", icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                                    { href:"https://www.facebook.com/share/1Am8M5m43n/", label:"Facebook", sub:"SKP Sainik School", bg:"bg-blue-50 hover:bg-blue-600", iconBg:"bg-blue-100", textColor:"text-blue-600 group-hover:text-white", icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                                    { href:"https://whatsapp.com/channel/0029Vb828N4FHWq2z3g4Sh2m", label:"WhatsApp Channel", sub:"Join for Updates", bg:"bg-green-50 hover:bg-[#25D366]", iconBg:"bg-green-100", textColor:"text-green-600 group-hover:text-white", icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
                                    { href:"https://www.google.com/maps/search/?api=1&query=SKP+Sainik+Public+School+Manihari+Deoria", label:"Google Maps", sub:"Get Directions", bg:"bg-amber-50 hover:bg-amber-500", iconBg:"bg-amber-100", textColor:"text-amber-600 group-hover:text-white", icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> },
                                ].map(s => (
                                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                                        className={`group flex items-center gap-3 p-4 rounded-2xl border border-transparent transition-all duration-300 ${s.bg}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg} group-hover:bg-white/20 transition-colors`}>
                                            <span className={s.textColor}>{s.icon}</span>
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm transition-colors ${s.textColor}`}>{s.label}</p>
                                            <p className="text-[10px] text-slate-400 group-hover:text-white/70 transition-colors">{s.sub}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
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

function ContactCard({ icon, title, detail, sub, href }: any) {
    const content = (
        <div className="p-6 bg-white rounded-2xl border border-slate-100 transition-all hover:shadow-lg h-full">
            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-4">
                {icon}
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
            <p className="font-bold text-primary mb-1">{detail}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{sub}</p>
        </div>
    );

    if (href) {
        return (
            <a href={href} target={href.startsWith('http') ? "_blank" : undefined} rel={href.startsWith('http') ? "noopener noreferrer" : undefined}>
                {content}
            </a>
        );
    }

    return content;
}
