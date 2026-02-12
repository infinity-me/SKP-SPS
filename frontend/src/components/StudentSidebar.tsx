"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    User,
    CreditCard,
    Calendar,
    FileCheck,
    BookOpen,
    Bell,
    ShoppingCart,
    LogOut
} from "lucide-react"

const studentMenuItems = [
    {
        group: "Academic", items: [
            { name: "Dashboard", href: "/student", icon: <LayoutDashboard size={18} /> },
            { name: "Attendance", href: "/student/attendance", icon: <Calendar size={18} /> },
            { name: "Results", href: "/student/results", icon: <FileCheck size={18} /> },
            { name: "Homework", href: "/student/homework", icon: <BookOpen size={18} /> },
        ]
    },
    {
        group: "Financial", items: [
            { name: "Pay Fees", href: "/student/fees", icon: <CreditCard size={18} /> },
            { name: "Receipts", href: "/student/receipts", icon: <ShoppingCart size={18} /> },
        ]
    },
    {
        group: "Personal", items: [
            { name: "Profile", href: "/student/profile", icon: <User size={18} /> },
            { name: "Notices", href: "/student/notices", icon: <Bell size={18} /> },
        ]
    }
]

export default function StudentSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen bg-slate-900 border-r border-white/5 flex flex-col fixed left-0 top-0 z-40 text-white">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center text-primary font-black">S</div>
                    <div>
                        <h2 className="font-heading font-bold text-white text-sm leading-none">Student Portal</h2>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">SKP SAINIK SCHOOL</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-8">
                {studentMenuItems.map((group) => (
                    <div key={group.group} className="space-y-2">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4">{group.group}</h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium",
                                        pathname === item.href
                                            ? "bg-white/10 text-white border border-white/10"
                                            : "text-white/50 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <span className={cn(pathname === item.href ? "text-gold-500" : "text-white/20")}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
