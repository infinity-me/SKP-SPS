"use client"

import { useState, useEffect } from "react"
import { stationeryService, orderService } from "@/lib/api"
import { ShoppingCart, Package, Check, X, Search, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function StorePage() {
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [cart, setCart] = useState<any[]>([])
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [orderForm, setOrderForm] = useState({
        customerName: "",
        email: "",
        phone: ""
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await stationeryService.getAll()
            setProducts(res.data.data)
        } catch (error) {
            console.error("Failed to fetch products")
        } finally {
            setIsLoading(false)
        }
    }

    const addToCart = (product: any) => {
        const existing = cart.find(item => item.id === product.id)
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const orderData = {
                ...orderForm,
                items: cart,
                total: cartTotal
            }
            await orderService.create(orderData)
            alert("Order placed successfully! Our staff will contact you soon.")
            setCart([])
            setIsCheckoutOpen(false)
        } catch (error) {
            alert("Failed to place order. Please try again.")
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-primary pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase tracking-tighter italic"
                    >
                        SKP <span className="text-gold-500">Resource</span> Store
                    </motion.h1>
                    <p className="text-white/70 max-w-2xl mx-auto font-medium">Uniforms, stationery, and academic resources - all in one place for SKP students.</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Products Grid */}
                    <div className="flex-grow space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-heading font-black text-primary uppercase italic">Explore Products</h2>
                            <div className="hidden sm:flex gap-2">
                                <button className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:border-primary hover:text-primary transition-all">All</button>
                                <button className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:border-primary hover:text-primary transition-all">Uniforms</button>
                                <button className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:border-primary hover:text-primary transition-all">Stationery</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <motion.div 
                                    key={product.id}
                                    className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                                >
                                    <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Package size={64} />
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6">
                                            <span className="px-4 py-1.5 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-heading font-black text-primary mb-2 italic uppercase">{product.name}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">{product.description}</p>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <p className="text-2xl font-heading font-black text-primary">₹{product.price}</p>
                                            <button 
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock <= 0}
                                                className={cn(
                                                    "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                                                    product.stock > 0 
                                                        ? "bg-primary text-white hover:bg-navy-800 shadow-lg shadow-primary/20" 
                                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                )}
                                            >
                                                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Sidebar */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 sticky top-32">
                            <h3 className="text-xl font-heading font-black text-primary mb-8 flex items-center gap-3 italic uppercase">
                                Your Bag <ShoppingCart size={24} className="text-gold-500" />
                            </h3>
                            
                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="py-12 text-center text-slate-300 font-bold italic">Your bag is empty.</div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                                                {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-xs font-black text-primary uppercase">{item.name}</h4>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold mb-1">Qty: {item.quantity}</p>
                                                <p className="text-sm font-heading font-black text-primary">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="space-y-4 pt-8 border-t-2 border-dashed border-slate-100">
                                    <div className="flex justify-between items-center text-primary">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Subtotal</p>
                                        <p className="text-2xl font-heading font-black italic">₹{cartTotal}</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="w-full py-5 bg-gold-500 text-primary font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/20"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Checkout Modal */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-md">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-heading font-black text-primary uppercase italic">Confirm Order</h3>
                                <p className="text-sm text-slate-400 font-medium">Please provide contact details.</p>
                            </div>
                            <button onClick={() => setIsCheckoutOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-primary transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCheckout} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" value={orderForm.customerName} onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input required type="email" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" value={orderForm.email} onChange={e => setOrderForm({ ...orderForm, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-primary focus:ring-2 focus:ring-primary/5 outline-none" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} />
                            </div>
                            <button className="w-full py-6 mt-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-navy-800 transition-all shadow-2xl shadow-primary/20">
                                Send Order Request
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
