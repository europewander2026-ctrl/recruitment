"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Bell } from 'lucide-react';

interface Notification {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'platform' | 'cms' | 'homepage' | 'taxonomies'>('profile');
  
  // Profile State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  // Platform Controls State
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [publicForms, setPublicForms] = useState(true);

  // CMS State
  const [cmsSlug, setCmsSlug] = useState('privacy-policy');
  const [cmsTitle, setCmsTitle] = useState('Privacy Policy');
  const [cmsContent, setCmsContent] = useState('');
  const [cmsMsg, setCmsMsg] = useState('');

  // Homepage Config State
  const [homeConfig, setHomeConfig] = useState({
      home_hero_text: '',
      home_hero_highlight: '',
      home_journey_text: '',
      home_fraud_warning: ''
  });
  const [homeMsg, setHomeMsg] = useState('');

  // Taxonomy State
  const [categories, setCategories] = useState<{id: string, name: string, isActive: boolean}[]>([]);
  const [countries, setCountries] = useState<{id: string, name: string, region: string | null, isActive: boolean}[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCountryName, setNewCountryName] = useState('');
  const [newCountryRegion, setNewCountryRegion] = useState('');
  const [taxMsg, setTaxMsg] = useState('');

  // Notification State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
      { id: '1', message: 'System Update: Core Routing Online', isRead: false, createdAt: 'Just now' },
      { id: '2', message: 'New High-Score Application Received', isRead: false, createdAt: '10m ago' }
  ]);

  useEffect(() => {
     if (activeTab === 'cms') {
         fetch(`/api/content?slug=${cmsSlug}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setCmsContent(data.data.content);
                } else {
                    setCmsContent('');
                }
            });
     } else if (activeTab === 'homepage') {
         fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const newConfig = { ...homeConfig };
                    data.data.forEach((item: any) => {
                        newConfig[item.key as keyof typeof newConfig] = item.value;
                    });
                    setHomeConfig(newConfig);
                }
            })
            .catch(err => console.error("Error fetching home config:", err));
     } else if (activeTab === 'taxonomies') {
         fetch('/api/taxonomies?type=category').then(r => r.json()).then(d => { if(d.success) setCategories(d.data) });
         fetch('/api/taxonomies?type=country').then(r => r.json()).then(d => { if(d.success) setCountries(d.data) });
     }
  }, [activeTab, cmsSlug]);

  const handleCmsUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setCmsMsg("Saving...");
      try {
          const res = await fetch('/api/content', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slug: cmsSlug, title: cmsTitle, content: cmsContent })
          });
          if (res.ok) setCmsMsg("Content saved successfully!");
          else setCmsMsg("Error saving content.");
      } catch (err) {
          setCmsMsg("Operation failed.");
      }
      setTimeout(() => setCmsMsg(''), 3000);
  };

  const handleHomeUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setHomeMsg("Saving...");
      try {
          const res = await fetch('/api/config', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(homeConfig)
          });
          if (res.ok) setHomeMsg("Content saved successfully!");
          else setHomeMsg("Error saving content.");
      } catch (err) {
          setHomeMsg("Operation failed.");
      }
      setTimeout(() => setHomeMsg(''), 3000);
  };

  const handleAddTaxonomy = async (type: 'category' | 'country', e: React.FormEvent) => {
      e.preventDefault();
      setTaxMsg("Saving...");
      const payload = type === 'category' 
          ? { type: 'category', name: newCatName }
          : { type: 'country', name: newCountryName, region: newCountryRegion };

      try {
          const res = await fetch('/api/taxonomies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
              setTaxMsg(`${type} added successfully!`);
              if (type === 'category') {
                  setCategories([...categories, data.data]);
                  setNewCatName('');
              } else {
                  setCountries([...countries, data.data]);
                  setNewCountryName('');
                  setNewCountryRegion('');
              }
          } else {
              setTaxMsg(data.error || "Error saving taxonomy.");
          }
      } catch (err) {
          setTaxMsg("Operation failed.");
      }
      setTimeout(() => setTaxMsg(''), 3000);
  };

  const handleDeleteTaxonomy = async (type: 'category' | 'country', id: string) => {
      if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
      try {
          const res = await fetch(`/api/taxonomies?type=${type}&id=${id}`, { method: 'DELETE' });
          if (res.ok) {
              if (type === 'category') setCategories(categories.filter(c => c.id !== id));
              if (type === 'country') setCountries(countries.filter(c => c.id !== id));
          }
      } catch (err) {
          console.error(err);
      }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setProfileMsg("Updating parameters...");
      
      try {
          // Send PUT to our Next API
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/settings/profile`, {
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
      // fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/notifications`, { method: 'PUT', body: JSON.stringify({ id }) });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
<Head><title>System Configurations | Eurovanta Talent Admin</title></Head>

      
      

      
      <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Bar with Integrated Notification Bell representing Epic 4.4 */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
              <h2 className="font-heading font-bold text-2xl text-darkBlue">System Configurations</h2>
              <div className="flex items-center gap-6">
                  
                  {/* Epic 4.4: Notification Bell Hub */}
                  <div className="relative">
                      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative p-2 text-slate-400 hover:text-primary transition-colors focus:outline-none">
                          <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'animate-pulse text-darkBlue' : ''}`} />
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
                      <button 
                          onClick={() => setActiveTab('cms')} 
                          className={`pb-4 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'cms' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                          <i className="fa-solid fa-file-contract mr-2"></i> Legal Content
                      </button>
                      <button 
                          onClick={() => setActiveTab('homepage')} 
                          className={`pb-4 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'homepage' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                          <i className="fa-solid fa-home mr-2"></i> Homepage
                      </button>
                      <button 
                          onClick={() => setActiveTab('taxonomies')} 
                          className={`pb-4 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'taxonomies' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                          <i className="fa-solid fa-tags mr-2"></i> Job Taxonomies
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

                      {activeTab === 'cms' && (
                          <div className="animate-in fade-in slide-in-from-bottom-2 relative z-10">
                              <h3 className="font-heading font-bold text-xl text-darkBlue mb-6">Legal Content Management</h3>
                              
                              <form onSubmit={handleCmsUpdate} className="space-y-6 max-w-4xl">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Page to Edit</label>
                                      <select 
                                        value={cmsSlug} 
                                        onChange={e => {
                                            setCmsSlug(e.target.value);
                                            setCmsTitle(e.target.options[e.target.selectedIndex].text);
                                        }}
                                        className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                      >
                                          <option value="privacy-policy">Privacy Policy</option>
                                          <option value="terms-of-service">Terms of Service</option>
                                          <option value="cookie-policy">Cookie Policy</option>
                                          <option value="gdpr-policy">GDPR Policy</option>
                                      </select>
                                  </div>
                                  
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Page Content (Markdown / Text)</label>
                                      <textarea 
                                          rows={20}
                                          value={cmsContent}
                                          onChange={e => setCmsContent(e.target.value)}
                                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                                          placeholder="Enter page content here..."
                                      />
                                  </div>

                                  <div className="flex items-center gap-4 pt-4">
                                      <button type="submit" className="px-8 py-3 bg-primary text-white font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                                          <i className="fa-solid fa-save"></i> Save Content
                                      </button>
                                      {cmsMsg && <span className={`text-xs font-bold ${cmsMsg.includes('Error') || cmsMsg.includes('failed') ? 'text-red-500' : 'text-green-600'} animate-pulse`}>{cmsMsg}</span>}
                                  </div>
                              </form>
                          </div>
                      )}
                      {activeTab === 'homepage' && (
                          <div className="animate-in fade-in slide-in-from-bottom-2 relative z-10">
                              <h3 className="font-heading font-bold text-xl text-darkBlue mb-6">Homepage Content Management</h3>
                              
                              <form onSubmit={handleHomeUpdate} className="space-y-6 max-w-4xl">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hero Text</label>
                                      <input 
                                          type="text"
                                          value={homeConfig.home_hero_text}
                                          onChange={e => setHomeConfig({...homeConfig, home_hero_text: e.target.value})}
                                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hero Highlight</label>
                                      <input 
                                          type="text"
                                          value={homeConfig.home_hero_highlight}
                                          onChange={e => setHomeConfig({...homeConfig, home_hero_highlight: e.target.value})}
                                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidate Journey Text</label>
                                      <textarea 
                                          rows={3}
                                          value={homeConfig.home_journey_text}
                                          onChange={e => setHomeConfig({...homeConfig, home_journey_text: e.target.value})}
                                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fraud Warning Text</label>
                                      <textarea 
                                          rows={4}
                                          value={homeConfig.home_fraud_warning}
                                          onChange={e => setHomeConfig({...homeConfig, home_fraud_warning: e.target.value})}
                                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                                      />
                                  </div>

                                  <div className="flex items-center gap-4 pt-4">
                                      <button type="submit" className="px-8 py-3 bg-primary text-white font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                                          <i className="fa-solid fa-save"></i> Save Content
                                      </button>
                                      {homeMsg && <span className={`text-xs font-bold ${homeMsg.includes('Error') || homeMsg.includes('failed') ? 'text-red-500' : 'text-green-600'} animate-pulse`}>{homeMsg}</span>}
                                  </div>
                              </form>
                          </div>
                      )}
                      
                      {activeTab === 'taxonomies' && (
                          <div className="animate-in fade-in slide-in-from-bottom-2 relative z-10">
                              <h3 className="font-heading font-bold text-xl text-darkBlue mb-6">Job Taxonomies</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {/* Categories Panel */}
                                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                      <h4 className="font-bold text-darkBlue mb-4 flex items-center gap-2">
                                          <i className="fa-solid fa-layer-group text-primary"></i> Job Categories
                                      </h4>
                                      <form onSubmit={(e) => handleAddTaxonomy('category', e)} className="flex gap-2 mb-4">
                                          <input 
                                              type="text" 
                                              required
                                              value={newCatName}
                                              onChange={e => setNewCatName(e.target.value)}
                                              placeholder="e.g. Blue Collar"
                                              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                          />
                                          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Add</button>
                                      </form>
                                      <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                          {categories.length === 0 && <li className="text-xs text-slate-400">No categories found.</li>}
                                          {categories.map(cat => (
                                              <li key={cat.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-center shadow-sm">
                                                  <span className="text-sm font-medium text-slate-800">{cat.name}</span>
                                                  <button onClick={() => handleDeleteTaxonomy('category', cat.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                                                      <i className="fa-solid fa-trash text-xs"></i>
                                                  </button>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>

                                  {/* Countries Panel */}
                                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                      <h4 className="font-bold text-darkBlue mb-4 flex items-center gap-2">
                                          <i className="fa-solid fa-earth-europe text-primary"></i> Job Countries
                                      </h4>
                                      <form onSubmit={(e) => handleAddTaxonomy('country', e)} className="flex gap-2 mb-4">
                                          <input 
                                              type="text" 
                                              required
                                              value={newCountryName}
                                              onChange={e => setNewCountryName(e.target.value)}
                                              placeholder="Country (e.g. Poland)"
                                              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                          />
                                          <input 
                                              type="text" 
                                              value={newCountryRegion}
                                              onChange={e => setNewCountryRegion(e.target.value)}
                                              placeholder="Region (optional)"
                                              className="w-24 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                          />
                                          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Add</button>
                                      </form>
                                      <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                          {countries.length === 0 && <li className="text-xs text-slate-400">No countries found.</li>}
                                          {countries.map(country => (
                                              <li key={country.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-center shadow-sm">
                                                  <div>
                                                      <span className="text-sm font-medium text-slate-800 block">{country.name}</span>
                                                      {country.region && <span className="text-xs text-slate-400">Region: {country.region}</span>}
                                                  </div>
                                                  <button onClick={() => handleDeleteTaxonomy('country', country.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                                                      <i className="fa-solid fa-trash text-xs"></i>
                                                  </button>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>
                              
                              {taxMsg && (
                                  <div className="mt-4 p-3 bg-blue-50 text-primary font-bold text-sm rounded-lg text-center animate-pulse border border-blue-100">
                                      {taxMsg}
                                  </div>
                              )}
                          </div>
                      )}
                  </div>

              </div>
          </div>
      </main>
    </>
  );
}
