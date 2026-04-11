"use client"

import Hero from "@/components/Hero";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Trophy,
  Users,
  Lightbulb,
  Shield,
  Star,
  BookOpen,
  GraduationCap,
  Target,
  Cpu,
  FlaskConical,
  Dumbbell,
  Music,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";
import { publicDataService } from "@/lib/api";
import { cn } from "@/lib/utils";
import NoticeTicker from "@/components/NoticeTicker";
import { useState, useEffect } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

export default function Home() {
  const [stats, setStats] = useState({ students: 600, teachers: 25 });
  const [feed, setFeed] = useState<{notices: any[], events: any[]}>({ notices: [], events: [] });
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statsRes, noticeRes, eventRes, photoRes] = await Promise.all([
          publicDataService.getStats(),
          publicDataService.getNotices(),
          publicDataService.getUpcomingEvents(),
          publicDataService.getRecentPhotos()
        ]);
        
        if (statsRes.data?.data) {
          setStats({
            students: (statsRes.data.data.students || 0) + 500, // Premium boost
            teachers: (statsRes.data.data.teachers || 0) >= 25 ? statsRes.data.data.teachers : 25
          });
        }
        
        setFeed({
          notices: noticeRes.data?.data || [],
          events: eventRes.data?.data || []
        });
        
        setPhotos(photoRes.data?.data || []);
      } catch (err) {
        console.error("Home page data fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <>
      <NoticeTicker />
      <Hero />

      {/* ─── Stats Bar ─────────────────────────────── */}
      <section className="bg-primary py-10 px-6 border-b border-gold-500/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: `${stats.students}+`, label: "Students Enrolled", icon: <Users size={22} className="text-gold-500" /> },
            { value: `${stats.teachers}+`, label: "Expert Faculty", icon: <GraduationCap size={22} className="text-gold-500" /> },
            { value: "100%", label: "Board Pass Rate", icon: <Trophy size={22} className="text-gold-500" /> },
            { value: "15+", label: "Years of Excellence", icon: <Star size={22} className="text-gold-500" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-1">
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-white/50 text-sm font-medium uppercase tracking-widest">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── About / Vision Section ─────────────────── */}
      <section className="py-16 md:py-28 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/80 -z-0" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <motion.div {...fadeUp} className="w-full lg:w-5/12 relative flex-shrink-0">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-bg.jpg"
                alt="Students at SKP School"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-8 -right-8 bg-white p-5 rounded-2xl shadow-2xl border border-gold-500/10 hidden md:flex items-center gap-4 max-w-xs">
              <div className="p-3 bg-gold-500/10 rounded-xl text-gold-500 flex-shrink-0">
                <Trophy size={28} />
              </div>
              <div>
                <p className="font-bold text-primary text-base leading-tight">Award Winning</p>
                <p className="text-muted-foreground text-sm">Consistent 100% Board Results</p>
              </div>
            </div>
            {/* Top decorative accent */}
            <div className="absolute -top-6 -left-6 w-28 h-28 bg-gold-500 rounded-2xl opacity-15 -z-10 animate-pulse" />
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.15 }} className="w-full lg:w-7/12 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-bold tracking-widest uppercase mb-4">
                <Shield size={14} /> About The School
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mt-2 leading-tight">
                A Legacy of Learning <br />
                <span className="text-gold-500">and Discipline.</span>
              </h2>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              SKP SAINIK PUBLIC SCHOOL, Manihari, stands as a beacon of quality education in Uttar Pradesh. Founded on the principles of military discipline and academic rigour, our mission is to produce well-rounded individuals ready to serve the nation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Strict Discipline & Military Values",
                "Advanced Science & Computer Labs",
                "Dedicated Sports Complexes",
                "Expert & Mentoring Faculty",
                "CBSE Affiliated Curriculum",
                "NCC & Defence Coaching",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-primary/80 font-medium text-sm">
                  <CheckCircle2 className="text-gold-500 shrink-0" size={18} />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/about" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group">
                Explore Philosophy <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/admission" className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
                Apply Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Core Pillars ─────────────────────────── */}
      <section className="py-16 md:py-28 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
              <Target size={14} /> Our Approach
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Our Core Pillars</h2>
            <p className="text-muted-foreground text-lg">
              Three fundamental dimensions shaping the leaders of tomorrow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Academic Rigour",
                desc: "Challenging CBSE curriculum designed to push students beyond their intellectual limits while building strong foundational knowledge.",
                icon: <Lightbulb className="w-8 h-8" />,
                color: "from-amber-400/20 to-yellow-500/5",
                accent: "text-amber-500",
                border: "border-amber-200",
              },
              {
                title: "Physical Excellence",
                desc: "Compulsory physical training, drills, and sports programs ensure every cadet develops strength, endurance, and sportsmanship.",
                icon: <Dumbbell className="w-8 h-8" />,
                color: "from-blue-400/20 to-blue-500/5",
                accent: "text-blue-500",
                border: "border-blue-200",
              },
              {
                title: "Character Building",
                desc: "Inculcating military values of integrity, patriotism, and service to nurture responsible citizens who lead with honour.",
                icon: <Shield className="w-8 h-8" />,
                color: "from-emerald-400/20 to-emerald-500/5",
                accent: "text-emerald-600",
                border: "border-emerald-200",
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`p-8 bg-white rounded-3xl border ${pillar.border} hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center ${pillar.accent} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.desc}</p>
                <div className={`mt-6 flex items-center gap-2 font-bold text-sm ${pillar.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ArrowRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Facilities Grid ──────────────────────── */}
      <section className="py-16 md:py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-bold tracking-widest uppercase mb-4">
              <Cpu size={14} /> Infrastructure
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">World-Class Facilities</h2>
            <p className="text-muted-foreground text-lg">Every resource a student needs to excel — right here on campus.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: "Science Labs", icon: <FlaskConical size={28} />, bg: "bg-rose-50", text: "text-rose-500", desc: "State-of-the-art Physics, Chemistry & Biology labs" },
              { label: "Computer Lab", icon: <Cpu size={28} />, bg: "bg-blue-50", text: "text-blue-500", desc: "High-speed internet & latest systems" },
              { label: "Sports Ground", icon: <Dumbbell size={28} />, bg: "bg-green-50", text: "text-green-600", desc: "Multi-sport ground & fitness centre" },
              { label: "Library", icon: <BookOpen size={28} />, bg: "bg-amber-50", text: "text-amber-600", desc: "10,000+ books & digital resources" },
              { label: "Music Room", icon: <Music size={28} />, bg: "bg-purple-50", text: "text-purple-500", desc: "Instruments for all genres" },
              { label: "NCC Training", icon: <Shield size={28} />, bg: "bg-slate-100", text: "text-slate-600", desc: "Para-military drills & cadet training" },
              { label: "Smart Classrooms", icon: <Lightbulb size={28} />, bg: "bg-yellow-50", text: "text-yellow-600", desc: "Interactive boards in every class" },
              { label: "Hostel", icon: <Users size={28} />, bg: "bg-teal-50", text: "text-teal-600", desc: "Safe, clean residential facility" },
            ].map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`${f.bg} rounded-2xl p-6 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default group`}
              >
                <div className={`${f.text} mb-1 group-hover:scale-110 transition-transform`}>{f.icon}</div>
                <h4 className="font-bold text-primary text-base">{f.label}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live Campus Feed ─────────────────────── */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Notices Hub */}
            <div>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-heading font-black text-primary">Live Announcements</h2>
                  <div className="h-1.5 w-12 bg-gold-500 mt-3 rounded-full" />
                </div>
                <Link href="/circulars" className="text-gold-600 font-bold text-sm hover:underline">View All</Link>
              </div>

              <div className="space-y-4">
                {feed.notices.length > 0 ? feed.notices.map((notice, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-start gap-4 group cursor-pointer hover:bg-white hover:shadow-xl transition-all"
                  >
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center text-lg font-bold rounded-2xl group-hover:bg-gold-500 transition-colors">
                      {new Date(notice.date).getDate()}
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(notice.date).toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
                      <h4 className="font-bold text-primary group-hover:text-gold-600 transition-colors">{notice.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{notice.message}</p>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-slate-400 italic">No new announcements at the moment.</p>
                )}
              </div>
            </div>

            {/* Calendar Hub */}
            <div>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-heading font-black text-primary">Upcoming Events</h2>
                  <div className="h-1.5 w-12 bg-primary mt-3 rounded-full" />
                </div>
                <Link href="/calendar" className="text-primary font-bold text-sm hover:underline">Full Calendar</Link>
              </div>

              <div className="space-y-4">
                {feed.events.length > 0 ? feed.events.map((event, i) => (
                  <motion.div 
                    key={i}
                    className="p-6 border border-slate-100 rounded-3xl flex items-center gap-6 group hover:border-primary/20 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl font-black text-primary border border-slate-200">
                      <span className="text-xl leading-none">{new Date(event.date).getDate()}</span>
                      <span className="text-[10px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-primary text-lg">{event.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock size={14} /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin size={14} /> Campus</span>
                      </div>
                    </div>
                    <Calendar className="text-primary/10 group-hover:text-primary/40 transition-colors" size={32} />
                  </motion.div>
                )) : (
                  <p className="text-slate-400 italic">No scheduled events for the near future.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Recent Highlights ─────────────────────── */}
      <section className="py-24 px-6 bg-[#0A192F] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <div className="max-w-xl">
              <span className="text-gold-500 font-bold uppercase tracking-[.3em] text-xs">Visual Journey</span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-white mt-4">Campus Highlights</h2>
              <p className="text-white/40 mt-4 text-lg">Glimpses of life at SKP — where every moment is a step towards greatness.</p>
            </div>
            <Link href="/gallery" className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-3">
              Browse Gallery <ExternalLink size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.length > 0 ? photos.map((photo, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="aspect-square relative rounded-3xl overflow-hidden group cursor-pointer"
              >
                <img src={photo.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Highlight" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-bold text-lg">{photo.title || "Campus Life"}</p>
                </div>
              </motion.div>
            )) : (
              [1, 2, 3].map((_, i) => (
                <div key={i} className="aspect-square bg-white/5 rounded-3xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────── */}
      <section className="relative py-16 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="absolute top-0 left-0 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

        <motion.div {...fadeUp} className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold tracking-widest uppercase mb-8">
            <Star size={14} fill="currentColor" /> Admissions Open 2025–26
          </span>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            Begin Your Child's <br />
            <span className="text-gold-500">Journey to Greatness</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Limited seats available. Secure your child's future at SKP SAINIK PUBLIC SCHOOL — where discipline meets excellence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/admission"
              className="px-10 py-4 bg-gold-500 text-primary rounded-2xl font-bold text-lg hover:bg-gold-400 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:shadow-[0_10px_60px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Apply for Admission <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2"
            >
              <Phone size={18} /> Contact Us
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Testimonials ────────────────────────────── */}
      <section className="py-16 md:py-28 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
              <Star size={14} /> Testimonials
            </span>
            <h2 className="text-4xl font-heading font-bold text-primary">What Parents Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ramesh Kumar",
                role: "Parent of Class X Student",
                quote: "The discipline instilled here has transformed my son into a confident, responsible young man. The faculty is dedicated and the results speak for themselves.",
              },
              {
                name: "Priya Sharma",
                role: "Parent of Class VIII Student",
                quote: "Best decision we ever made. The school's environment is safe, nurturing, and academically rigorous. My daughter loves every day here.",
              },
              {
                name: "Suresh Yadav",
                role: "Alumni Parent",
                quote: "My child secured a merit seat in NDA entrance after the NCC coaching here. SKP SAINIK SCHOOL genuinely prepares students for national service.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={16} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quick Contact Strip ─────────────────────── */}
      <section className="py-14 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-heading font-bold text-primary">Have questions?</h3>
            <p className="text-muted-foreground">Reach out to us anytime. We're happy to help.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <a href="tel:9454331861" className="flex items-center gap-3 text-primary font-medium hover:text-gold-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <Phone size={18} className="text-primary" />
              </div>
              9454331861, 8449790561
            </a>
            <a href="mailto:skpspsmanihari09@gmail.com" className="flex items-center gap-3 text-primary font-medium hover:text-gold-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <Mail size={18} className="text-primary" />
              </div>
              skpspsmanihari09@gmail.com
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=SKP+Sainik+Public+School+Manihari+Deoria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary font-medium hover:text-gold-500 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <MapPin size={18} className="text-primary" />
              </div>
              Manihari, Deoria, UP
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
