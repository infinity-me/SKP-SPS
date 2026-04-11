"use client"

import { useState } from "react"
import AdminSidebar from "@/components/AdminSidebar"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50/50">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className={cn(
                "lg:pl-64 min-h-screen transition-all duration-300",
                isSidebarOpen ? "max-lg:overflow-hidden" : ""
            )}>
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-500 hover:text-primary lg:hidden transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="h-10 w-1 pt-1 bg-gold-500 rounded-full hidden sm:block" />
                        <h2 className="font-heading font-bold text-primary">Control Center</h2>
                    </div>
                </header>
                <div className="p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
