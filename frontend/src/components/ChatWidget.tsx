"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
// We'll use the base api directly if chatService isn't available yet
import api from "@/lib/api"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [history, setHistory] = useState<Message[]>([
        { role: 'assistant', content: "Namaste! I am your SKP school concierge. How can I assist you today? (English/Hindi/Hinglish)" }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [history, isOpen])

    const handleSend = async () => {
        if (!message.trim() || isLoading) return

        const userMsg = message.trim()
        setMessage("")
        setHistory(prev => [...prev, { role: 'user', content: userMsg }])
        setIsLoading(true)

        try {
            const res = await api.post('/chat', { message: userMsg, history })
            if (res.data?.success) {
                setHistory(prev => [...prev, { role: 'assistant', content: res.data.reply }])
            } else {
                setHistory(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my brain. Please try again later." }])
            }
        } catch (error) {
            console.error("Chat Error:", error)
            setHistory(prev => [...prev, { role: 'assistant', content: "My systems are currently undergoing maintenance. Please reach out to us at skpspsmanihari09@gmail.com." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-[999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-primary text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-500 border border-gold-500/30">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-sm leading-none">SKP Concierge</h3>
                                    <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mt-1">AI Assistant</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {history.map((msg, i) => (
                                <div 
                                    key={i} 
                                    className={cn(
                                        "flex gap-3",
                                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                        msg.role === 'user' ? "bg-primary text-white" : "bg-gold-500 text-primary"
                                    )}>
                                        {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                    </div>
                                    <div className={cn(
                                        "p-4 rounded-2xl text-xs font-medium leading-relaxed max-w-[80%] shadow-sm",
                                        msg.role === 'user' 
                                            ? "bg-primary text-white rounded-tr-none" 
                                            : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gold-500 text-primary flex items-center justify-center animate-pulse">
                                        <Loader2 size={16} className="animate-spin" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        Agent is typing...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about admissions, fees, or status..."
                                    className="flex-grow px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/5 outline-none transition-all"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!message.trim() || isLoading}
                                    className="p-3 bg-primary text-white rounded-xl hover:bg-gold-500 hover:text-primary transition-all shadow-lg shadow-primary/10 disabled:opacity-50 disabled:hover:bg-primary disabled:hover:text-white"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={!isOpen ? { 
                    boxShadow: [
                        "0 0 0px var(--color-gold-500)",
                        "0 0 20px var(--color-gold-500)",
                        "0 0 0px var(--color-gold-500)"
                    ]
                } : {}}
                transition={{ 
                    boxShadow: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                    }
                }}
                className="w-16 h-16 bg-primary rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-gold-500/30 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {isOpen ? (
                    <X size={28} className="relative z-10 text-gold-500" />
                ) : (
                    <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="relative z-10 w-full h-full"
                    >
                        <img 
                            src="/images/bot-icon.png" 
                            alt="AI Chat" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                )}
            </motion.button>
        </div>
    )
}
