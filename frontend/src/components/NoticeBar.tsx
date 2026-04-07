"use client"

import { useState, useEffect, useRef } from "react"
import { X, Megaphone } from "lucide-react"
import { noticeService } from "@/lib/api"

interface Notice {
    id: number
    message: string
    type: string
}

/* ── colour palette per notice type ── */
const TYPE_STYLE: Record<string, { bar: string; label: string; dot: string }> = {
    urgent:  { bar: "bg-red-600",          label: "bg-red-800 text-white",     dot: "bg-red-300" },
    warning: { bar: "bg-amber-500",         label: "bg-amber-700 text-white",   dot: "bg-amber-200" },
    success: { bar: "bg-emerald-600",       label: "bg-emerald-800 text-white", dot: "bg-emerald-300" },
    info:    { bar: "bg-[#1a2744]",         label: "bg-[#d4af37]  text-[#1a2744]", dot: "bg-sky-300" },
}

export default function NoticeBar() {
    const [notices, setNotices] = useState<Notice[]>([])
    const [dismissed, setDismissed] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        noticeService.getActive()
            .then(res => { if (res.data?.data?.length) setNotices(res.data.data) })
            .catch(() => {})
    }, [])

    if (dismissed || notices.length === 0) return null

    /* Build one long string: all messages joined with a separator */
    const separator = "  ✦  "
    const ticker = notices.map(n => n.message).join(separator) + separator

    /* Pick style from the first notice */
    const cfg = TYPE_STYLE[notices[0].type] ?? TYPE_STYLE.info

    return (
        <div className={`w-full flex items-stretch ${cfg.bar} shadow-sm z-0 relative`} style={{ height: "36px" }}>

            {/* LEFT LABEL CHIP — e.g. "NOTICE" */}
            <div
                className={`flex items-center gap-2 px-4 shrink-0 font-black text-[11px] uppercase tracking-widest select-none ${cfg.label}`}
                style={{ minWidth: "110px" }}
            >
                <Megaphone size={13} className="shrink-0" />
                Notice
            </div>

            {/* DIVIDER */}
            <div className="w-px bg-white/20 shrink-0" />

            {/* SCROLLING TRACK */}
            <div className="flex-1 overflow-hidden relative">
                <style>{`
                    @keyframes ticker {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .ticker-track {
                        display: inline-flex;
                        white-space: nowrap;
                        animation: ticker 28s linear infinite;
                        will-change: transform;
                    }
                    .ticker-track:hover {
                        animation-play-state: paused;
                    }
                `}</style>

                {/* Duplicate content for seamless loop */}
                <div
                    ref={trackRef}
                    className="ticker-track h-full items-center text-white text-[13px] font-medium"
                    style={{ height: "36px", lineHeight: "36px" }}
                >
                    {/* First copy */}
                    <span className="px-6">{ticker}</span>
                    {/* Duplicate for seamless loop */}
                    <span className="px-6">{ticker}</span>
                </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
                onClick={() => setDismissed(true)}
                aria-label="Close notices"
                className="shrink-0 flex items-center justify-center w-9 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    )
}
