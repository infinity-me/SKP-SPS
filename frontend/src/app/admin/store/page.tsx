"use client"

import { useState, useEffect } from "react"
import { stationeryService, orderService } from "@/lib/api"
import { 
    Plus, 
    Search, 
    Trash2, 
    Edit, 
    Package, 
    ShoppingCart, 
    X, 
    Image as ImageIcon,
    ExternalLink
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AdminStorePage() {
    const [products, setProducts] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<"products" | "orders">("products")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "Stationery",
        imageUrl: ""
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [prodRes, orderRes] = await Promise.all([
                stationeryService.getAll(),
                orderService.getAll()
            ])
            setProducts(prodRes.data.data)
            setOrders(orderRes.data.data)
        } catch (error) {
            console.error("Failed to fetch store data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            }
            if (isEdit && selectedProduct) {
                await stationeryService.update(selectedProduct.id, data)
            } else {
                await stationeryService.create(data)
            }
            setIsModalOpen(false)
            fetchData()
        } catch (error) {
            alert("Error saving product")
        }
    }

    const handleEdit = (product: any) => {
        setSelectedProduct(product)
        setIsEdit(true)
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category,
            imageUrl: product.imageUrl || ""
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm("Permanently remove this product?")) {
            try {
                await stationeryService.delete(id)
                fetchData()
            } catch (error) {
                alert("Error deleting product")
            }
        }
    }

    const updateOrderStatus = async (id: number, status: string) => {
        try {
            await orderService.update(id, { status })
            fetchData()
        } catch (error) {
            alert("Error updating order")
        }
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-black text-primary tracking-tight italic uppercase">SKP Store Console</h1>
                    <p className="text-slate-500 text-sm">Manage school stationery, uniforms, and student orders.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button 
                        onClick={() => setActiveTab("products")}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === "products" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Inventory
                    </button>
                    <button 
                        onClick={() => setActiveTab("orders")}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === "orders" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Orders
                    </button>
                </div>
            </div>

            {activeTab === "products" ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex-grow max-w-md relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                placeholder="Search inventory..." 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary font-bold"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setIsEdit(false)
                                setFormData({ name: "", description: "", price: "", stock: "", category: "Stationery", imageUrl: "" })
                                setIsModalOpen(true)
                            }}
                            className="bg-primary text-white flex items-center gap-2 px-6 py-3 rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/10"
                        >
                            <Plus size={18} /> Add Product
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group"
                            >
                                <div className="aspect-video bg-slate-50 relative overflow-hidden">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                            <Package size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 bg-red-50/90 backdrop-blur-sm rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-primary/80 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-heading font-bold text-primary mb-1">{product.name}</h3>
                                    <p className="text-slate-400 text-xs line-clamp-2 mb-4">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Price</p>
                                            <p className="font-heading font-black text-primary text-lg">₹{product.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">In Stock</p>
                                            <p className={cn(
                                                "font-black text-sm",
                                                product.stock < 10 ? "text-red-500" : "text-green-500"
                                            )}>{product.stock} units</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="font-heading font-bold text-primary">Store Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 font-mono text-sm text-primary">#SKP-{order.id}</td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-primary">{order.customerName}</p>
                                            <p className="text-xs text-slate-400">{order.email}</p>
                                        </td>
                                        <td className="px-8 py-6 font-heading font-black text-primary italic">₹{order.total}</td>
                                        <td className="px-8 py-6">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none outline-none",
                                                    order.status === "completed" ? "bg-green-100 text-green-700" :
                                                    order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                                )}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-primary hover:underline flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                                                Details <ExternalLink size={12} />
                                            </button>
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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between text-primary">
                            <div>
                                <h3 className="text-xl font-heading font-black italic uppercase">{isEdit ? "Update Stock" : "New Inventory Item"}</h3>
                                <p className="text-sm text-slate-400">Specify product specifications.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea required rows={3} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (₹)</label>
                                <input required type="number" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Units</label>
                                <input required type="number" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                                <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="Stationery">Stationery</option>
                                    <option value="Uniform">Uniform</option>
                                    <option value="Books">Books</option>
                                    <option value="Sports">Sports Equipment</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>
                            <div className="col-span-2 pt-6 border-t border-slate-50 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" className="flex-grow py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-primary/10">
                                    {isEdit ? "Update Inventory" : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
