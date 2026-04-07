import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ContentBlockProps {
    heading?: string;
    body: string;
    image?: string;
    imagePosition?: "left" | "right";
    bgColor?: string;
}

export default function ContentBlock({
    heading,
    body = "Add your content here...",
    image,
    imagePosition = "right",
    bgColor = "bg-white"
}: ContentBlockProps) {
    return (
        <section className={cn("py-24 px-6", bgColor)}>
            <div className={cn(
                "max-w-7xl mx-auto flex flex-col items-center gap-16",
                imagePosition === "left" ? "lg:flex-row-reverse" : "lg:flex-row"
            )}>
                <div className="w-full lg:w-1/2 space-y-8">
                    {heading && (
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-3xl md:text-5xl font-heading font-black text-primary uppercase italic"
                        >
                            {heading}
                        </motion.h2>
                    )}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg leading-relaxed whitespace-pre-wrap font-medium"
                    >
                        {body}
                    </motion.div>
                </div>
                
                {image && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-full lg:w-1/2 relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border border-slate-100"
                    >
                        <img src={image} alt={heading || "Content Image"} className="w-full h-full object-cover" />
                    </motion.div>
                )}
            </div>
        </section>
    )
}
