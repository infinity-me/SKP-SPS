"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { UserPlus, Mail, Lock, User, ArrowLeft, ShieldCheck } from "lucide-react"
import { authService } from "@/lib/api"

export default function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await authService.registerGuest({ name, email, password })
            if (response.success) {
                router.push("/dashboard") // Guests go to a general dashboard
            } else {
                setError(response.message || "Signup failed")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred during signup")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        setIsLoading(true)
        try {
            const response = await authService.googleLogin("mock-token", "guest")
            if (response.success) {
                router.push("/dashboard")
            }
        } catch (err) {
            setError("Google signup failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
            {/* Left Side: Visuals */}
            <div className="hidden md:flex w-1/2 bg-primary relative items-center justify-center p-12">
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image
                        src="/images/school-img2.jpeg"
                        alt="School background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                </div>

                <div className="relative z-10 text-center max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-white rounded-full p-2 mx-auto mb-8 shadow-2xl"
                    >
                        <Image src="/images/logo.png" alt="Logo" width={100} height={100} className="object-contain" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-heading font-black text-white mb-4 tracking-tight"
                    >
                        EXPLORE <br />
                        <span className="text-gold-500">SKP SAINIK</span>
                    </motion.h2>
                    <p className="text-white/60 text-lg font-light leading-relaxed">
                        Join as a guest to explore our campus, view circulars, and learn more about our educational excellence.
                    </p>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex-grow flex items-center justify-center p-8 md:p-12 lg:p-24 relative overflow-y-auto">
                <div className="w-full max-w-sm space-y-8">
                    <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-all text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-heading font-black text-primary tracking-tight">Guest Signup</h1>
                        <p className="text-muted-foreground">Create an account to explore the school portal.</p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleGoogleSignup}
                            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-primary shadow-sm"
                        >
                            <Image src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" width={20} height={20} />
                            Signup with Google
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or signup manually</span>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignup}>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <InputGroup
                                label="Full Name"
                                placeholder="John Doe"
                                icon={<User size={18} />}
                                value={name}
                                onChange={(e: any) => setName(e.target.value)}
                            />
                            <InputGroup
                                label="Email Address"
                                placeholder="john@example.com"
                                icon={<Mail size={18} />}
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                            />
                            <InputGroup
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock size={18} />}
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                        >
                            {isLoading ? "Creating Account..." : "Create Guest Account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account? <Link href="/login" className="text-gold-500 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-300 uppercase tracking-widest font-bold">
                    © 2026 SKP SAINIK PUBLIC SCHOOL
                </div>
            </div>
        </div>
    )
}

function InputGroup({ label, placeholder, type = "text", icon, value, onChange }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    {icon}
                </div>
                <input
                    required
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}
