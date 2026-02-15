"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { studentService } from "@/lib/api"
import { Plus, Search, Edit2, Trash2, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState<any>(null)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        admissionNo: "",
        class: "",
        section: "",
        parentName: "",
        phone: ""
    })

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            const res = await studentService.getAll()
            setStudents(res.data.data)
        } catch (error) {
            console.error("Failed to fetch students")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingStudent) {
                await studentService.update(editingStudent.id, formData)
            } else {
                await studentService.create(formData)
            }
            setIsModalOpen(false)
            setEditingStudent(null)
            setFormData({ firstName: "", lastName: "", admissionNo: "", class: "", section: "", parentName: "", phone: "" })
            fetchStudents()
        } catch (error) {
            alert("Error saving student")
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this student?")) {
            try {
                await studentService.delete(id)
                fetchStudents()
            } catch (error) {
                alert("Error deleting student")
            }
        }
    }

    const openModal = (student: any = null) => {
        if (student) {
            setEditingStudent(student)
            setFormData({ ...student })
        } else {
            setEditingStudent(null)
            setFormData({ firstName: "", lastName: "", admissionNo: "", class: "", section: "", parentName: "", phone: "" })
        }
        setIsModalOpen(true)
    }

    const filteredStudents = students.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">Students Directory</h1>
                    <p className="text-slate-500 text-sm">Manage student profiles, academic records and details.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10"
                >
                    <Plus size={18} /> Add New Student
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-primary">
                <div className="p-4 border-b border-slate-50 flex items-center gap-4">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or admission ID..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-colors">
                        <Filter size={18} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission No</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class/Sec</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Details</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group text-primary">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                                {student.firstName[0]}{student.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{student.firstName} {student.lastName}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Joined {new Date(student.id).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-xs font-mono font-bold text-navy-600 bg-navy-50 px-2 py-1 rounded-md">
                                            {student.admissionNo}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-sm text-slate-600 font-bold">
                                        {student.class} - {student.section}
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-medium">{student.parentName}</p>
                                        <p className="text-[10px] text-slate-400">{student.phone}</p>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openModal(student)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 text-sm italic">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white text-primary">
                            <div>
                                <h3 className="text-xl font-heading font-black">{editingStudent ? "Edit Student" : "Add New Student"}</h3>
                                <p className="text-sm text-slate-400">Fill in the student details below.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission No</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                        value={formData.admissionNo}
                                        onChange={e => setFormData({ ...formData, admissionNo: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</label>
                                        <input
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                            value={formData.class}
                                            onChange={e => setFormData({ ...formData, class: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section</label>
                                        <input
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                            value={formData.section}
                                            onChange={e => setFormData({ ...formData, section: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent/Guardian</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                        value={formData.parentName}
                                        onChange={setFormData.bind(null, { ...formData })} // Placeholder fix below
                                        onInput={(e: any) => setFormData({ ...formData, parentName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary"
                                        value={formData.phone}
                                        onInput={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-grow py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-primary/10"
                                >
                                    {editingStudent ? "Save Changes" : "Create Student"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
