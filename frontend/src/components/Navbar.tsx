"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react"

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Circulars & Notices", href: "/notices" },
    { name: "Fee Structure", href: "/fees" },
    { name: "Calendar", href: "/calendar" },
    { name: "Store", href: "/store" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
]

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)

        // Check for logged in user
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        return () => window.removeEventListener("scroll", handleScroll)
    }, [pathname])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        router.push("/")
        setProfileDropdownOpen(false)
    }

    return (
        <nav
            className={cn(
                "transition-all duration-300 px-4 md:px-6 py-4 relative z-50",
                "bg-primary/95 backdrop-blur-md border-b border-gold-500/20 py-2 md:py-3 shadow-lg"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 md:gap-3">
                    <div className="relative w-8 h-8 md:w-12 md:h-12 bg-white rounded-full p-1 overflow-hidden shrink-0">
                        <Image
                            src="/images/logo.png"
                            alt="SKP School Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="block">
                        <h1 className="text-white font-heading font-black text-[10px] sm:text-xs md:text-sm tracking-tighter leading-tight italic uppercase">
                            <span className="text-[11px] sm:text-sm md:text-base tracking-normal not-italic font-black">SKP SAINIK</span> <br />
                            <span className="text-gold-500 font-bold not-italic tracking-normal">PUBLIC SCHOOL</span>
                        </h1>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white/80 hover:text-gold-500 transition-colors font-medium text-[13px]"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-3">
                    {!mounted ? (
                        <div className="w-40" /> // Placeholder while mounting
                    ) : !user ? (
                        <>
                            <Link
                                href="/pay-fees"
                                className="px-5 py-2 rounded-full border border-gold-500 text-gold-500 text-xs font-black uppercase tracking-widest hover:bg-gold-500 hover:text-primary transition-all duration-300"
                            >
                                Pay Fees
                            </Link>
                            <Link
                                href="/admission"
                                className="px-5 py-2 rounded-full bg-gold-500 text-primary text-xs font-black uppercase tracking-widest hover:bg-gold-400 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                            >
                                Apply Now
                            </Link>
                            <Link
                                href="/login"
                                className="px-5 py-2 rounded-full border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-300 ml-1"
                            >
                                Login
                            </Link>
                        </>
                    ) : (
                        <div className="relative flex items-center gap-4">
                            <Link
                                href="/admission"
                                className="px-5 py-2 rounded-full bg-gold-500 text-primary text-xs font-black uppercase tracking-widest hover:bg-gold-400 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                            >
                                Apply Now
                            </Link>
                            <Link
                                href="/pay-fees"
                                className="px-5 py-2 rounded-full border border-gold-500 text-gold-500 text-xs font-black uppercase tracking-widest hover:bg-gold-500 hover:text-primary transition-all duration-300"
                            >
                                Pay Fees
                            </Link>
                            <div className="relative">
                                <button 
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center gap-2 p-1 pr-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group"
                                >
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold-500/50 bg-primary/40">
                                        {user.profilePic ? (
                                            <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gold-500">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-white text-xs font-bold truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                                    <ChevronDown size={14} className={cn("text-white/40 group-hover:text-gold-500 transition-all", profileDropdownOpen && "rotate-180")} />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticated as</p>
                                            <p className="text-sm font-bold text-primary truncate">{user.email}</p>
                                        </div>
                                        <Link 
                                            href="/profile" 
                                            onClick={() => setProfileDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                                        >
                                            <User size={16} className="text-gold-500" /> My Digital Profile
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link 
                                                href="/admin" 
                                                onClick={() => setProfileDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                                            >
                                                <div className="w-4 h-4 bg-primary text-white rounded flex items-center justify-center text-[8px] font-black">A</div> Admin Dashboard
                                            </Link>
                                        )}
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all border-t border-slate-50 mt-1"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-primary border-t border-gold-500/20 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white/80 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                        {user ? (
                            <>
                                <Link 
                                    href="/profile" 
                                    className="w-full py-3 text-center rounded-xl bg-white/5 text-white font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full py-3 text-center rounded-xl bg-red-500/10 text-red-500 font-bold"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/admission"
                                    className="w-full py-3 text-center rounded-xl bg-gold-500 text-primary font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Apply Now
                                </Link>
                                <Link
                                    href="/login"
                                    className="w-full py-3 text-center rounded-xl border border-white/20 text-white font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
