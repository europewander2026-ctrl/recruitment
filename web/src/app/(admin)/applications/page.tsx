"use client"
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Applicant {
  id: string;
  name: string;
  role: string;
  location: string;
  photo: string;
  exp: string;
  edu: string;
  industry: string;
  budget: string;
  score: number;
  skills: number[];
  timeline: { date: string, title: string, desc?: string, status: 'completed' | 'pending' }[];
}

// Fallback/Mock data matching the design file for immediate preview
const mockApplicants: Applicant[] = [
  {
    id: "1", name: 'John Doe', role: 'Sales Manager', location: 'Dubai, UAE',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    exp: '8 Years', edu: "Master's Degree", industry: 'Sales', budget: 'N/A', score: 92,
    skills: [90, 85, 70, 95, 80],
    timeline: [
      { date: 'Oct 20, 2025 • 10:00 AM', title: 'Application Received', desc: 'Submitted via Online Portal.', status: 'completed' },
      { date: 'Oct 21, 2025 • 09:30 AM', title: 'Initial Review', desc: 'Passed basic eligibility check.', status: 'completed' },
      { date: 'Pending', title: 'Consultant Assigned', status: 'pending' },
    ]
  },
  {
    id: "2", name: 'Maria Silva', role: 'Factory Worker', location: 'Lisbon, Portugal',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    exp: '3 Years', edu: 'High School', industry: 'Manufacturing', budget: '€5k - €10k', score: 75,
    skills: [60, 40, 50, 80, 40],
    timeline: [
      { date: 'Oct 15, 2025 • 10:00 AM', title: 'Application Received', desc: 'Submitted via Online Portal.', status: 'completed' },
      { date: 'Pending', title: 'Initial Review', status: 'pending' },
    ]
  },
  {
    id: "3", name: 'Ahmed Khan', role: 'Logistics Driver', location: 'Lahore, Pakistan',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    exp: '5 Years', edu: 'Diploma', industry: 'Logistics', budget: '€3k - €5k', score: 68,
    skills: [50, 60, 40, 90, 50],
    timeline: [
      { date: 'Oct 12, 2025 • 10:00 AM', title: 'Application Received', desc: 'Submitted via Online Portal.', status: 'completed' },
    ]
  },
  {
      id: "4", name: 'Sarah Jones', role: 'Registered Nurse', location: 'London, UK',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
      exp: '6 Years', edu: "Bachelor's", industry: 'Healthcare', budget: 'N/A', score: 95,
      skills: [95, 80, 85, 90, 90],
      timeline: []
  },
];

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<Applicant | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [filter, setFilter] = useState('All Applications');

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

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/applications?status=${filter}`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          // ensure skills and timeline are parsed if they are strings
          const parsedData = data.data.map((app: any) => ({
            ...app,
            skills: typeof app.skills === 'string' ? JSON.parse(app.skills) : (app.skills || []),
            timeline: typeof app.timeline === 'string' ? JSON.parse(app.timeline) : (app.timeline || [])
          }));
          setApplicants(parsedData);
        }
      } catch (err) {
        console.error('Failed to fetch applications', err);
      }
    };
    fetchApplications();
  }, [filter]);

  return (
    <>
<Head><title>Application Center | Eurovanta Talent Admin</title></Head>

      
      

      
      <main className="flex-1 flex flex-col overflow-hidden relative">
          
        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10 sticky top-0">
            <h2 className="font-heading font-bold text-2xl text-darkBlue">Application Center</h2>
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
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-4">
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
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <i className="fa-solid fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                        <select 
                          value={filter}
                          onChange={e => setFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-600 focus:outline-none focus:border-primary transition-all cursor-pointer"
                        >
                            <option>All Applications</option>
                            <option>Pending Review</option>
                            <option>Shortlisted</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">
                        <i className="fa-solid fa-download mr-2"></i> Export CSV
                    </button>
                </div>
            </div>
        </header>

        {/* Split View */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Applicant List */}
          <div className="w-full lg:w-5/12 overflow-y-auto p-6 border-r border-slate-200 bg-white">
            <div className="space-y-2">
              {applicants.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  className={`flex items-center justify-between p-4 border-b border-slate-50 rounded-xl cursor-pointer transition-all ${selectedApp?.id === app.id ? 'bg-blue-50 border-l-4 border-primary shadow-inner' : 'hover:bg-[#f0f9ff] hover:pl-6 hover:border-l-4 hover:border-l-primary'}`}
                >
                  <div className="flex items-center gap-4">
                      <img src={app.photo} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      <div>
                          <h4 className="font-bold text-sm text-darkBlue">{app.name}</h4>
                          <p className="text-xs text-slate-500">{app.role}</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <span className={`text-xs font-bold ${app.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{app.score}% Match</span>
                      <p className="text-[0.6rem] text-slate-400">{app.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Holographic Dossier */}
          <div className="hidden lg:block w-7/12 bg-slate-50 relative">
            
            {!selectedApp ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <i className="fa-regular fa-folder-open text-6xl mb-4 opacity-50"></i>
                  <p className="font-mono text-sm uppercase tracking-widest">Select an applicant to view dossier</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.05)] h-full overflow-y-auto relative perspective-container">
                  
                  {/* Header */}
                  <div className="bg-[#000814] text-white p-8 rounded-br-[40px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-[200px] h-full bg-gradient-to-r from-transparent to-white/5 pointer-events-none"></div>
                      
                      <div className="relative z-10 max-w-[70%]">
                          <div className="flex items-center gap-3 mb-2">
                              <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-widest">ID: #APP-{selectedApp.id.padStart(4, '0')}</span>
                              <span className="bg-green-500/20 text-green-300 border border-green-400/30 px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-widest">● Active</span>
                          </div>
                          <h2 className="font-heading font-bold text-3xl mb-1">{selectedApp.name}</h2>
                          <p className="text-blue-200 text-sm font-mono mb-6">{selectedApp.role} • {selectedApp.location}</p>

                          <div className="flex gap-4">
                              <button className="bg-white text-darkBlue px-6 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors shadow-lg">
                                  <i className="fa-solid fa-phone mr-2"></i> Contact
                              </button>
                              <button className="bg-transparent border border-white/30 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                                  <i className="fa-solid fa-envelope mr-2"></i> Email
                              </button>
                          </div>
                      </div>

                      {/* 3D Card */}
                      <div className="absolute right-5 top-5 w-[140px] h-[180px] bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] transform rotate-y-[-20deg] rotate-x-10 hover:rotate-y-0 hover:rotate-x-0 hover:scale-110 transition-transform duration-500 z-20 border border-white/20 overflow-hidden">
                          <img src={selectedApp.photo} className="w-full h-full object-cover" />
                      </div>
                  </div>

                  <div className="p-8 space-y-8">
                      {/* AI Score */}
                      <div className="flex gap-6 items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                          <div 
                            className="w-[60px] h-[60px] rounded-full flex items-center justify-center relative" 
                            style={{ background: `conic-gradient(#10b981 ${(selectedApp.score / 100) * 360}deg, #e2e8f0 0deg)` }}
                          >
                              <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center font-extrabold text-sm text-slate-700">
                                {selectedApp.score}%
                              </div>
                          </div>
                          <div>
                              <h4 className="font-bold text-darkBlue text-sm">AI Match Probability</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">High match based on age, education, and experience parameters.</p>
                          </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-6">
                          <div className="glass-card">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Professional Data</h4>
                              <div className="space-y-3 text-sm">
                                  <div className="flex justify-between border-b border-slate-100 pb-2">
                                      <span className="text-slate-500">Experience</span>
                                      <span className="font-bold text-darkBlue">{selectedApp.exp}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-100 pb-2">
                                      <span className="text-slate-500">Education</span>
                                      <span className="font-bold text-darkBlue">{selectedApp.edu}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-100 pb-2">
                                      <span className="text-slate-500">Industry</span>
                                      <span className="font-bold text-darkBlue">{selectedApp.industry}</span>
                                  </div>
                                  <div className="flex justify-between pt-1">
                                      <span className="text-slate-500">Budget</span>
                                      <span className="font-bold text-green-600">{selectedApp.budget}</span>
                                  </div>
                              </div>
                          </div>

                          <div className="glass-card flex flex-col justify-between">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Skill Radar</h4>
                              <div className="h-40 w-full relative">
                                  <Radar 
                                    data={{
                                      labels: ['Comm', 'Tech', 'Lead', 'Exp', 'Edu'],
                                      datasets: [{
                                          label: 'Skill Matrix',
                                          data: selectedApp.skills,
                                          fill: true,
                                          backgroundColor: 'rgba(13, 95, 183, 0.2)',
                                          borderColor: '#0d5fb7',
                                          pointBackgroundColor: '#0d5fb7',
                                          pointBorderColor: '#fff',
                                          pointHoverBackgroundColor: '#fff',
                                          pointHoverBorderColor: '#0d5fb7'
                                      }]
                                    }}
                                    options={{
                                      elements: { line: { borderWidth: 2 } },
                                      scales: {
                                          r: {
                                              angleLines: { color: 'rgba(0,0,0,0.1)' },
                                              grid: { color: 'rgba(0,0,0,0.1)' },
                                              pointLabels: { font: { size: 10, family: 'Space Mono' }, color: '#64748b' },
                                              suggestedMin: 0,
                                              suggestedMax: 100,
                                              ticks: { display: false }
                                          }
                                      },
                                      plugins: { legend: { display: false } }
                                    }}
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Timeline */}
                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Application Journey</h4>
                          <div className="pl-2">
                              {selectedApp.timeline.map((step, idx) => (
                                <div key={idx} className={`relative pl-8 pb-8 ${idx !== selectedApp.timeline.length -1 ? 'border-l-2' : ''} ${step.status === 'completed' ? 'border-slate-200' : 'border-transparent'}`}>
                                    <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-[0_0_0_2px_#e2e8f0] ${step.status === 'completed' ? 'bg-successGreen border-white' : 'bg-primary'}`}></div>
                                    <p className="text-xs text-slate-400 mb-1">{step.date}</p>
                                    <h5 className="text-sm font-bold text-darkBlue">{step.title}</h5>
                                    {step.desc && <p className="text-xs text-slate-500 mt-1">{step.desc}</p>}
                                </div>
                              ))}
                          </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4 pt-4">
                          <button className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg shadow-green-200 transition-all text-sm uppercase tracking-wider">
                              Approve & Shortlist
                          </button>
                          <button className="flex-1 py-3 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold rounded-lg transition-all text-sm uppercase tracking-wider">
                              Reject
                          </button>
                      </div>

                  </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
