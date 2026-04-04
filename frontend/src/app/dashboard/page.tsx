"use client";

import { useEffect, useState } from "react";
import { studentService, feeService } from "@/lib/api";
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
export default function Dashboard() {
    const [students, setStudents] = useState<any[]>([]);
    const [fees, setFees] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (!token || !userData) {
            window.location.href = "/login";
            return;
        }
        setUser(JSON.parse(userData));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!user || user.role === 'guest') return;

        const loadData = async () => {
            try {
                const s = await studentService.getAll();
                const f = await feeService.getAll();

                setStudents(s.data.data || []);
                setFees(f.data.data || []);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        };

        loadData();
    }, [user]);

    if (isLoading) return <div className="p-6">Loading...</div>;

    if (user?.role === 'guest') {
        return (
            <div className="p-8 max-w-4xl mx-auto space-y-8">
                <div className="bg-primary p-12 rounded-3xl text-white text-center space-y-4">
                    <h1 className="text-4xl font-black font-heading">Welcome Explorer! 🌟</h1>
                    <p className="text-white/60 text-lg">You are currently logged in as a Guest. Explore the portal to see what SKP SAINIK has to offer.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                        <h2 className="text-xl font-bold text-primary">Academic Calendar</h2>
                        <p className="text-slate-500 text-sm">View our upcoming events, holidays, and examination schedules.</p>
                        <button className="text-gold-500 font-bold hover:underline">View Calendar</button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                        <h2 className="text-xl font-bold text-primary">School Gallery</h2>
                        <p className="text-slate-500 text-sm">Take a look at our campus life, activities, and infrastructure.</p>
                        <button className="text-gold-500 font-bold hover:underline">Open Gallery</button>
                    </div>
                </div>
            </div>
        );
    }

    const totalFees = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const chartData = {
        labels: ["Students", "Fees"],
        datasets: [{
            label: "Overview",
            data: [students.length, totalFees],
            backgroundColor: ["#1e293b", "#eab308"],
            borderRadius: 8
        }],
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-black font-heading text-primary">Admin Dashboard 🚀</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard title="Total Students" value={students.length} />
                <DashboardCard title="Total Fees" value={`₹${totalFees}`} />
                <DashboardCard title="Teacher Count" value="Loading..." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-4">Financial Overview</h2>
                    <Bar data={chartData} />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/students" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 font-bold text-slate-600 transition-all">Students</Link>
                        <Link href="/admin/teachers" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 font-bold text-slate-600 transition-all">Teachers</Link>
                        <Link href="/admin/finance" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 font-bold text-slate-600 transition-all">Finance</Link>
                        <Link href="/admin/circulars" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 font-bold text-slate-600 transition-all">Circulars</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ title, value }: any) {
    return (
        <div className="bg-white shadow-sm border border-slate-100 p-6 rounded-2xl">
            <h2 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</h2>
            <p className="text-3xl font-black text-primary">{value}</p>
        </div>
    )
}

import Link from "next/link";