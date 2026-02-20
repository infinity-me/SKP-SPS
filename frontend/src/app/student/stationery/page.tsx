"use client"

import { useState, useEffect } from "react"
import { stationeryService, orderService } from "@/lib/api"
import { ShoppingCart, ShoppingBag, Search, Plus, Minus, CheckCircle2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function StudentStorePage() {
    const [items, setItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [cart, setCart] = useState<any[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const res = await stationeryService.getAll()
            setItems(res.data.data)
        } catch (error) {
            console.error("Failed to fetch store items")
        } finally {
            setIsLoading(false)
        }
    }

    const addToCart = (item: any) => {
        const existing = cart.find(c => c.id === item.id)
        if (existing) {
            setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
        } else {
            setCart([...cart, { ...item, quantity: 1 }])
        }
    }

    const removeFromCart = (id: number) => {
        const existing = cart.find(c => c.id === id)
        if (existing.quantity > 1) {
            setCart(cart.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
        } else {
            setCart(cart.filter(c => c.id !== id))
        }
    }

    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)

    const placeOrder = async () => {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
            alert("Please login to place an order")
            return
        }
        const user = JSON.parse(userStr)

        try {
            await orderService.create({
                studentId: user.schoolId || user.id,
                studentName: user.name,
                items: cart,
                total,
                date: new Date().toISOString()
            })
            setIsSuccess(true)
            setCart([])
            setTimeout(() => setIsSuccess(false), 3000)
        } catch (error) {
            alert("Failed to place order")
        }
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-heading font-black text-primary tracking-tight">Stationery store</h1>
                        <p className="text-slate-500 font-medium">Get your school essentials delivered to your classroom.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search stationery..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-navy-800 transition-all"
                        >
                            <ShoppingBag size={24} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gold-500 text-primary flex items-center justify-center rounded-full text-xs font-black border-2 border-white">
                                    {cart.reduce((acc, c) => acc + c.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                            >
                                <div className="h-48 bg-slate-50 rounded-t-[2rem] overflow-hidden relative">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                            <ShoppingBag size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-primary text-lg mb-1">{item.name}</h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.description || "High-quality school essential."}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-black text-primary italic">₹{item.price}</p>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="p-3 bg-slate-50 text-primary rounded-xl hover:bg-gold-500 hover:text-primary transition-all group-hover:bg-primary group-hover:text-white"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Sidebar */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="text-primary" size={24} />
                                    <h2 className="text-xl font-heading font-black text-primary">Your bag</h2>
                                </div>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-8 space-y-6">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                                        <ShoppingCart size={64} />
                                        <p className="font-bold">Your bag is empty.</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-primary text-sm">{item.name}</h4>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">₹{item.price} each</p>
                                            </div>
                                            <div className="flex items-center bg-slate-50 p-1 rounded-xl">
                                                <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-primary transition-colors"><Minus size={14} /></button>
                                                <span className="w-8 text-center text-sm font-black italic">{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} className="p-1 hover:text-primary transition-colors"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-8 border-t border-slate-50 space-y-6">
                                    <div className="flex justify-between items-end">
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Grand Total</p>
                                        <p className="text-4xl font-black text-primary italic">₹{total}</p>
                                    </div>
                                    <button
                                        onClick={placeOrder}
                                        className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-navy-800 transition-all flex items-center justify-center gap-3"
                                    >
                                        Confirm order <CheckCircle2 size={24} className="text-gold-500" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Success Notification */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-bold"
                    >
                        <CheckCircle2 size={24} /> Order placed successfully!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
