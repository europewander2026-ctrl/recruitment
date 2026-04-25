"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/logout`, {method: 'POST'});
        } catch (e) {
            console.error('Logout failed', e);
        }
        window.location.href = '/login';
    };

    return (
        <aside className="w-64 hidden lg:flex flex-col z-20 bg-white border-r border-slate-200">
            <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                <div className="w-full max-w-[140px]">
                    <Image src="/logo.png" alt="Eurovanta Talent Logo" width={140} height={32} className="object-contain w-full h-auto" />
                </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
                <p className="text-xs font-bold text-slate-400 uppercase px-4 mb-3 tracking-wider">Main Menu</p>
                
                {/* Pointing Dashboard directly to /applications as requested */}
                <Link href="/applications" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/dashboard' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                    <i className="fa-solid fa-grid-2 w-5 text-center"></i> Dashboard
                </Link>
                
                <Link href="/applications" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/applications' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                    <i className="fa-solid fa-users w-5 text-center"></i> Applications
                </Link>
                
                <Link href="/recruitment" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/recruitment' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                    <i className="fa-solid fa-briefcase w-5 text-center"></i> Recruitment
                </Link>

                <p className="text-xs font-bold text-slate-400 uppercase px-4 mt-8 mb-3 tracking-wider">System</p>
                
                <Link href="/settings" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/settings' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                    <i className="fa-solid fa-gear w-5 text-center"></i> Settings
                </Link>
                
                <Link href="/settings/profile" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/settings/profile' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                    <i className="fa-solid fa-user-shield w-5 text-center"></i> Profile
                </Link>

                <Link href="/settings/general" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/settings/general' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                    <i className="fa-solid fa-sliders w-5 text-center"></i> General
                </Link>

                <button 
                  onClick={handleLogout}
                  className="w-full text-left nav-link text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-3 p-3 rounded-xl transition-colors mt-2"
                >
                    <i className="fa-solid fa-power-off w-5 text-center"></i> Logout
                </button>
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white transition shadow-sm border border-transparent hover:border-slate-200">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="Admin" />
                    <div>
                        <p className="text-sm font-bold text-slate-800">Admin User</p>
                        <p className="text-xs text-slate-500">Super Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
