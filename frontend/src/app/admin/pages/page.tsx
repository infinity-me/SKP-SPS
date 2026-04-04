"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
    FileText, 
    Plus, 
    Search, 
    Edit2, 
    Eye, 
    Trash2,
    Settings
} from "lucide-react"

export default function PagesManagement() {
    const [pages, setPages] = useState([
        { id: 1, title: "Home Page", slug: "/", lastModified: "2026-03-28", status: "Published" },
        { id: 2, title: "About Us", slug: "/about", lastModified: "2026-03-25", status: "Published" },
        { id: 3, title: "Admission Info", slug: "/admission", lastModified: "2026-04-01", status: "Draft" },
        { id: 4, title: "Fee Structure", slug: "/fees", lastModified: "2026-03-15", status: "Published" },
        { id: 5, title: "Contact Us", slug: "/contact", lastModified: "2026-03-20", status: "Published" },
    ])

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Content CMS</h1>
                    <p className="text-muted-foreground text-sm">Manage static pages and website content structure.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10">
                    <Plus size={18} /> Create New Page
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h3 className="font-heading font-bold text-primary">Website Pages</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find page..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none ring-0 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Title</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Slug</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Modified</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pages.map((page) => (
                                <tr key={page.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-primary transition-colors">
                                                <FileText size={16} />
                                            </div>
                                            <p className="text-sm font-bold text-primary">{page.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-mono text-slate-400">{page.slug}</td>
                                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">{page.lastModified}</td>
                                    <td className="px-8 py-4">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${page.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {page.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-300 hover:text-primary transition-colors"><Eye size={16} /></button>
                                            <button className="p-2 text-slate-300 hover:text-primary transition-colors"><Edit2 size={16} /></button>
                                            <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
