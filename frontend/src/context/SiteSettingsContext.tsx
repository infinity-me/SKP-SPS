"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { systemSettingsService } from "@/lib/api"

export interface SiteSettings {
    schoolName: string
    registrationNo: string
    primaryEmail: string
    phone: string
    address: string
    website: string
    principalName: string
    established: string
    affiliation: string
    schoolTagline: string
    primaryColor: string
    accentColor: string
    logoUrl: string
    faviconUrl: string
    // notifications / security not needed on public site
}

const DEFAULTS: SiteSettings = {
    schoolName: "SKP Sainik Public School",
    registrationNo: "REGN-2026-UP-001",
    primaryEmail: "skpspsmanihari09@gmail.com",
    phone: "9454331861, 8449790561",
    address: "Village Manihari, Deoria, Uttar Pradesh, India",
    website: "https://skpsps.in",
    principalName: "Mrs. Shobha Sharma",
    established: "2009",
    affiliation: "CBSE",
    schoolTagline: "Shaping Tomorrow's Leaders Today",
    primaryColor: "#0a2342",
    accentColor: "#d4af37",
    logoUrl: "",
    faviconUrl: "",
}

const SiteSettingsContext = createContext<SiteSettings>(DEFAULTS)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)

    useEffect(() => {
        systemSettingsService.get()
            .then(res => {
                if (res.data?.data) setSettings({ ...DEFAULTS, ...res.data.data })
            })
            .catch(() => {/* silently fall back to defaults */})
    }, [])

    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
