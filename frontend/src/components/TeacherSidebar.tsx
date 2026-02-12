"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    CheckSquare,
    Upload,
    MessageSquare,
    Users,
    BarChart3,
    Calendar,
    LogOut
} from "lucide-react"

const teacherMenuItems = [
    {
        group: "Classroom", items: [
            { name: "Dashboard", href: "/teacher", icon: <LayoutDashboard size={18} /> },
            { name: "Attendance", href: "/teacher/attendance", icon: <CheckSquare size={18} /> },
            { name: "My Students", href: "/teacher/students", icon: <Users size={18} /> },
            { name: "Schedule", href: "/teacher/schedule", icon: <Calendar size={18} /> },
        ]
    },
    {
        group: "Academic", items: [
            { name: "Upload Results", href: "/teacher/results", icon: <Upload size={18} /> },
            { name: "Class Analytics", href: "/teacher/analytics", icon: <BarChart3 size={18} /> },
        ]
    },
    {
        group: "Communication", items: [
            { name: "Send Notice", href: "/teacher/notice", icon: <MessageSquare size={18} /> },
        ]
    }
]

export default function TeacherSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-black">T</div>
                    <div>
                        <h2 className="font-heading font-bold text-primary text-sm leading-none">Teacher Hub</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Class Mentor View</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-8">
                {teacherMenuItems.map((group) => (
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
                                            ? "bg-green-50 text-green-700 border border-green-100"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                                    )}
                                >
                                    <span className={cn(pathname === item.href ? "text-green-600" : "text-slate-400")}>
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
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
