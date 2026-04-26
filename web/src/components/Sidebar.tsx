"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/logout`, {method: 'POST'});
        } catch (e) {
            console.error('Logout failed', e);
        }
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Top Header */}
            <div className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-30">
                <div className="w-[120px]">
                    <Image src="/logo.png" alt="Eurovanta Talent Logo" width={140} height={32} className="object-contain w-full h-auto" />
                </div>
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 hover:text-primary">
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-slate-900/50 z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Sidebar (Desktop Fixed, Mobile Drawer) */}
            <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <div className="w-full max-w-[140px]">
                        <Image src="/logo.png" alt="Eurovanta Talent Logo" width={140} height={32} className="object-contain w-full h-auto" />
                    </div>
                    <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
                    <p className="text-xs font-bold text-slate-400 uppercase px-4 mb-3 tracking-wider">Main Menu</p>
                    
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/dashboard" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/admin/dashboard' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                        <i className="fa-solid fa-grid-2 w-5 text-center"></i> Dashboard
                    </Link>
                    
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/applications" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/admin/applications' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                        <i className="fa-solid fa-users w-5 text-center"></i> Applications
                    </Link>
                    
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/recruitment" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/admin/recruitment' ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                        <i className="fa-solid fa-briefcase w-5 text-center"></i> Recruitment
                    </Link>

                    <p className="text-xs font-bold text-slate-400 uppercase px-4 mt-8 mb-3 tracking-wider">System</p>
                    
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/settings" className={`nav-link flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname.startsWith('/admin/settings') ? 'text-primary bg-blue-50 font-medium border-l-4 border-primary' : 'text-slate-500 hover:text-primary hover:bg-blue-50'}`}>
                        <i className="fa-solid fa-gear w-5 text-center"></i> Settings
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
        </>
    );
}
