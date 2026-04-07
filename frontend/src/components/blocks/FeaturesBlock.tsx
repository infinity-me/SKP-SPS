import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureItem {
    title: string;
    description: string;
}

interface FeaturesBlockProps {
    heading?: string;
    subheading?: string;
    features: FeatureItem[];
    bgColor?: string;
    columns?: number;
}

export default function FeaturesBlock({ 
    heading = "Top Features", 
    subheading = "What makes our school stand out.",
    features = [],
    bgColor = "bg-white",
    columns = 3
}: FeaturesBlockProps) {
    return (
        <section className={cn("py-24 px-6", bgColor)}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-heading font-black text-primary uppercase italic"
                    >
                        {heading}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-slate-500 max-w-2xl mx-auto"
                    >
                        {subheading}
                    </motion.p>
                </div>
                
                <div className={cn(
                    "grid gap-8",
                    columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
                )}>
                    {features.map((feature, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                        >
                            <CheckCircle2 className="text-gold-500 mb-6" size={32} />
                            <h3 className="text-xl font-heading font-bold text-primary mb-3">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
