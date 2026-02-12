"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { LogIn, Github, Mail, Phone, Fingerprint, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { authService } from "@/lib/api"

export default function AuthPage() {
    const [role, setRole] = useState<"student" | "teacher" | "admin">("student")
    const [authMethod, setAuthMethod] = useState<"id" | "phone" | "google">("id")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await authService.login({ email, password, role })
            if (response.data.success) {
                // Store basic user info (simplified for demo)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                // Redirect based on role
                router.push(`/${role}`)
            } else {
                setError(response.data.message || "Invalid credentials")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred during login")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
            {/* Left: Branding & Visuals */}
            <div className="hidden md:flex w-1/2 bg-primary relative items-center justify-center p-12">
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image
                        src="/images/school-img3.jpeg"
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
                        SKP SAINIK <br />
                        <span className="text-gold-500">PUBLIC SCHOOL</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/60 text-lg font-light leading-relaxed"
                    >
                        Access your portal to manage attendance, view results, and stay updated with the latest school circulars.
                    </motion.p>
                </div>

                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-white/20">
                    <span className="text-xs uppercase tracking-[0.2em] font-bold">Secure Access</span>
                    <div className="flex gap-4">
                        <ShieldCheck size={16} />
                        <Fingerprint size={16} />
                    </div>
                </div>
            </div>

            {/* Right: Auth Content */}
            <div className="flex-grow flex items-center justify-center p-8 md:p-12 lg:p-24 relative overflow-y-auto">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-heading font-black text-primary tracking-tight">Login</h1>
                        <p className="text-muted-foreground">Select your role and login method to continue.</p>
                    </div>

                    {/* Role Selection */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                        {(["student", "teacher", "admin"] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={cn(
                                    "flex-1 py-2 text-sm font-bold capitalize transition-all duration-300 rounded-xl",
                                    role === r ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <button
                            onClick={() => setAuthMethod("google")}
                            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-primary shadow-sm"
                        >
                            <Image src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" width={20} height={20} />
                            Continue with Google
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or login with</span>
                        </div>
                    </div>

                    {/* Dynamic Login Form */}
                    <form className="space-y-5" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold">
                                {error}
                            </div>
                        )}
                        <div className="flex gap-2">
                            {/* ... (buttons remain the same, adding onClick prevention if needed but keeping them as buttons is fine) ... */}
                            <button
                                type="button"
                                onClick={() => setAuthMethod("id")}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                    authMethod === "id" ? "bg-primary text-white" : "bg-slate-50 text-slate-400"
                                )}
                            >
                                School ID
                            </button>
                            <button
                                type="button"
                                onClick={() => setAuthMethod("phone")}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                    authMethod === "phone" ? "bg-primary text-white" : "bg-slate-50 text-slate-400"
                                )}
                            >
                                Phone OTP
                            </button>
                        </div>

                        {authMethod === "id" && (
                            <div className="space-y-4">
                                <InputGroup
                                    label="Email Address / ID"
                                    placeholder="e.g. admin@skpsainik.edu.in"
                                    icon={<Mail size={18} />}
                                    value={email}
                                    onChange={(e: any) => setEmail(e.target.value)}
                                />
                                <InputGroup
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<LogIn size={18} />}
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                />
                            </div>
                        )}

                        {authMethod === "phone" && (
                            <div className="space-y-4">
                                <InputGroup label="Phone Number" placeholder="+91 00000 00000" icon={<Phone size={18} />} />
                                <button type="button" className="w-full text-xs font-bold text-gold-500 text-right hover:text-gold-400 transition-colors">Send OTP</button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an ID? <Link href="/admission" className="text-gold-500 font-bold hover:underline">Apply for Admission</Link>
                    </p>
                </div>

                {/* Footer Credit */}
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
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-primary outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary/20 focus:bg-white transition-all"
                />
            </div>
        </div>
    )
}
