"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ClipboardList, User, Home, GraduationCap, ShieldCheck, ArrowRight, ArrowLeft, ChevronRight, Users, Phone, Upload } from "lucide-react"
import { admissionService } from "@/lib/api"
import { cn } from "@/lib/utils"

const steps = [
    { id: 1, title: "Student Info", icon: <User size={20} /> },
    { id: 2, title: "Parent Details", icon: <ClipboardList size={20} /> },
    { id: 3, title: "Contact", icon: <Home size={20} /> },
    { id: 4, title: "Academics", icon: <GraduationCap size={20} /> },
    { id: 5, title: "Review", icon: <ShieldCheck size={20} /> },
]

export default function AdmissionPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<any>({}) // State to hold form data

    const nextStep = async () => {
        if (currentStep === steps.length) { // Assuming the last step is the review/submit step
            setIsLoading(true)
            try {
                // In a real application, you would collect data from all steps into formData
                // and then pass it to the service. For this example, we'll use a placeholder.
                const response = await admissionService.submit(formData)
                if (response.data.success) {
                    setIsSubmitted(true)
                } else {
                    alert(response.data.message || "Submission failed")
                }
            } catch (error) {
                console.error("Submission error:", error)
                alert("An error occurred during submission.")
            } finally {
                setIsLoading(false)
            }
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length))
        }
    }
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-4">Online Admission</h1>
                    <p className="text-muted-foreground">Please fill the form below to apply for the academic year 2026-27.</p>
                </div>

                {/* Steps Progress */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                    currentStep >= step.id ? "bg-gold-500 text-primary shadow-lg lg:scale-110" : "bg-white text-slate-400 border border-slate-200"
                                )}
                            >
                                {currentStep > step.id ? <Check size={20} /> : step.icon}
                            </div>
                            <span className={cn("text-xs font-bold uppercase tracking-wider hidden sm:block", currentStep >= step.id ? "text-primary" : "text-slate-400")}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 min-h-[500px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex-grow"
                            >
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-heading font-bold text-primary">Student Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Full Name" placeholder="Student's Full Name" />
                                            <InputGroup label="Date of Birth" type="date" />
                                            <InputGroup label="Gender" type="select" options={["Male", "Female", "Other"]} />
                                            <InputGroup label="Class Seeking Admission" type="select" options={["LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]} />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-heading font-bold text-primary">Parent / Guardian Details</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Father's Name" placeholder="Father's Name" />
                                            <InputGroup label="Mother's Name" placeholder="Mother's Name" />
                                            <InputGroup label="Occupation" placeholder="Father's/Mother's Occupation" />
                                            <InputGroup label="Monthly Income" placeholder="Annual Income Range" />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-heading font-bold text-primary">Contact Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Phone Number" placeholder="+91 00000 00000" />
                                            <InputGroup label="Email Address" type="email" placeholder="example@email.com" />
                                            <div className="col-span-1 md:col-span-2">
                                                <InputGroup label="Residential Address" placeholder="Complete Address" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-heading font-bold text-primary">Academic History</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Previous School Name" placeholder="Name of previous school" />
                                            <InputGroup label="Last Class Attended" placeholder="e.g., 5th Grade" />
                                            <InputGroup label="Reason for Leaving" placeholder="Reason for leaving previous school" />
                                            <InputGroup label="Achievements" placeholder="Academic or extracurricular achievements (optional)" />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <div className="space-y-6 text-center">
                                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 mx-auto mb-6">
                                            <ShieldCheck size={40} />
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold text-primary">Final Review</h2>
                                        <p className="text-muted-foreground">Please review all details before submitting your application. Once submitted, you cannot change the information online.</p>
                                        <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-200">
                                            <p className="text-sm text-muted-foreground">By submitting this form, you agree to the school's terms and conditions regarding the admission process.</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-grow flex flex-col items-center justify-center text-center py-12"
                            >
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-green-500/20">
                                    <Check size={48} />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-primary mb-4">Application Submitted!</h2>
                                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                    Your application for admission to SKP SAINIK PUBLIC SCHOOL has been received. Our team will review it and contact you soon.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-navy-800 transition-colors"
                                >
                                    Download Receipt
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isSubmitted && (
                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-6 py-2.5 rounded-xl font-bold text-primary hover:bg-slate-100 transition-colors disabled:opacity-0"
                            >
                                Back
                            </button>
                            <button
                                onClick={currentStep === 4 ? () => setIsSubmitted(true) : nextStep}
                                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-primary/20"
                            >
                                {currentStep === 4 ? "Submit Application" : "Continue"}
                                {currentStep !== 4 && <ChevronRight size={18} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function InputGroup({ label, placeholder, type = "text", options = [] }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-primary tracking-wide uppercase">{label}</label>
            {type === "select" ? (
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all">
                    <option value="">Select {label}</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all"
                />
            )}
        </div>
    )
}
