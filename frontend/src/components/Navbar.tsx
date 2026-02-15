"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Fee Structure", href: "/fees" },
    { name: "Calendar", href: "/calendar" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
]

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const isHomePage = pathname === "/"

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                (isScrolled || !isHomePage)
                    ? "bg-primary/95 backdrop-blur-md border-b border-gold-500/20 py-3 shadow-lg"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white rounded-full p-1 overflow-hidden">
                        <Image
                            src="/images/logo.png"
                            alt="SKP School Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-white font-heading font-black text-xs md:text-sm tracking-tighter leading-tight italic uppercase">
                            <span className="text-sm md:text-base tracking-normal not-italic font-black">SKP SAINIK</span> <br />
                            <span className="text-gold-500 font-bold not-italic tracking-normal">PUBLIC SCHOOL</span>
                        </h1>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white/80 hover:text-gold-500 transition-colors font-medium text-sm"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-white/80 hover:text-gold-500 transition-colors font-medium text-sm mr-2"
                    >
                        Login
                    </Link>
                    <Link
                        href="/pay-fees"
                        className="px-5 py-2 rounded-full border border-gold-500 text-gold-500 text-sm font-semibold hover:bg-gold-500 hover:text-primary transition-all duration-300"
                    >
                        Pay Fees
                    </Link>
                    <Link
                        href="/admission"
                        className="px-5 py-2 rounded-full bg-gold-500 text-primary text-sm font-semibold hover:bg-gold-400 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    >
                        Apply Now
                    </Link>
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
                        <Link
                            href="/login"
                            className="w-full py-3 text-center rounded-xl text-white/80 font-bold border border-white/10"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            href="/pay-fees"
                            className="w-full py-3 text-center rounded-xl border border-gold-500 text-gold-500 font-bold"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pay Fees
                        </Link>
                        <Link
                            href="/admission"
                            className="w-full py-3 text-center rounded-xl bg-gold-500 text-primary font-bold"
                        >
                            Apply Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
