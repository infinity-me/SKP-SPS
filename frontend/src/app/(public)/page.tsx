import Hero from "@/components/Hero";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Trophy, Users, Lightbulb } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Quick About / Vision Section */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl z-10">
              <Image
                src="/images/about-bg.jpg"
                alt="Students at SKP School"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative background blocks */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold-500 rounded-2xl -z-10 opacity-20 animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary rounded-2xl -z-10 opacity-10" />

            {/* Overlay card */}
            <div className="absolute -bottom-10 left-10 right-10 bg-white p-6 rounded-xl shadow-xl z-20 hidden md:block border border-gold-500/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold-500/10 rounded-lg text-gold-500">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary">Award Winning Excellence</h4>
                  <p className="text-muted-foreground text-sm">Consistent 100% Board Results</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <span className="text-gold-500 font-bold tracking-widest uppercase text-sm">The School</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mt-2">A Legacy of Learning and Discipline.</h2>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              SKP SAINIK PUBLIC SCHOOL, Manihari, stands as a beacon of quality education in Uttar Pradesh. Our mission is to provide an environment that fosters intellectual growth and character building.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Strict Discipline & Military Values",
                "Advanced Science & Computer Labs",
                "Dedicated Sports Complexes",
                "Expert & Mentoring Faculty"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-primary/80 font-medium">
                  <CheckCircle2 className="text-gold-500 shrink-0" size={20} />
                  {item}
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button className="flex items-center gap-2 group text-primary font-bold text-lg hover:text-gold-500 transition-colors">
                Explore Our Philosophy <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Our Core Pillars</h2>
            <p className="text-muted-foreground">We focus on three fundamental aspects for the overall development of our students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Academic Rigor",
                desc: "Challenging curriculum designed to push the boundaries of intellectual capability.",
                icon: <Lightbulb className="w-10 h-10" />
              },
              {
                title: "Physical Excellence",
                desc: "Compulsory sports and drills to ensure the physical well-being of every cadet.",
                icon: <Trophy className="w-10 h-10" />
              },
              {
                title: "Social Responsibility",
                desc: "Inculcating values of service, leadeship and integrity towards the nation.",
                icon: <Users className="w-10 h-10" />
              }
            ].map((pillar, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-500 mb-6">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
