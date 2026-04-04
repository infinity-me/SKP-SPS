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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const s = await studentService.getAll();
            const f = await feeService.getAll();

            setStudents(s.data.data || []);
            setFees(f.data.data || []);
        };

        loadData();
    }, []);

    const totalFees = fees.reduce((sum, f) => sum + (f.amount || 0), 0);

    const chartData = {
        labels: ["Students", "Fees"],
        datasets: [
            {
                label: "Overview",
                data: [students.length, totalFees],
            },
        ],
    };

    return (
        <div className="p-6">

            {/* 🔥 HEADER */}
            <h1 className="text-3xl font-bold mb-6">Dashboard 🚀</h1>

            {/* 📊 CARDS */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white shadow p-4 rounded-xl">
                    <h2 className="text-gray-500">Students</h2>
                    <p className="text-2xl font-bold">{students.length}</p>
                </div>

                <div className="bg-white shadow p-4 rounded-xl">
                    <h2 className="text-gray-500">Total Fees</h2>
                    <p className="text-2xl font-bold">₹{totalFees}</p>
                </div>

                <div className="bg-white shadow p-4 rounded-xl">
                    <h2 className="text-gray-500">Revenue</h2>
                    <p className="text-2xl font-bold">₹{totalFees}</p>
                </div>
            </div>

            {/* 📈 CHART */}
            <div className="bg-white shadow p-6 rounded-xl mb-6">
                <Bar data={chartData} />
            </div>

            {/* 👨‍🎓 STUDENT TABLE */}
            <div className="bg-white shadow p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Students</h2>

                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th>Name</th>
                            <th>Class</th>
                            <th>Section</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((s) => (
                            <tr key={s.id}>
                                <td>{s.firstName} {s.lastName}</td>
                                <td>{s.class}</td>
                                <td>{s.section}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}