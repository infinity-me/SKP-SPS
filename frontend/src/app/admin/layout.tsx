"use client"

import AdminSidebar from "@/components/AdminSidebar"
import { motion } from "framer-motion"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50/50">
            <AdminSidebar />
            <main className="pl-64 min-h-screen transition-all duration-300">
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-1 pt-1 bg-gold-500 rounded-full" />
                        <h2 className="font-heading font-bold text-primary">Control Center</h2>
                    </div>
                </header>
                <div className="p-8">
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
