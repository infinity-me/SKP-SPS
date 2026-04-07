import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeroBlockProps {
    title: string;
    subtitle: string;
    ctaText?: string;
    ctaLink?: string;
    bgImage?: string;
    bgColor?: string;
    textColor?: string;
}

export default function HeroBlock({ 
    title = "Academic Excellence", 
    subtitle = "Nurturing the leaders of tomorrow with discipline and wisdom.",
    ctaText,
    ctaLink,
    bgImage,
    bgColor = "bg-primary",
    textColor = "text-white"
}: HeroBlockProps) {
    return (
        <section className={cn(
            "relative py-32 px-6 overflow-hidden flex items-center justify-center text-center min-h-[60vh]",
            bgColor,
            textColor
        )}>
            {bgImage && (
                <div 
                    className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
            )}
            <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter italic"
                >
                    {title}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed"
                >
                    {subtitle}
                </motion.p>
                {ctaText && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <a 
                            href={ctaLink || "#"} 
                            className="inline-block px-10 py-5 bg-gold-500 text-primary font-black uppercase tracking-widest rounded-2xl hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/20"
                        >
                            {ctaText}
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
