"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, ChevronDown, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface Message {
    role: 'user' | 'assistant'
    content: string
    error?: boolean
}

const INITIAL_MESSAGE: Message = {
    role: 'assistant',
    content: "Namaste! 🙏 Welcome to SKP Sainik Public School.\n\nI can help you with:\n• Admissions & Fees\n• Notices & Events\n• Results & Attendance\n• Contact Info\n\nWhat would you like to know?"
}

// Renders plain text with newlines as <br> tags
function MessageContent({ content }: { content: string }) {
    return (
        <span>
            {content.split('\n').map((line, i, arr) => (
                <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                </span>
            ))}
        </span>
    )
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [history, setHistory] = useState<Message[]>([INITIAL_MESSAGE])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
            // Auto-focus input when chat opens
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [history, isOpen])

    const handleSend = async () => {
        const trimmed = message.trim()
        if (!trimmed || isLoading) return

        setMessage("")
        const userMessage: Message = { role: 'user', content: trimmed }
        setHistory(prev => [...prev, userMessage])
        setIsLoading(true)

        try {
            // Send only the last 10 messages as history context
            const historyToSend = history.slice(-10)
            const res = await api.post('/chat', { message: trimmed, history: historyToSend })

            if (res.data?.success && res.data?.reply) {
                setHistory(prev => [...prev, { role: 'assistant', content: res.data.reply }])
            } else {
                const errorText = res.data?.message || "Sorry, I couldn't get a response. Please try again."
                setHistory(prev => [...prev, { role: 'assistant', content: errorText, error: true }])
            }
        } catch (error: any) {
            console.error("Chat Error:", error)

            let displayMsg = "I'm having trouble connecting right now. Please try again or call us at +91 9454331861."

            if (error.response?.data?.message) {
                displayMsg = error.response.data.message
            } else if (error.message === "Network Error") {
                displayMsg = "Cannot reach the server. Please check your internet connection."
            } else if (error.code === 'ECONNABORTED') {
                displayMsg = "The request timed out. The server might be busy — please try again."
            }

            setHistory(prev => [...prev, { role: 'assistant', content: displayMsg, error: true }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleReset = () => {
        setHistory([INITIAL_MESSAGE])
        setMessage("")
        inputRef.current?.focus()
    }

    return (
        <div className="fixed bottom-6 right-6 z-[999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-white flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-500 border border-gold-500/30">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-sm leading-none">SKP Assistant</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <p className="text-[10px] text-white/60 uppercase tracking-widest">Online</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleReset}
                                    title="Start new conversation"
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
                                >
                                    <RefreshCw size={15} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                            {history.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-2",
                                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className={cn(
                                        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                                        msg.role === 'user'
                                            ? "bg-primary text-white"
                                            : msg.error
                                                ? "bg-red-100 text-red-500"
                                                : "bg-gold-500 text-primary"
                                    )}>
                                        {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                                    </div>

                                    {/* Bubble */}
                                    <div className={cn(
                                        "px-4 py-3 rounded-2xl text-[13px] leading-relaxed max-w-[82%] shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-primary text-white rounded-tr-none"
                                            : msg.error
                                                ? "bg-red-50 text-red-700 border border-red-100 rounded-tl-none"
                                                : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                                    )}>
                                        <MessageContent content={msg.content} />
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-gold-500 text-primary flex items-center justify-center">
                                        <Loader2 size={14} className="animate-spin" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border border-slate-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-slate-100 flex-shrink-0">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about admissions, fees, results..."
                                    disabled={isLoading}
                                    className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all disabled:opacity-60"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim() || isLoading}
                                    className="p-2.5 bg-primary text-white rounded-xl hover:bg-gold-500 hover:text-primary transition-all shadow-md shadow-primary/10 disabled:opacity-40 disabled:pointer-events-none"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={!isOpen ? {
                    boxShadow: [
                        "0 0 0px rgba(var(--color-gold-500), 0)",
                        "0 0 22px rgba(var(--color-gold-500), 0.6)",
                        "0 0 0px rgba(var(--color-gold-500), 0)"
                    ]
                } : {}}
                transition={{
                    boxShadow: {
                        repeat: Infinity,
                        duration: 2.5,
                        ease: "easeInOut"
                    }
                }}
                className="w-16 h-16 bg-primary rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-gold-500/30 group relative overflow-hidden"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10"
                        >
                            <X size={26} className="text-gold-500" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1, y: [0, -2, 0] }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{
                                rotate: { duration: 0.2 },
                                y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                            }}
                            className="relative z-10 w-full h-full flex items-center justify-center"
                        >
                            <img
                                src="/images/bot-icon.png"
                                alt="Chat with SKP Assistant"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback if bot icon doesn't exist
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
