"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Check, ClipboardList, User, Home, GraduationCap, ShieldCheck,
    ChevronRight, AlertCircle, Phone, Mail, MapPin, BookOpen,
    Calendar, Users, Briefcase, Building2
} from "lucide-react"
import { admissionService } from "@/lib/api"
import { cn } from "@/lib/utils"

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface FormData {
    // Step 1 – Student
    firstName: string
    lastName: string
    dob: string
    gender: string
    classApplied: string
    // Step 2 – Parent
    fatherName: string
    motherName: string
    occupation: string
    annualIncome: string
    // Step 3 – Contact
    phone: string
    email: string
    address: string
    // Step 4 – Academic
    previousSchool: string
    lastClass: string
    reasonLeaving: string
    achievements: string
}

const EMPTY: FormData = {
    firstName: "", lastName: "", dob: "", gender: "", classApplied: "",
    fatherName: "", motherName: "", occupation: "", annualIncome: "",
    phone: "", email: "", address: "",
    previousSchool: "", lastClass: "", reasonLeaving: "", achievements: ""
}

const CLASS_OPTIONS = [
    "Nursery", "LKG", "UKG",
    "Class I", "Class II", "Class III", "Class IV", "Class V",
    "Class VI", "Class VII", "Class VIII", "Class IX", "Class X"
]

/* ─── Step Config ─────────────────────────────────────────────────────────── */
const STEPS = [
    { id: 1, title: "Student Info", icon: User },
    { id: 2, title: "Parent Details", icon: Users },
    { id: 3, title: "Contact", icon: Home },
    { id: 4, title: "Academics", icon: GraduationCap },
    { id: 5, title: "Review & Submit", icon: ShieldCheck },
]

/* ─── Validation ──────────────────────────────────────────────────────────── */
function validateStep(step: number, data: FormData): string | null {
    if (step === 1) {
        if (!data.firstName.trim()) return "Student's first name is required."
        if (!data.lastName.trim()) return "Student's last name is required."
        if (!data.dob) return "Date of birth is required."
        if (!data.gender) return "Please select a gender."
        if (!data.classApplied) return "Please select the class for admission."
    }
    if (step === 2) {
        if (!data.fatherName.trim() && !data.motherName.trim()) return "At least one parent name is required."
    }
    if (step === 3) {
        if (!data.phone.trim()) return "Phone number is required."
        if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, ""))) return "Enter a valid 10-digit Indian mobile number."
        if (!data.email.trim()) return "Email address is required."
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Enter a valid email address."
        if (!data.address.trim()) return "Residential address is required."
    }
    return null
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */
function Field({ label, required, icon: Icon, children }: {
    label: string; required?: boolean; icon?: any; children: React.ReactNode
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                {Icon && <Icon size={11} className="text-gold-500" />}
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    )
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none transition-all"

/* ─── Review Row ──────────────────────────────────────────────────────────── */
function ReviewRow({ label, value }: { label: string; value?: string }) {
    if (!value) return null
    return (
        <div className="flex justify-between items-start py-2 border-b border-slate-100 last:border-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-40 flex-shrink-0">{label}</span>
            <span className="text-sm font-medium text-slate-700 text-right">{value}</span>
        </div>
    )
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function AdmissionPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>(EMPTY)
    const [error, setError] = useState<string | null>(null)
    const [submittedId, setSubmittedId] = useState<number | null>(null)

    const set = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (error) setError(null)
    }

    const nextStep = async () => {
        // Validate before advancing
        if (currentStep < 5) {
            const validationError = validateStep(currentStep, formData)
            if (validationError) { setError(validationError); return }
        }

        if (currentStep === 5) {
            // Submit
            setIsLoading(true)
            setError(null)
            try {
                const res = await admissionService.submit(formData)
                if (res.data?.success) {
                    setSubmittedId(res.data.data?.id)
                    setIsSubmitted(true)
                } else {
                    setError(res.data?.message || "Submission failed. Please try again.")
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "Network error. Please check your connection and try again.")
            } finally {
                setIsLoading(false)
            }
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        setError(null)
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-32 pb-20 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 rounded-full text-gold-700 text-xs font-black uppercase tracking-widest mb-4">
                        ● Admissions Open 2026-27
                    </div>
                    <h1 className="text-3xl md:text-5xl font-heading font-black text-primary mb-3">
                        Online Admission Form
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Fill all details carefully. Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                    </p>
                </div>

                {/* Step Progress */}
                <div className="flex items-center mb-8">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon
                        const isCompleted = currentStep > step.id
                        const isActive = currentStep === step.id
                        return (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border-2",
                                        isCompleted ? "bg-gold-500 border-gold-500 text-primary"
                                            : isActive ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20"
                                                : "bg-white border-slate-200 text-slate-400"
                                    )}>
                                        {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-wider mt-1.5 hidden sm:block",
                                        isActive ? "text-primary" : isCompleted ? "text-gold-600" : "text-slate-300"
                                    )}>
                                        {step.title}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn(
                                        "flex-1 h-0.5 mx-2 mb-4 transition-colors duration-500",
                                        isCompleted ? "bg-gold-400" : "bg-slate-200"
                                    )} />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.25 }}
                                className="p-8 md:p-10"
                            >
                                {/* Error Banner */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-red-700"
                                    >
                                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </motion.div>
                                )}

                                {/* ── Step 1: Student Info ── */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-heading font-black text-primary">Student Information</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Details about the student applying for admission.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Field label="First Name" required icon={User}>
                                                <input value={formData.firstName} onChange={e => set('firstName', e.target.value)}
                                                    placeholder="e.g. Rahul" className={inputCls} />
                                            </Field>
                                            <Field label="Last Name" required icon={User}>
                                                <input value={formData.lastName} onChange={e => set('lastName', e.target.value)}
                                                    placeholder="e.g. Sharma" className={inputCls} />
                                            </Field>
                                            <Field label="Date of Birth" required icon={Calendar}>
                                                <input type="date" value={formData.dob} onChange={e => set('dob', e.target.value)}
                                                    max={new Date().toISOString().split('T')[0]} className={inputCls} />
                                            </Field>
                                            <Field label="Gender" required icon={Users}>
                                                <select value={formData.gender} onChange={e => set('gender', e.target.value)} className={inputCls}>
                                                    <option value="">Select Gender</option>
                                                    {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
                                                </select>
                                            </Field>
                                            <Field label="Class Applying For" required icon={BookOpen}>
                                                <select value={formData.classApplied} onChange={e => set('classApplied', e.target.value)} className={inputCls}>
                                                    <option value="">Select Class</option>
                                                    {CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}
                                                </select>
                                            </Field>
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 2: Parent Info ── */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-heading font-black text-primary">Parent / Guardian Details</h2>
                                            <p className="text-sm text-muted-foreground mt-1">At least one parent name is required.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Field label="Father's Name" icon={User}>
                                                <input value={formData.fatherName} onChange={e => set('fatherName', e.target.value)}
                                                    placeholder="Father's full name" className={inputCls} />
                                            </Field>
                                            <Field label="Mother's Name" icon={User}>
                                                <input value={formData.motherName} onChange={e => set('motherName', e.target.value)}
                                                    placeholder="Mother's full name" className={inputCls} />
                                            </Field>
                                            <Field label="Occupation" icon={Briefcase}>
                                                <input value={formData.occupation} onChange={e => set('occupation', e.target.value)}
                                                    placeholder="e.g. Farmer, Government Employee" className={inputCls} />
                                            </Field>
                                            <Field label="Annual Income" icon={Briefcase}>
                                                <select value={formData.annualIncome} onChange={e => set('annualIncome', e.target.value)} className={inputCls}>
                                                    <option value="">Select Income Range</option>
                                                    {["Below ₹1 Lakh", "₹1-3 Lakh", "₹3-6 Lakh", "₹6-10 Lakh", "Above ₹10 Lakh"].map(r => <option key={r}>{r}</option>)}
                                                </select>
                                            </Field>
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 3: Contact ── */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-heading font-black text-primary">Contact Information</h2>
                                            <p className="text-sm text-muted-foreground mt-1">We'll use these details to reach you.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Field label="Mobile Number" required icon={Phone}>
                                                <input value={formData.phone} onChange={e => set('phone', e.target.value)}
                                                    placeholder="10-digit mobile number" maxLength={10} className={inputCls} />
                                            </Field>
                                            <Field label="Email Address" required icon={Mail}>
                                                <input type="email" value={formData.email} onChange={e => set('email', e.target.value)}
                                                    placeholder="example@email.com" className={inputCls} />
                                            </Field>
                                            <div className="md:col-span-2">
                                                <Field label="Residential Address" required icon={MapPin}>
                                                    <textarea value={formData.address} onChange={e => set('address', e.target.value)}
                                                        placeholder="Complete address with village/city, district, state, PIN"
                                                        rows={3} className={cn(inputCls, "resize-none")} />
                                                </Field>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 4: Academic History ── */}
                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-heading font-black text-primary">Academic History</h2>
                                            <p className="text-sm text-muted-foreground mt-1">All fields on this step are optional but helpful.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Field label="Previous School Name" icon={Building2}>
                                                <input value={formData.previousSchool} onChange={e => set('previousSchool', e.target.value)}
                                                    placeholder="Name of previous school" className={inputCls} />
                                            </Field>
                                            <Field label="Last Class Attended" icon={BookOpen}>
                                                <input value={formData.lastClass} onChange={e => set('lastClass', e.target.value)}
                                                    placeholder="e.g. Class V" className={inputCls} />
                                            </Field>
                                            <Field label="Reason for Leaving" icon={ClipboardList}>
                                                <input value={formData.reasonLeaving} onChange={e => set('reasonLeaving', e.target.value)}
                                                    placeholder="Reason for leaving previous school" className={inputCls} />
                                            </Field>
                                            <Field label="Achievements (Optional)" icon={GraduationCap}>
                                                <input value={formData.achievements} onChange={e => set('achievements', e.target.value)}
                                                    placeholder="Sports, cultural, academic achievements" className={inputCls} />
                                            </Field>
                                        </div>
                                    </div>
                                )}

                                {/* ── Step 5: Review ── */}
                                {currentStep === 5 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-xl font-heading font-black text-primary">Review Your Application</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Please verify all details before submitting.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-gold-600 mb-3">Student Information</h3>
                                                <ReviewRow label="Full Name" value={`${formData.firstName} ${formData.lastName}`} />
                                                <ReviewRow label="Date of Birth" value={formData.dob} />
                                                <ReviewRow label="Gender" value={formData.gender} />
                                                <ReviewRow label="Class Applied" value={formData.classApplied} />
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-gold-600 mb-3">Parent / Guardian</h3>
                                                <ReviewRow label="Father's Name" value={formData.fatherName} />
                                                <ReviewRow label="Mother's Name" value={formData.motherName} />
                                                <ReviewRow label="Occupation" value={formData.occupation} />
                                                <ReviewRow label="Annual Income" value={formData.annualIncome} />
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-gold-600 mb-3">Contact</h3>
                                                <ReviewRow label="Mobile" value={formData.phone} />
                                                <ReviewRow label="Email" value={formData.email} />
                                                <ReviewRow label="Address" value={formData.address} />
                                            </div>
                                            {(formData.previousSchool || formData.lastClass) && (
                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-gold-600 mb-3">Academic History</h3>
                                                    <ReviewRow label="Previous School" value={formData.previousSchool} />
                                                    <ReviewRow label="Last Class" value={formData.lastClass} />
                                                    <ReviewRow label="Reason Leaving" value={formData.reasonLeaving} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-sm text-slate-600">
                                            By submitting this form, you confirm that all information provided is accurate. The school will contact you for further admission process.
                                        </div>
                                    </div>
                                )}

                                {/* Nav Buttons */}
                                <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
                                    <button
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="px-6 py-2.5 rounded-xl font-bold text-sm text-primary hover:bg-slate-100 transition-colors disabled:opacity-0"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </span>
                                        ) : currentStep === 5 ? (
                                            <><Check size={16} /> Submit Application</>
                                        ) : (
                                            <>Continue <ChevronRight size={16} /></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            /* Success Screen */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-12 flex flex-col items-center text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 15, delay: 0.2 }}
                                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/30"
                                >
                                    <Check size={48} />
                                </motion.div>
                                <h2 className="text-3xl font-heading font-black text-primary mb-3">
                                    Application Submitted!
                                </h2>
                                {submittedId && (
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Application ID: #{submittedId}
                                    </p>
                                )}
                                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm leading-relaxed">
                                    Thank you, <strong className="text-primary">{formData.firstName}</strong>! Your application for <strong>{formData.classApplied}</strong> has been received.
                                    Our team will contact you at <strong>{formData.phone}</strong> for next steps.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href="/"
                                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                                    >
                                        Back to Home
                                    </a>
                                    <button
                                        onClick={() => { setIsSubmitted(false); setFormData(EMPTY); setCurrentStep(1) }}
                                        className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                                    >
                                        Submit Another
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Help Footer */}
                {!isSubmitted && (
                    <p className="text-center text-xs text-slate-400 mt-6">
                        Need help? Call us at{" "}
                        <a href="tel:+919454331861" className="text-primary font-bold hover:underline">+91 9454331861</a>
                        {" "}or email{" "}
                        <a href="mailto:skpspsmanihari09@gmail.com" className="text-primary font-bold hover:underline">skpspsmanihari09@gmail.com</a>
                    </p>
                )}
            </div>
        </div>
    )
}
