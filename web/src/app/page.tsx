"use client"
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  country: string;
  salary: string;
  category: string;
  status: string;
}

export default function RecruitmentPage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('uae');
  const [isScanning, setIsScanning] = useState(false);
  const [btnText, setBtnText] = useState('Initialize Transfer');

  // Live Database State
  const [jobData, setJobData] = useState<{ [key: string]: Job[] }>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 1. Fetch DB
    const fetchJobs = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}`);
            const data = await res.json();
            if (data.success) {
                // Group by country natively
                const grouped: { [key: string]: Job[] } = {};
                data.data.forEach((j: Job) => {
                    if (j.status === 'active') {
                        if (!grouped[j.country]) grouped[j.country] = [];
                        grouped[j.country].push(j);
                    }
                });
                
                // Ensure default fallbacks if DB is empty for demo purposes
                if (Object.keys(grouped).length === 0) {
                     grouped['uae'] = [{ id: 'x1', title: 'White Collar Prof.', country: 'uae', salary: 'AED 15,000', category: 'White Collar', status: 'active' }];
                     grouped['portugal'] = [{ id: 'x2', title: 'Factory Worker', country: 'portugal', salary: '€2,500', category: 'Blue Collar', status: 'active' }];
                     grouped['germany'] = [{ id: 'x3', title: 'Logistics', country: 'germany', salary: '€3,000', category: 'Blue Collar', status: 'active' }];
                }
                setJobData(grouped);
                const activeRegions = Object.keys(grouped);
                if (activeRegions.length > 0 && !activeRegions.includes(selectedCountry)) {
                    setSelectedCountry(activeRegions[0]);
                }
            }
        } catch (e) { console.error("Database fetch failed", e); }
    };
    fetchJobs();

    // 2. Scroll Animation Setup
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) reveals[i].classList.add("active");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Canvas Node Network Engine - 3D Holographic Globe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const GLOBE_RADIUS = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Generate 3D dots for sphere wireframe
    let globeDots: {x:number, y:number, z:number}[] = [];
    const points = 400;
    for (let i=0; i<points; i++) {
        const phi = Math.acos(-1 + (2 * i) / points);
        const theta = Math.sqrt(points * Math.PI) * phi;
        globeDots.push({
            x: GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi),
            y: GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi),
            z: GLOBE_RADIUS * Math.cos(phi)
        });
    }

    // focalNodes with approx Lat/Lon mapped to Cartesian coordinates
    const focalLatLon: { [key: string]: { lat: number, lon: number, label: string } } = {
        'portugal': { lat: 39, lon: -8, label: 'Portugal' },
        'germany': { lat: 51, lon: 10, label: 'Germany' },
        'uae': { lat: 25, lon: 55, label: 'UAE' },
        'denmark': { lat: 56, lon: 10, label: 'Denmark' },
        'hungary': { lat: 47, lon: 19, label: 'Hungary' }
    };
    
    const latLonTo3D = (lat: number, lon: number) => {
        const latRad = lat * (Math.PI / 180);
        const lonRad = -lon * (Math.PI / 180);
        return {
            x: GLOBE_RADIUS * Math.cos(latRad) * Math.sin(lonRad),
            y: -GLOBE_RADIUS * Math.sin(latRad),
            z: GLOBE_RADIUS * Math.cos(latRad) * Math.cos(lonRad)
        };
    };

    let rotation = 0;
    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };
    let projectedFocalNodes: { [key: string]: { x2d: number, y2d: number, z: number, label: string } } = {};

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseClick = () => {
        let closestKey = '';
        let minDist = 40;
        Object.entries(projectedFocalNodes).forEach(([key, pNode]) => {
            if (pNode.z > 0 && jobData[key]) { // Only click front nodes
                const dist = Math.hypot(pNode.x2d - mouse.x, pNode.y2d - mouse.y);
                if (dist < minDist) {
                    minDist = dist;
                    closestKey = key;
                }
            }
        });
        if (closestKey) setSelectedCountry(closestKey);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    const project3D = (x: number, y: number, z: number) => {
        // Rotate Y (Spin)
        const rotX = x * Math.cos(rotation) - z * Math.sin(rotation);
        const rotZ = z * Math.cos(rotation) + x * Math.sin(rotation);
        
        // Tilt X down for perspective
        const tiltX = 0.4;
        const finalY = y * Math.cos(tiltX) - rotZ * Math.sin(tiltX);
        const finalZ = rotZ * Math.cos(tiltX) + y * Math.sin(tiltX);

        const fov = 1000;
        const scale = fov / (fov + finalZ);
        
        // Offset Globe to the left side explicitly for UI balance
        return {
           x2d: canvas.width * 0.35 + rotX * scale,
           y2d: canvas.height * 0.5 + finalY * scale,
           scale, z: finalZ
        };
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Clear and set dark background for contrast
        ctx.fillStyle = '#000814';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rotation += 0.002;
        
        // 1. Draw Globe Base Points with larger radius and brighter opacity
        globeDots.forEach((dot) => {
            const p = project3D(dot.x, dot.y, dot.z);
            if (p.z > 0) {
                ctx.beginPath();
                ctx.arc(p.x2d, p.y2d, 2.5 * p.scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(13, 95, 183, ${Math.min(1, 0.4 + p.z / GLOBE_RADIUS)})`;
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(p.x2d, p.y2d, 1.5 * p.scale, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(13, 95, 183, 0.08)';
                ctx.fill();
            }
        });

        // 2. Draw Database Focal Nodes (rest unchanged)
        Object.entries(focalLatLon).forEach(([countryKey, data]) => {
            const pos3D = latLonTo3D(data.lat, data.lon);
            const p = project3D(pos3D.x, pos3D.y, pos3D.z);
            
            projectedFocalNodes[countryKey] = { x2d: p.x2d, y2d: p.y2d, z: p.z, label: data.label };

            if (!jobData[countryKey] || p.z < -GLOBE_RADIUS * 0.1) return; // Hide if on extreme back or no jobs

            const isActive = selectedCountry === countryKey;
            const isHovered = Math.hypot(p.x2d - mouse.x, p.y2d - mouse.y) < 40;

            // Draw Connection line to true center
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.35, canvas.height * 0.5);
            ctx.lineTo(p.x2d, p.y2d);
            ctx.strokeStyle = isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(13, 95, 183, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Core
            ctx.beginPath();
            ctx.arc(p.x2d, p.y2d, isActive ? 6 * p.scale : 3 * p.scale, 0, Math.PI * 2);
            ctx.fillStyle = isActive ? '#10b981' : (isHovered ? '#0d5fb7' : '#ffffff');
            ctx.fill();
            
            // Pulse Ring
            ctx.beginPath();
            ctx.arc(p.x2d, p.y2d, (isActive ? 15 + Math.sin(Date.now() / 200)*4 : 8) * p.scale, 0, Math.PI * 2);
            ctx.strokeStyle = isActive ? 'rgba(16, 185, 129, 0.8)' : 'rgba(13, 95, 183, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            if ((isActive || isHovered) && p.z > -GLOBE_RADIUS * 0.5) {
                ctx.font = 'bold 12px Space Mono';
                ctx.fillStyle = '#fff';
                ctx.fillText(data.label.toUpperCase(), p.x2d + 15, p.y2d - 10);
                
                ctx.beginPath();
                ctx.moveTo(p.x2d + 10, p.y2d - 5);
                ctx.lineTo(p.x2d + Math.max(50, ctx.measureText(data.label.toUpperCase()).width + 20), p.y2d - 5);
                ctx.strokeStyle = isActive ? '#10b981' : '#0d5fb7';
                ctx.stroke();
            }
        });

        animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
        cancelAnimationFrame(animationFrameId);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleMouseClick);
    };
  }, [jobData, selectedCountry]);

  const submitApp = () => {
    setIsScanning(true);
    setBtnText("Scanning Biometrics...");
    setTimeout(() => {
        alert("Identity Verified. Application Transmitted.");
        setBtnText("Initialize Transfer");
        setIsScanning(false);
    }, 1500);
  };

  const isUae = selectedCountry === 'uae';

  return (
    <div className="text-gray-800 bg-[#f8f9fa]">
      {/* Header */}
      <header className={`fixed z-50 pill-header py-3 px-8 flex justify-between items-center ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="flex items-center gap-2 group">
          <img src="https://demo.hmhlabz.com/immihire/wp-content/uploads/immihire-logo.webp" alt="Logo" className="h-10 w-auto object-contain" />
          <span className="font-heading font-bold text-xl text-black tracking-tight">Immi<span className="text-primary">Hire</span></span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-[0.8rem] font-bold text-gray-700 tracking-widest uppercase">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <div className="nav-item group cursor-pointer">
              <span className="hover:text-primary transition-colors flex items-center gap-1">Services <i className="fa-solid fa-chevron-down text-[0.6rem]"></i></span>
          </div>
          <Link href="/login" className="text-primary transition-colors ml-4 bg-primary/10 px-4 py-2 rounded-full">Admin Login</Link>
        </nav>
      </header>

      {/* Holographic Matrix with Live Interactive Canvas Node Network */}
      <section className="matrix-section pt-20 relative overflow-hidden bg-[#000814]" style={{ height: '100vh', minHeight: '800px' }}>
        <canvas ref={canvasRef} className="absolute inset-0 z-0 cursor-crosshair"></canvas>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center pt-24 h-full pointer-events-none">
            <div className="text-center mb-12 reveal active">
                <div className="inline-block px-3 py-1 rounded-full border border-green-500/50 bg-green-900/30 text-green-400 font-mono text-xs uppercase tracking-widest mb-4 backdrop-blur-sm animate-pulse">
                    ● Live Database Telemetry Active
                </div>
                <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-2 drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]">
                    Targeted Deployments
                </h1>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">
                    Interact directly with the physical network nodes below to triangulate available positions sourced directly from our live server grid.
                </p>
            </div>

            {/* Dynamic Job Cards Display mapped from database focal selections */}
            <div className="relative w-full perspective-container flex justify-center mt-auto pb-20 items-end gap-12 flex-wrap pointer-events-auto">
                {Object.keys(jobData).length === 0 ? (
                     <div className="text-white font-mono animate-pulse">Connecting to Database...</div>
                ) : (
                    <div className={`job-card-3d relative w-[350px] shadow-[0_0_30px_rgba(16,185,129,0.2)] border-green-500 transform transition-all duration-700 hover:scale-105 bg-black/60 backdrop-blur-xl`}>
                        <div className="absolute top-2 right-4 text-green-500 font-mono text-xs animate-pulse opacity-70">DATA LINK ESTABLISHED</div>
                        <h3 className="uppercase text-3xl font-heading mb-2">{selectedCountry}</h3>
                        <p className="text-sm font-mono text-green-400 mb-6 border-b border-white/10 pb-4 tracking-widest">REAL-TIME POSITIONS IN QUEUE</p>
                        
                        <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2 mb-6">
                            {jobData[selectedCountry] ? jobData[selectedCountry].slice(0, 3).map(job => (
                                <div key={job.id} className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-green-500/50 transition-colors cursor-default">
                                    <h4 className="text-white font-bold text-sm tracking-wide">{job.title}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs font-mono text-green-300">{job.salary || 'Negotiable'}</span>
                                        <span className="text-[0.6rem] uppercase tracking-widest text-slate-400 bg-white/5 px-2 py-0.5 rounded">{job.category}</span>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-slate-500">No active positions available for synchronization.</p>}
                            {jobData[selectedCountry] && jobData[selectedCountry].length > 3 && (
                                <div className="text-center pt-2 border-t border-white/10 mt-2">
                                    <span className="text-[0.65rem] text-slate-400 font-mono uppercase tracking-widest">+ {jobData[selectedCountry].length - 3} MORE POSITIONS AVAILABLE IN PORTAL</span>
                                </div>
                            )}
                        </div>

                        <button onClick={() => document.getElementById('application-portal')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-black font-bold font-mono text-xs uppercase border border-green-500 transition-all flex justify-center items-center gap-2">
                            <i className="fa-solid fa-satellite-dish"></i> Execute Application
                        </button>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Quantum Application Portal */}
      <section id="application-portal" className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
              <div className="portal-container reveal">
                  <div className={`portal-header`} style={{ background: isUae ? 'linear-gradient(135deg, #000814 0%, #0d5fb7 100%)' : 'linear-gradient(135deg, #000814 0%, #10b981 100%)' }}>
                      <div className="scan-line"></div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                          <div>
                              <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                                  <h2 className="font-heading font-bold text-2xl tracking-tight">Application Terminal</h2>
                              </div>
                              <p className="text-white/60 text-xs mt-2 font-mono uppercase tracking-widest">{isUae ? 'UAE RECRUITMENT CHANNEL ACTIVE' : 'EUROPEAN WORK PERMIT PROTOCOL'}</p>
                          </div>
                      </div>
                  </div>

                  <div className="p-8 md:p-12 bg-white">
                      <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                          <div className="group relative">
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Selected Destination Node</label>
                              <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-6 py-4 font-bold text-darkBlue uppercase flex justify-between items-center shadow-inner">
                                  {selectedCountry}
                                  <i className="fa-solid fa-satellite text-primary drop-shadow-md"></i>
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name *</label>
                                  <input type="text" className="w-full bg-white border-b-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-primary transition-all font-medium" placeholder="Enter Name" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Identity Contact *</label>
                                  <input type="tel" className="w-full bg-white border-b-2 border-slate-200 px-4 py-3 focus:outline-none focus:border-primary transition-all font-medium" placeholder="+971..." />
                              </div>
                          </div>

                          <button type="button" onClick={submitApp} className="w-full py-5 bg-darkBlue text-white font-bold rounded-xl hover:bg-black transition-all shadow-xl flex justify-center items-center gap-4 relative overflow-hidden">
                              <span className="tracking-widest uppercase text-sm">{btnText}</span>
                              <i className={`fa-solid fa-fingerprint text-green-400 ${isScanning ? 'animate-pulse' : ''}`}></i>
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000814] text-white pt-24 pb-12 mt-10 relative z-20 overflow-hidden rounded-t-[3rem]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
          <div className="container mx-auto px-6 relative z-10">
              <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
                  <div className="md:w-1/2">
                      <h2 className="font-heading font-bold text-5xl md:text-7xl mb-6 tracking-tight">Ready to <span className="text-primary">Fly?</span></h2>
                      <button className="px-8 py-4 bg-white text-darkBlue font-bold rounded-full text-lg hover:bg-slate-200">Book Consultation</button>
                  </div>
              </div>
              <div className="border-t border-slate-800 pt-8 text-sm text-slate-500">
                  <p>&copy; 2026 Eurovanta Talent Consultants.</p>
              </div>
          </div>
      </footer>
    </div>
  );
}
