"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    CreditCard,
    Settings,
    Bell,
    Image as ImageIcon,
    FileText,
    ShoppingCart,
    BarChart3,
    LogOut
} from "lucide-react"

const menuItems = [
    {
        group: "General", items: [
            { name: "Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
            { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={18} /> },
        ]
    },
    {
        group: "Management", items: [
            { name: "Students", href: "/admin/students", icon: <GraduationCap size={18} /> },
            { name: "Teachers", href: "/admin/teachers", icon: <Users size={18} /> },
            { name: "Fees & Finance", href: "/admin/fees", icon: <CreditCard size={18} /> },
        ]
    },
    {
        group: "Content CMS", items: [
            { name: "Circulars", href: "/admin/circulars", icon: <Bell size={18} /> },
            { name: "Gallery", href: "/admin/gallery", icon: <ImageIcon size={18} /> },
            { name: "Products & Store", href: "/admin/store", icon: <ShoppingCart size={18} /> },
            { name: "Pages", href: "/admin/pages", icon: <FileText size={18} /> },
        ]
    },
    {
        group: "System", items: [
            { name: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
        ]
    }
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-gold-500 font-black">S</div>
                    <div>
                        <h2 className="font-heading font-bold text-primary text-sm leading-none">SKP Admin</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Management Suite</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-8">
                {menuItems.map((group) => (
                    <div key={group.group} className="space-y-2">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4">{group.group}</h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium",
                                        pathname === item.href
                                            ? "bg-primary text-white shadow-lg shadow-primary/10"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                                    )}
                                >
                                    <span className={cn(pathname === item.href ? "text-gold-500" : "text-slate-400")}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-50">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
