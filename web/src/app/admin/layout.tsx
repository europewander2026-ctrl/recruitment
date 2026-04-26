import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-700 overflow-hidden">
            <Sidebar />
            {children}
        </div>
    );
}
