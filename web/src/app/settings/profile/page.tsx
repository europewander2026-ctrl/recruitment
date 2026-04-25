"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ProfileSettingsPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileMsg, setProfileMsg] = useState('');

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMsg("Updating parameters...");
        
        try {
            const res = await fetch(`/api/settings/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email || undefined, password: password || undefined })
            });
            const data = await res.json();
            if (res.ok) {
                setProfileMsg(data.message);
                if (data.reauthRequired) {
                    window.location.href = '/login';
                }
            } else {
                setProfileMsg(data.error);
            }
        } catch (err) {
            setProfileMsg("Operation failed.");
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-700 overflow-hidden">
            <Head><title>Profile Settings | Eurovanta Talent Admin</title></Head>

            <aside className="w-64 hidden lg:flex flex-col z-20 bg-white border-r border-slate-200">
                <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                    <Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} className="object-contain" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link href="/dashboard" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-grid-2"></i> Dashboard</Link>
                    <Link href="/applications" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-users"></i> Applications</Link>
                    <Link href="/recruitment" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-briefcase"></i> Recruitment</Link>
                    
                    <p className="text-xs font-bold text-slate-400 uppercase px-4 mt-8 mb-3 tracking-wider">System</p>
                    <Link href="/settings" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-gear"></i> Settings</Link>
                    <Link href="/settings/profile" className="nav-link text-primary bg-blue-50 font-medium flex items-center gap-3 p-3 rounded-xl border-l-4 border-primary"><i className="fa-solid fa-user-shield"></i> Profile</Link>
                    <Link href="/settings/general" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-sliders"></i> General</Link>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
                    <h2 className="font-heading font-bold text-2xl text-darkBlue">Profile Settings</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h3 className="font-heading font-bold text-xl text-darkBlue mb-6">Identity Validation</h3>
                        
                        <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bind New Email Envelope (Optional)</label>
                                <div className="relative">
                                    <input 
                                      type="email" 
                                      value={email}
                                      onChange={e=>setEmail(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors" 
                                      placeholder="admin@example.com"
                                    />
                                    <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                </div>
                            </div>
                            
                            <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl">
                                <h4 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2"><i className="fa-solid fa-triangle-exclamation"></i> Security Override</h4>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cryptographic Key (Leaves session active upon rewrite unless specified)</label>
                                <div className="relative">
                                    <input 
                                      type="password" 
                                      value={password}
                                      onChange={e=>setPassword(e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-400 transition-colors" 
                                      placeholder="Enter new strong passcode..."
                                    />
                                    <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button type="submit" className="px-8 py-3 bg-primary text-white font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                                    <i className="fa-solid fa-satellite-dish"></i> Transmit Update
                                </button>
                                {profileMsg && <span className="text-xs font-bold text-green-600 animate-pulse">{profileMsg}</span>}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
