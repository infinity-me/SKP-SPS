"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { feeService, feeStructureService } from "@/lib/api"
import { 
    CreditCard, 
    BadgeIndianRupee, 
    MoreHorizontal, 
    FileCheck,
    Search,
    Download,
    Trash2,
    X,
    Plus,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function FeesPage() {
    const [view, setView] = useState<"records" | "structure">("records")
    const [fees, setFees] = useState([])
    const [structures, setStructures] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    
    // Generation state
    const [isGenerating, setIsGenerating] = useState(false)
    const [genMonth, setGenMonth] = useState("April")
    const [genYear, setGenYear] = useState(new Date().getFullYear())

    useEffect(() => {
        if (view === "records") fetchFees()
        else fetchStructure()
    }, [view])

    const fetchFees = async () => {
        try {
            setIsLoading(true)
            const res = await feeService.getAll()
            setFees(res.data.data)
        } catch (error) {
            console.error("Failed to fetch fees")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStructure = async () => {
        try {
            setIsLoading(true)
            const res = await feeStructureService.getAll()
            setStructures(res.data.data)
        } catch (error) {
            console.error("Failed to fetch structure")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGenerateFees = async () => {
        if (!confirm(`Generate ${genMonth} ${genYear} fees for all students based on the structure?`)) return
        try {
            setIsGenerating(true)
            const res = await feeService.generate(genMonth, genYear)
            alert(res.data.message)
            if (view === "records") fetchFees()
        } catch (error) {
            alert("Error generating fees")
        } finally {
            setIsGenerating(false)
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)

    // Form data for both
    const [feeFormData, setFeeFormData] = useState({
        studentId: "",
        amount: "",
        type: "Monthly Tuition",
        status: "pending",
        dueDate: new Date().toISOString().split('T')[0]
    })
    
    const [structFormData, setStructFormData] = useState({
        className: "Class 1",
        feeType: "Monthly Tuition",
        amount: "",
        description: ""
    })

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (view === "records") {
                const data = {
                    ...feeFormData,
                    studentId: parseInt(feeFormData.studentId),
                    amount: parseFloat(feeFormData.amount),
                    dueDate: new Date(feeFormData.dueDate)
                }
                if (isEdit && selectedId) {
                    await feeService.update(selectedId, data)
                } else {
                    await feeService.create(data)
                }
                fetchFees()
            } else {
                const data = {
                    ...structFormData,
                    amount: parseFloat(structFormData.amount)
                }
                if (isEdit && selectedId) {
                    await feeStructureService.update(selectedId, data)
                } else {
                    await feeStructureService.create(data)
                }
                fetchStructure()
            }
            setIsModalOpen(false)
        } catch (error) {
            alert("Error saving record")
        }
    }

    const handleEditFee = (fee: any) => {
        setSelectedId(fee.id)
        setIsEdit(true)
        setFeeFormData({
            studentId: fee.studentId.toString(),
            amount: fee.amount.toString(),
            type: fee.type,
            status: fee.status,
            dueDate: new Date(fee.dueDate).toISOString().split('T')[0]
        })
        setIsModalOpen(true)
    }

    const handleEditStruct = (struct: any) => {
        setSelectedId(struct.id)
        setIsEdit(true)
        setStructFormData({
            className: struct.className,
            feeType: struct.feeType,
            amount: struct.amount.toString(),
            description: struct.description || ""
        })
        setIsModalOpen(true)
    }

    const handleDeleteFee = async (id: number) => {
        if (confirm("Delete this fee record?")) {
            try {
                await feeService.delete(id)
                fetchFees()
            } catch (error) {
                alert("Error deleting fee")
            }
        }
    }

    const handleDeleteStruct = async (id: number) => {
        if (confirm("Remove this entry from fee structure?")) {
            try {
                await feeStructureService.delete(id)
                fetchStructure()
            } catch (error) {
                alert("Error deleting structure")
            }
        }
    }

    const filteredFees = fees.filter((f: any) => 
        f.student?.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            {/* Header with Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight italic uppercase">Finance Management</h1>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Collections, Structure & Automation</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => setView("records")}
                        className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", 
                            view === "records" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-primary")}
                    >
                        Log
                    </button>
                    <button 
                        onClick={() => setView("structure")}
                        className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", 
                            view === "structure" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-primary")}
                    >
                        Structure
                    </button>
                </div>
            </div>

            {view === "records" ? (
                <>
                    {/* Automation & Action Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 italic">
                            <select 
                                value={genMonth} onChange={e => setGenMonth(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-black text-primary outline-none px-2 uppercase tracking-widest"
                            >
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <input 
                                type="number" value={genYear} onChange={e => setGenYear(parseInt(e.target.value))}
                                className="w-16 bg-transparent border-none text-[10px] font-black text-primary outline-none uppercase tracking-widest"
                            />
                            <button 
                                onClick={handleGenerateFees}
                                disabled={isGenerating}
                                className="px-4 py-2 bg-gold-500 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-600 disabled:opacity-50 transition-all shadow-lg shadow-gold-500/10"
                            >
                                {isGenerating ? "Generating..." : "Generate Monthly Fees"}
                            </button>
                        </div>
                        <button 
                            onClick={() => {
                                setIsEdit(false)
                                setFeeFormData({ studentId: "", amount: "", type: "Monthly Tuition", status: "pending", dueDate: new Date().toISOString().split('T')[0] })
                                setIsModalOpen(true)
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-800 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} /> Individual Collection
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 bg-primary rounded-3xl text-white relative overflow-hidden">
                            <BadgeIndianRupee className="text-gold-500 mb-6" size={32} />
                            <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">M-T-D Revenue</h3>
                            <p className="text-3xl font-heading font-black italic">₹{fees.reduce((acc, curr: any) => curr.status === 'paid' ? acc + curr.amount : acc, 0).toLocaleString()}</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-3xl">
                            <CreditCard className="text-red-500 mb-6" size={32} />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Outstanding</h3>
                            <p className="text-3xl font-heading font-black italic text-primary">₹{fees.reduce((acc, curr: any) => curr.status === 'pending' ? acc + curr.amount : acc, 0).toLocaleString()}</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-3xl">
                            <CheckCircle2 className="text-emerald-500 mb-6" size={32} />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paid Invoices</h3>
                            <p className="text-3xl font-heading font-black italic text-primary">{fees.filter((f: any) => f.status === 'paid').length}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest italic">Transaction Log</h3>
                            <div className="relative w-72">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search by ID or Type..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-[10px] font-bold outline-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Student</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan={5} className="px-8 py-10 bg-slate-50/20" /></tr>)
                                    ) : filteredFees.map((row: any) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 group transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-primary">{row.type}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Cadet: {row.student?.user?.name || "N/A"} (#{row.student?.admissionNo})</p>
                                            </td>
                                            <td className="px-8 py-6 text-xs text-slate-500 font-medium">{new Date(row.dueDate).toLocaleDateString()}</td>
                                            <td className="px-8 py-6 text-sm font-heading font-black text-primary italic">₹{row.amount.toLocaleString()}</td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider",
                                                    row.status === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                                )}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditFee(row)} className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all"><MoreHorizontal size={14}/></button>
                                                    <button onClick={() => handleDeleteFee(row.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"><Trash2 size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-primary uppercase tracking-widest italic">Global Fee Structure</h3>
                        <button 
                            onClick={() => {
                                setIsEdit(false)
                                setStructFormData({ className: "Class 1", feeType: "Monthly Tuition", amount: "", description: "" })
                                setIsModalOpen(true)
                            }}
                            className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-800 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} /> Add Rule
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Type</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr className="animate-pulse"><td colSpan={4} className="px-8 py-10" /></tr>
                                ) : (
                                    structures.map((s: any) => (
                                        <tr key={s.id} className="hover:bg-slate-50/50 group">
                                            <td className="px-8 py-6 text-sm font-bold text-primary">{s.className}</td>
                                            <td className="px-8 py-6 text-xs text-slate-500 font-medium">{s.feeType}</td>
                                            <td className="px-8 py-6 text-sm font-heading font-black text-primary italic">₹{s.amount.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditStruct(s)} className="p-2 text-slate-400 hover:text-primary"><MoreHorizontal size={14}/></button>
                                                    <button onClick={() => handleDeleteStruct(s.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Combined Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-lg font-heading font-black uppercase italic text-primary">{isEdit ? "Update" : "Create"} {view === "records" ? "Record" : "Rule"}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-8 space-y-4">
                            {view === "records" ? (
                                <>
                                    {!isEdit && (
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Internal Student ID</label>
                                            <input required type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold" value={feeFormData.studentId} onChange={e => setFeeFormData({...feeFormData, studentId: e.target.value})} />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount (₹)</label>
                                        <input required type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold" value={feeFormData.amount} onChange={e => setFeeFormData({...feeFormData, amount: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                                        <select className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold" value={feeFormData.status} onChange={e => setFeeFormData({...feeFormData, status: e.target.value})}>
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Due Date</label>
                                        <input required type="date" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold" value={feeFormData.dueDate} onChange={e => setFeeFormData({...feeFormData, dueDate: e.target.value})} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Class</label>
                                        <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold" value={structFormData.className} onChange={e => setStructFormData({...structFormData, className: e.target.value})} placeholder="e.g. Class 10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fee Component</label>
                                        <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold" value={structFormData.feeType} onChange={e => setStructFormData({...structFormData, feeType: e.target.value})} placeholder="e.g. Tuition Fee" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Default Amount (₹)</label>
                                        <input required type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold" value={structFormData.amount} onChange={e => setStructFormData({...structFormData, amount: e.target.value})} />
                                    </div>
                                </>
                            )}
                            <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Save {view === "records" ? "Record" : "Rule"}</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
