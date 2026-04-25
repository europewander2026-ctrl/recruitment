"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Job {
  id: string;
  title: string;
  country: string;
  salary: string;
  category: string;
  description: string;
  status: boolean;
}

interface ApplicationNode {
  id: string;
  name: string;
  role: string;
  country: string;
  status: 'received' | 'reviewing' | 'shortlisted';
  exp: string;
  visa: string;
  file: string;
  timeAgg: string;
}

// ----------------------------------------------------------------------
// Sortable Node Component (Kanban Card)
// ----------------------------------------------------------------------
function SortableAppCard({ app }: { app: ApplicationNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app.id, data: { status: app.status } });
  const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.4 : 1,
  };

  return (
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        {...listeners} 
        className={`bg-white rounded-xl p-4 mb-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)] cursor-grab active:cursor-grabbing border-l-4 group relative ${getCountryAccent(app.country)}`}
      >
          <div className="flex justify-between items-start mb-2">
              <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded border ${getCountryPill(app.country)}`}>
                  {app.country.toUpperCase()}
              </span>
              <span className="text-[0.6rem] text-slate-400">{app.timeAgg}</span>
          </div>
          <h5 className="font-bold text-sm text-slate-800">{app.name}</h5>
          <p className="text-xs text-slate-500">{app.role}</p>

          {/* X-Ray Hover Lens */}
          <div className="absolute hidden group-hover:block z-[100] w-[280px] bg-slate-900/95 backdrop-blur-md border border-white/10 border-l-4 border-l-primary rounded-xl p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]" style={{ left: '105%', top: 0 }}>
              <div className="flex items-center gap-2 mb-2 border-b border-white/20 pb-2">
                  <i className="fa-solid fa-id-card text-blue-400"></i>
                  <span className="font-mono text-xs uppercase text-blue-300">Profile Scan</span>
              </div>
              <div className="space-y-2 text-xs">
                  <p><span className="text-slate-400">Exp:</span> {app.exp}</p>
                  <p><span className="text-slate-400">Visa:</span> {app.visa}</p>
                  <div className="flex items-center gap-2 mt-2">
                      <i className="fa-solid fa-file-pdf text-red-400"></i>
                      <span className="underline cursor-pointer hover:text-white">{app.file}</span>
                  </div>
              </div>
          </div>
      </div>
  );
}

// Helpers
const getCountryAccent = (c: string) => c === 'uae' ? 'border-l-primary' : 'border-l-green-500';
const getCountryPill = (c: string) => c === 'uae' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100';

export default function RecruitmentOpsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobFilter, setJobFilter] = useState('all');
  
  // Kanban State
  const [activeId, setActiveId] = useState<string | null>(null);
  const [apps, setApps] = useState<ApplicationNode[]>([
      { id: 'app-1', name: 'John Doe', role: 'Sales Manager', country: 'uae', status: 'received', exp: '5 Years', visa: 'Visit', file: 'resume_john.pdf', timeAgg: '2h ago' },
      { id: 'app-2', name: 'Maria Silva', role: 'Factory Worker', country: 'portugal', status: 'received', exp: '3 Years', visa: 'Schengen C', file: 'maria_cv.pdf', timeAgg: '5h ago' },
      { id: 'app-3', name: 'Sarah Jones', role: 'Nurse', country: 'uae', status: 'reviewing', exp: '6 Years', visa: 'None', file: 'sjones_dha.pdf', timeAgg: '3d ago' },
  ]);

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const mapped = data.data.map((app: any) => ({
            id: app.id,
            name: app.name,
            role: app.role,
            country: app.location ? app.location.split(',').pop()?.trim().toLowerCase() || 'uae' : 'uae',
            status: app.status === 'pending' ? 'received' : app.status,
            exp: app.exp || 'N/A',
            visa: app.visaStatus || 'None',
            file: app.resumeUrl || 'N/A',
            timeAgg: 'Just now'
          }));
          setApps(mapped);
        }
      })
      .catch(err => console.error('Error fetching applications', err));

    // Fetch Jobs
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setJobs(data.data.map((j: any) => ({ ...j, status: j.status === 'active' })));
        }
      })
      .catch(err => console.error('Error fetching jobs', err));
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState<Partial<Job>>({ country: 'portugal', category: 'Blue Collar', status: true });

  // Notification State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const markAsRead = async (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      try {
          await fetch('/api/notifications/read', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
          });
      } catch (err) {
          console.error(err);
      }
  };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
      fetch('/api/notifications')
          .then(res => res.json())
          .then(data => {
              if (data.success && data.data) {
                  setNotifications(data.data.map((n: any) => ({ 
                      ...n, 
                      createdAt: new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) 
                  })));
              }
          })
          .catch(err => console.error('Error fetching notifications', err));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
      setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
      const { active, over } = event;
      if (!over) {
          setActiveId(null);
          return;
      }

      const activeId = active.id;
      const overId = over.id;

      let newStatus: string | null = null;
      const prevApps = [...apps];

      // Simplistic column drop mapping (treating the Sortable context container IDs as columns)
      if (['received', 'reviewing', 'shortlisted'].includes(overId)) {
          newStatus = overId;
          setApps((prev) => prev.map(a => a.id === activeId ? { ...a, status: overId as ApplicationNode['status'] } : a));
      } else {
        // Rearranging inside same/other column over another item
        const activeItem = apps.find(a => a.id === activeId);
        const overItem = apps.find(a => a.id === overId);
        if(activeItem && overItem) {
             newStatus = overItem.status;
             setApps((prev) => {
                const oldIndex = prev.findIndex(item => item.id === activeId);
                const newIndex = prev.findIndex(item => item.id === overId);
                const newCollection = arrayMove(prev, oldIndex, newIndex);
                // Also update status if moved to new col based on the item we dropped over
                return newCollection.map(a => a.id === activeId ? { ...a, status: overItem.status } : a);
             });
        }
      }
      
      setActiveId(null);
      
      if (newStatus) {
         try {
             const res = await fetch('/api/applications/status', {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ id: activeId, status: newStatus })
             });
             const data = await res.json();
             if (!data.success) throw new Error('API Error');
         } catch (e) {
             console.error('Failed to update status', e);
             setApps(prevApps); // revert optimistic update
         }
      }
  };

  const filteredJobs = jobFilter === 'all' ? jobs : jobs.filter(j => j.country === jobFilter);

  const openModal = (id?: string) => {
      if (id) {
          const job = jobs.find(j => j.id === id);
          if (job) setModalForm(job);
      } else {
          setModalForm({ title: '', country: 'portugal', salary: '', category: 'Blue Collar', description: '', status: true });
      }
      setIsModalOpen(true);
  };

  const saveJob = async () => {
      const isEdit = !!modalForm.id;
      const method = isEdit ? 'PUT' : 'POST';
      
      try {
          const res = await fetch('/api/jobs', {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(modalForm)
          });
          const data = await res.json();
          if (data.success) {
              const savedJob = { ...data.data, status: data.data.status === 'active' };
              if (isEdit) {
                  setJobs(jobs.map(j => j.id === savedJob.id ? savedJob : j));
              } else {
                  setJobs([savedJob, ...jobs]);
              }
              setIsModalOpen(false);
          }
      } catch (err) {
          console.error('Failed to save job', err);
      }
  };

  const deleteJob = async (id: string) => {
      try {
          const res = await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
              setJobs(jobs.filter(j => j.id !== id));
              setIsModalOpen(false);
          }
      } catch (err) {
          console.error('Failed to delete job', err);
      }
  };

  const activeItem = apps.find(x => x.id === activeId);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-700 overflow-hidden">
      <Head><title>Recruitment Ops | Eurovanta Talent Admin</title></Head>

      {/* Sidebar */}
      <aside className="w-64 hidden lg:flex flex-col z-20 bg-white border-r border-slate-200">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
              <Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} className="object-contain" />
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
              <Link href="/dashboard" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-grid-2"></i> Dashboard</Link>
              <Link href="/applications" className="nav-link text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl transition-colors"><i className="fa-solid fa-users"></i> Applications</Link>
              <Link href="/recruitment" className="nav-link text-primary bg-blue-50 font-medium flex items-center gap-3 p-3 rounded-xl border-l-4 border-primary"><i className="fa-solid fa-briefcase"></i> Recruitment</Link>
              {/* Omitted rest of sidebar links for conciseness */}
          </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
              <h2 className="font-heading font-bold text-2xl text-darkBlue">Recruitment Ops</h2>
              <div className="flex items-center gap-6">
                  {/* Notification Bell Hub */}
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
                  
                  <button onClick={() => openModal()} className="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                      <i className="fa-solid fa-plus"></i> Add New Position
                  </button>
              </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between border-l-4 border-l-blue-500 shadow-sm">
                      <div>
                          <p className="text-slate-500 text-xs font-bold uppercase">Total Candidates</p>
                          <h3 className="text-3xl font-bold text-darkBlue mt-1">342</h3>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 text-primary rounded-lg flex items-center justify-center"><i className="fa-solid fa-users"></i></div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between border-l-4 border-l-green-500 shadow-sm">
                      <div>
                          <p className="text-slate-500 text-xs font-bold uppercase">Active Listings</p>
                          <h3 className="text-3xl font-bold text-darkBlue mt-1">{jobs.filter(j=>j.status).length}</h3>
                      </div>
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-briefcase"></i></div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between border-l-4 border-l-yellow-500 shadow-sm">
                      <div>
                          <p className="text-slate-500 text-xs font-bold uppercase">Pending Review</p>
                          <h3 className="text-3xl font-bold text-darkBlue mt-1">{apps.filter(x => x.status === 'received').length}</h3>
                      </div>
                      <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-hourglass-half"></i></div>
                  </div>
              </div>

              {/* Kanban Board */}
              <div className="mb-8">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="font-heading font-bold text-xl text-darkBlue">Applicant Pipeline</h3>
                          <div className="flex gap-2">
                              <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-primary rounded border border-blue-200">UAE</span>
                              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded border border-green-200">Global</span>
                          </div>
                      </div>

                      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Columns Mapping */}
                              {['received', 'reviewing', 'shortlisted'].map(colId => {
                                  const colApps = apps.filter(a => a.status === colId);
                                  return (
                                      <div key={colId} className="bg-slate-100 rounded-2xl p-4 min-h-[400px] flex flex-col">
                                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex justify-between">
                                              {colId}
                                              <span className="bg-white border border-slate-200 text-slate-600 px-2 rounded-full shadow-sm">{colApps.length}</span>
                                          </h4>
                                          <SortableContext id={colId} items={colApps.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                              <div className="flex-1">
                                                  {colApps.map(app => (
                                                      <SortableAppCard key={app.id} app={app} />
                                                  ))}
                                              </div>
                                          </SortableContext>
                                      </div>
                                  )
                              })}
                          </div>
                          
                          <DragOverlay>
                             {activeItem ? <SortableAppCard app={activeItem} /> : null}
                          </DragOverlay>
                      </DndContext>
                  </div>
              </div>

              {/* Global Positions Inventory */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-heading font-bold text-lg text-darkBlue">Global Positions Inventory</h3>
                      <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-200">Live DB</span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                      {['all', 'portugal', 'denmark', 'germany', 'norway', 'hungary', 'uae'].map(country => (
                          <button 
                            key={country}
                            onClick={() => setJobFilter(country)}
                            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all border ${jobFilter === country ? 'bg-primary text-white border-primary shadow-md' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100'}`}
                          >
                              {country}
                          </button>
                      ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredJobs.length === 0 && <p className="col-span-full text-center py-8 text-slate-400">No active positions in this territory.</p>}
                      {filteredJobs.map(job => (
                          <div key={job.id} className="group bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${job.country === 'uae' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                          {job.country}
                                      </span>
                                      {job.status ? <span className="text-[0.6rem] bg-green-50 text-green-600 px-1 rounded border border-green-100">● Active</span> : <span className="text-[0.6rem] bg-slate-100 text-slate-500 px-1 rounded border border-slate-200">Paused</span>}
                                  </div>
                                  <h4 className="font-bold text-sm text-darkBlue group-hover:text-primary transition-colors">{job.title}</h4>
                                  <p className="text-xs text-slate-400 mt-1">{job.category} • {job.salary}</p>
                              </div>
                              <button onClick={() => openModal(job.id)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                                  <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </main>

      {/* Simplified React Modal for Positions */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
              <div className="bg-white w-[95%] max-w-[600px] rounded-2xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.25)] animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-heading font-bold text-xl text-darkBlue">{modalForm.id ? 'Edit Position' : 'Add New Position'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
                  </div>
                  <form onSubmit={e => { e.preventDefault(); saveJob(); }}>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Job Title *</label>
                              <input required value={modalForm.title} onChange={e=>setModalForm({...modalForm, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Country *</label>
                              <select value={modalForm.country} onChange={e=>setModalForm({...modalForm, country: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm appearance-none">
                                  <option value="portugal">Portugal</option>
                                  <option value="denmark">Denmark</option>
                                  <option value="germany">Germany</option>
                                  <option value="norway">Norway</option>
                                  <option value="hungary">Hungary</option>
                                  <option value="uae">UAE</option>
                              </select>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Salary</label>
                              <input value={modalForm.salary} onChange={e=>setModalForm({...modalForm, salary: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                              <select value={modalForm.category} onChange={e=>setModalForm({...modalForm, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-sm appearance-none">
                                  <option>Blue Collar</option>
                                  <option>White Collar</option>
                                  <option>Skilled Trade</option>
                              </select>
                          </div>
                      </div>

                      <div className="mb-6 flex gap-4">
                          <label className="flex items-center gap-2 flex-1 border border-slate-200 p-2 rounded-lg cursor-pointer">
                              <input type="radio" name="status" checked={modalForm.status} onChange={() => setModalForm({...modalForm, status: true})} /> Active
                          </label>
                          <label className="flex items-center gap-2 flex-1 border border-slate-200 p-2 rounded-lg cursor-pointer">
                              <input type="radio" name="status" checked={!modalForm.status} onChange={() => setModalForm({...modalForm, status: false})} /> Paused
                          </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                          {modalForm.id && (
                              <button type="button" onClick={() => deleteJob(modalForm.id as string)} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 mr-auto">Delete</button>
                          )}
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-300">Cancel</button>
                          <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-blue-700 rounded-lg shadow-lg">Save Changes</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
