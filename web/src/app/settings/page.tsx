"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface Notification {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'platform'>('profile');
  
  // Profile State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  // Platform Controls State
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [publicForms, setPublicForms] = useState(true);

  // Notification State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
      { id: '1', message: 'System Update: Core Routing Online', isRead: false, createdAt: 'Just now' },
      { id: '2', message: 'New High-Score Application Received', isRead: false, createdAt: '10m ago' }
  ]);

  useEffect(() => {
     // Pre-load logic or fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}`) goes here.
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setProfileMsg("Updating parameters...");
      
      try {
          // Send PUT to our Next API
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}`, {
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

  const markAsRead = async (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      // fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}`, { method: 'PUT', body: JSON.stringify({ id }) });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-700 overflow-hidden">
      <Head><title>System Configurations | Eurovanta Talent Admin</title></Head>

      {/* Sidebar */}
      <aside className="w-64 hidden lg:flex flex-col z-20 bg-white border-r border-slate-200">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
              <img src="https://demo.hmhlabz.com/immihire/wp-content/uploads/immihire-logo.webp" alt="Logo" className="w-8 h-8 object-contain" />
              <h1 className="font-heading font-bold text-xl text-darkBlue tracking-tight">Immi<span className="text-primary">Hire</span></h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
              <Link href="/dashboard" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-grid-2"></i> Dashboard</Link>
              <Link href="/applications" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-users"></i> Applications</Link>
              <Link href="/recruitment" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-briefcase"></i> Recruitment</Link>
              
              <p className="text-xs font-bold text-slate-400 uppercase px-4 mt-8 mb-3 tracking-wider">System</p>
              <Link href="/settings" className="nav-link text-primary bg-blue-50 font-medium flex items-center gap-3 p-3 rounded-xl border-l-4 border-primary"><i className="fa-solid fa-gear"></i> Settings</Link>
              <button 
                onClick={async () => { await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}`, {method: 'POST'}); window.location.href = '/login'; }}
                className="w-full text-left nav-link text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-3 p-3 rounded-xl transition-colors mt-2"
              >
                  <i className="fa-solid fa-power-off"></i> Logout
              </button>
          </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Bar with Integrated Notification Bell representing Epic 4.4 */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
              <h2 className="font-heading font-bold text-2xl text-darkBlue">System Configurations</h2>
              <div className="flex items-center gap-6">
                  
                  {/* Epic 4.4: Notification Bell Hub */}
                  <div className="relative">
                      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative p-2 text-slate-400 hover:text-primary transition-colors focus:outline-none">
                          <i className={`fa-solid fa-bell text-xl ${unreadCount > 0 ? 'animate-pulse text-darkBlue' : ''}`}></i>
                          {unreadCount > 0 && (
                              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                          )}
                      </button>

                      {isDropdownOpen && (
                          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-4">
                              <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                                  <h4 className="font-bold text-sm text-darkBlue">Internal Alerts</h4>
                                  <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                  {notifications.length === 0 && <p className="p-6 text-center text-xs text-slate-400">All clear. No active alerts.</p>}
                                  {notifications.map(n => (
                                      <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'opacity-60 hover:bg-slate-50'}`}>
                                          <div className="flex items-start gap-3">
                                              <div className={`mt-1 w-2 h-2 rounded-full ${!n.isRead ? 'bg-primary shadow-[0_0_5px_#0d5fb7]' : 'bg-slate-300'}`}></div>
                                              <div>
                                                  <p className="text-sm font-medium text-slate-800">{n.message}</p>
                                                  <p className="text-[0.6rem] text-slate-400 font-mono mt-1">{n.createdAt}</p>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden shadow-sm">
                      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
              </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              
              <div className="max-w-4xl mx-auto">
                  
                  {/* Settings Nav Tabs */}
                  <div className="flex gap-4 mb-8 border-b border-slate-200">
                      <button 
                          onClick={() => setActiveTab('profile')} 
                          className={`pb-4 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                          <i className="fa-solid fa-user-shield mr-2"></i> Profile Setup
                      </button>
                      <button 
                          onClick={() => setActiveTab('platform')} 
                          className={`pb-4 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'platform' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                          <i className="fa-solid fa-sliders mr-2"></i> Platform Constants
                      </button>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
                      {/* Holographic background hue */}
                      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary opacity-[0.03] rounded-full filter blur-[100px] pointer-events-none"></div>

                      {activeTab === 'profile' && (
                          <div className="animate-in fade-in slide-in-from-bottom-2">
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
                                            placeholder="admin@immihire.com"
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
                      )}

                      {activeTab === 'platform' && (
                          <div className="animate-in fade-in slide-in-from-bottom-2 relative z-10">
                              <h3 className="font-heading font-bold text-xl text-darkBlue mb-6">Global Directives</h3>
                              
                              <div className="space-y-6 max-w-lg">
                                  <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                      <div>
                                          <h4 className="font-bold text-sm text-slate-800">Public Application Hooks</h4>
                                          <p className="text-xs text-slate-500 mt-1">Permit incoming traffic from the recruitment frontend.</p>
                                      </div>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                          <input type="checkbox" checked={publicForms} onChange={()=>setPublicForms(!publicForms)} className="sr-only peer" />
                                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-successGreen"></div>
                                      </label>
                                  </div>

                                  <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                      <div>
                                          <h4 className="font-bold text-sm text-slate-800">Holographic Telemetry (Sound)</h4>
                                          <p className="text-xs text-slate-500 mt-1">Play interface SFX when hovering 3D elements natively.</p>
                                      </div>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                          <input type="checkbox" checked={soundAlerts} onChange={()=>setSoundAlerts(!soundAlerts)} className="sr-only peer" />
                                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-successGreen"></div>
                                      </label>
                                  </div>

                                  <div className="pt-6">
                                      <button onClick={()=>alert("System Parameters Locked.")} className="w-full py-4 text-xs font-bold text-white tracking-widest uppercase bg-darkBlue rounded-xl hover:bg-black transition-colors shadow-lg">
                                          <i className="fa-solid fa-lock mr-2"></i> Lock Constants
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>

              </div>
          </div>
      </main>
    </div>
  );
}
