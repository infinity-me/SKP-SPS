"use client"

import { useState, useEffect } from "react"
import { stationeryService, orderService } from "@/lib/api"
import { Plus, Search, Edit2, Trash2, X, ShoppingBag, Package } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AdminStorePage() {
    const [items, setItems] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        category: "General",
        price: 0,
        stock: 0,
        description: "",
        image: ""
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [itemRes, orderRes] = await Promise.all([
                stationeryService.getAll(),
                orderService.getAll()
            ])
            setItems(itemRes.data.data)
            setOrders(orderRes.data.data)
        } catch (error) {
            console.error("Failed to fetch store data")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingItem) {
                await stationeryService.update(editingItem.id, formData)
            } else {
                await stationeryService.create(formData)
            }
            setIsModalOpen(false)
            setEditingItem(null)
            setFormData({ name: "", category: "General", price: 0, stock: 0, description: "", image: "" })
            fetchData()
        } catch (error) {
            alert("Error saving item")
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                await stationeryService.delete(id)
                fetchData()
            } catch (error) {
                alert("Error deleting item")
            }
        }
    }

    const updateOrderStatus = async (id: number, status: string) => {
        try {
            await orderService.update(id, { status })
            fetchData()
        } catch (error) {
            alert("Error updating order status")
        }
    }

    const openModal = (item: any = null) => {
        if (item) {
            setEditingItem(item)
            setFormData({ ...item })
        } else {
            setEditingItem(null)
            setFormData({ name: "", category: "General", price: 0, stock: 0, description: "", image: "" })
        }
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary">Stationery & Store</h1>
                    <p className="text-slate-500 text-sm">Manage school stationery inventory and student orders.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab("inventory")}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            activeTab === "inventory" ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-100"
                        )}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            activeTab === "orders" ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-100"
                        )}
                    >
                        Orders {orders.filter(o => o.status === 'pending').length > 0 &&
                            <span className="ml-2 bg-gold-500 text-primary px-2 py-0.5 rounded-full text-[10px]">
                                {orders.filter(o => o.status === 'pending').length}
                            </span>
                        }
                    </button>
                </div>
            </div>

            {activeTab === "inventory" ? (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10"
                        >
                            <Plus size={18} /> Add New Item
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group"
                            >
                                <div className="h-48 bg-slate-50 relative overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                            <Package size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(item)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg text-slate-600 hover:text-primary transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg text-slate-600 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-black uppercase text-primary tracking-widest">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-primary mb-2">{item.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xl font-black text-primary">₹{item.price}</p>
                                            <p className={cn("text-[10px] font-bold uppercase", item.stock > 0 ? "text-green-500" : "text-red-500")}>
                                                {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4 font-mono text-xs text-slate-400">#{order.id.toString().slice(-6)}</td>
                                        <td className="px-8 py-4">
                                            <p className="text-sm font-bold text-primary">{order.studentName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{order.studentId}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <p className="text-sm text-slate-600 line-clamp-1">{order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <p className="text-sm font-black text-primary">₹{order.total}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                                order.status === 'completed' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all"
                                                >
                                                    Mark Done
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between text-primary">
                            <div>
                                <h3 className="text-xl font-heading font-black">{editingItem ? "Edit Item" : "Add New Item"}</h3>
                                <p className="text-sm text-slate-400">Inventory details</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Name</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm text-primary" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (₹)</label>
                                    <input type="number" required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm text-primary" value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</label>
                                    <input type="number" required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm text-primary" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm text-primary" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl">
                                {editingItem ? "Update Item" : "Add Item"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
