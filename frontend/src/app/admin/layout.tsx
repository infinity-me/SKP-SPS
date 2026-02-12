import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <AdminSidebar />
            <div className="flex-grow ml-64 min-h-screen">
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
                    <h2 className="font-heading font-bold text-slate-400 uppercase tracking-widest text-[10px]">Portal / Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-primary">Administrator</span>
                            <span className="text-[10px] text-green-500 font-bold uppercase">Online</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
                    </div>
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
