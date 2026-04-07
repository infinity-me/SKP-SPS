"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, 
    Search, 
    Edit2, 
    Eye, 
    Trash2,
    X,
    Check,
    Globe,
    Layout,
    Type,
    Image as ImageIcon,
    Grid,
    BarChart3,
    ArrowUp,
    ArrowDown,
    Save,
    ChevronLeft,
    Monitor,
    Smartphone
} from "lucide-react"
import { pageService } from "@/lib/api"
import { cn } from "@/lib/utils"

// Block Type Definitions
const BLOCK_TEMPLATES = [
    { type: 'hero', name: 'Hero Banner', icon: <Monitor size={18} />, defaultProps: { title: 'New Hero Section', subtitle: 'Describe your section here...', bgImage: '', bgColor: 'bg-primary' } },
    { type: 'features', name: 'Features Grid', icon: <Grid size={18} />, defaultProps: { heading: 'Our Features', features: [{ title: 'Feature 1', description: 'Detail 1' }, { title: 'Feature 2', description: 'Detail 2' }] } },
    { type: 'content', name: 'Text & Image', icon: <Type size={18} />, defaultProps: { heading: 'About Section', body: 'Add your story here...', image: '', imagePosition: 'right' } },
    { type: 'cta', name: 'Call to Action', icon: <Plus size={18} />, defaultProps: { title: 'Ready to Join?', buttonText: 'Apply Now', buttonLink: '/admission' } }
]

export default function VisualPageBuilder() {
    const [pages, setPages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [view, setView] = useState<"list" | "edit">("list")
    const [editingPage, setEditingPage] = useState<any>(null)
    const [blocks, setBlocks] = useState<any[]>([])
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchPages()
    }, [])

    const fetchPages = async () => {
        try {
            const res = await pageService.getAll()
            setPages(res.data.data)
        } catch (error) {
            console.error("Failed to fetch pages")
        } finally {
            setIsLoading(false)
        }
    }

    const startEditing = (page: any) => {
        setEditingPage(page)
        setBlocks(page.blocks || [])
        setView("edit")
    }

    const addBlock = (template: any) => {
        setBlocks([...blocks, { id: Date.now(), ...template }])
    }

    const removeBlock = (id: number) => {
        setBlocks(blocks.filter(b => b.id !== id))
    }

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= blocks.length) return
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
        setBlocks(newBlocks)
    }

    const updateBlockProps = (id: number, props: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, defaultProps: { ...b.defaultProps, ...props } } : b))
    }

    const savePage = async () => {
        setIsSaving(true)
        try {
            await pageService.update(editingPage.id, { blocks })
            alert("Page design saved successfully!")
            setView("list")
            fetchPages()
        } catch (error) {
            alert("Failed to save design.")
        } finally {
            setIsSaving(false)
        }
    }

    if (view === "edit") {
        return (
            <div className="flex flex-col h-[calc(100vh-100px)] -m-8 bg-slate-50">
                {/* Editor Header */}
                <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView("list")} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 className="font-heading font-black text-primary uppercase italic">{editingPage.title}</h2>
                            <p className="text-[10px] text-slate-400 font-mono">/{editingPage.slug}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-xl mr-4">
                            <button className="p-2 bg-white rounded-lg shadow-sm text-primary"><Monitor size={16} /></button>
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Smartphone size={16} /></button>
                        </div>
                        <button 
                            onClick={savePage}
                            disabled={isSaving}
                            className="bg-primary text-white flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10"
                        >
                            <Save size={18} /> {isSaving ? "Saving..." : "Save Design"}
                        </button>
                    </div>
                </div>

                <div className="flex-grow flex overflow-hidden">
                    {/* Left Panel - Block Library */}
                    <div className="w-80 bg-white border-r border-slate-100 p-6 overflow-y-auto hidden lg:block">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Add Sections</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {BLOCK_TEMPLATES.map((template) => (
                                <button
                                    key={template.type}
                                    onClick={() => addBlock(template)}
                                    className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group text-left"
                                >
                                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-primary transition-colors">
                                        {template.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary">{template.name}</p>
                                        <p className="text-[10px] text-slate-400">Click to insert</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Middle Panel - Visual Canvas */}
                    <div className="flex-grow overflow-y-auto p-12 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-8 bg-white shadow-2xl rounded-[3rem] min-h-screen border border-slate-100 p-8 pb-32">
                            {blocks.length === 0 ? (
                                <div className="h-[400px] flex flex-col items-center justify-center text-slate-300 gap-4 border-2 border-dashed border-slate-100 rounded-[2rem]">
                                    <Layout size={48} />
                                    <p className="font-bold italic">Start building your page by adding blocks.</p>
                                </div>
                            ) : (
                                blocks.map((block, index) => (
                                    <div key={block.id} className="relative group rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all overflow-hidden">
                                        <div className="bg-slate-50 p-6 border-b border-white">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 bg-white px-2 py-1 rounded">
                                                        {block.name}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => moveBlock(index, 'up')} className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-primary"><ArrowUp size={14} /></button>
                                                    <button onClick={() => moveBlock(index, 'down')} className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-primary"><ArrowDown size={14} /></button>
                                                    <button onClick={() => removeBlock(block.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>

                                            {/* Block Specific Form Fields */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {block.type === 'hero' && (
                                                    <>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-slate-400">Heading</label>
                                                            <input className="w-full bg-white border-none rounded-lg p-2 text-xs font-bold" value={block.defaultProps.title} onChange={e => updateBlockProps(block.id, { title: e.target.value })} />
                                                        </div>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-slate-400">Subtext</label>
                                                            <textarea className="w-full bg-white border-none rounded-lg p-2 text-xs font-bold" value={block.defaultProps.subtitle} onChange={e => updateBlockProps(block.id, { subtitle: e.target.value })} />
                                                        </div>
                                                    </>
                                                )}
                                                {block.type === 'content' && (
                                                    <>
                                                         <div className="col-span-2 space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-slate-400">Heading</label>
                                                            <input className="w-full bg-white border-none rounded-lg p-2 text-xs font-bold" value={block.defaultProps.heading} onChange={e => updateBlockProps(block.id, { heading: e.target.value })} />
                                                        </div>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-slate-400">Body Content</label>
                                                            <textarea rows={4} className="w-full bg-white border-none rounded-lg p-2 text-xs font-bold" value={block.defaultProps.body} onChange={e => updateBlockProps(block.id, { body: e.target.value })} />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight">Visual Page Builder</h1>
                    <p className="text-muted-foreground text-sm">Design your website sections without writing code.</p>
                </div>
                <button 
                    onClick={() => {
                        const title = prompt("Page Title:")
                        if (!title) return
                        const slug = title.toLowerCase().replace(/ /g, '-')
                        pageService.create({ title, slug, blocks: [] }).then(() => fetchPages())
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10"
                >
                    <Plus size={18} /> New Page Design
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h3 className="font-heading font-black text-primary italic uppercase tracking-tighter text-xl">Current Web Pages</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find page..." 
                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none ring-0 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Structure</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">URL Path</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pages.map((page) => (
                                <tr key={page.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-gold-500 transition-all">
                                                <Layout size={20} />
                                            </div>
                                            <div>
                                                <p className="text-base font-heading font-black text-primary italic uppercase">{page.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {(page.blocks || []).length} UI Blocks Configured
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-xs font-mono text-slate-400">/{page.slug}</span>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => startEditing(page)}
                                                className="bg-primary text-white flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-800 transition-all"
                                            >
                                                <Edit2 size={14} /> Open GUI Editor
                                            </button>
                                            <button 
                                                onClick={() => pageService.delete(page.id).then(() => fetchPages())}
                                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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
