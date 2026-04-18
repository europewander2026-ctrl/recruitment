"use client"
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [btnText, setBtnText] = useState('Authenticate');
  const [error, setError] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Interactive Network Background
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: -1000, y: -1000 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          this.x -= dx * 0.02;
          this.y -= dy * 0.02;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(13, 95, 183, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let particles: Particle[] = [];
    const initParticles = () => {
      particles = [];
      const count = (width * height) / 15000;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    const connect = () => {
      if (!ctx) return;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.strokeStyle = `rgba(13, 95, 183, ${1 - distance / 120})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    let animationFrameId: number;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsScanning(true);
    setBtnText("Verifying Biometrics...");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Identity Verification Failed');
      }

      // Success
      setBtnText("Identity Confirmed");
      setTimeout(() => setAccessGranted(true), 800);
      setTimeout(() => router.push('/dashboard'), 2000);
      
    } catch (err: any) {
      setError(err.message);
      setIsScanning(false);
      setBtnText("Authenticate");
    }
  };

  return (
    <div className="bg-[#000814] h-screen flex items-center justify-center overflow-hidden relative font-sans text-white">
      <Head>
        <title>Admin Portal | ImmiHire</title>
      </Head>

      {/* Network Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full"></canvas>

      {/* Login Interface */}
      <div className="login-card z-10 w-full max-w-[420px] bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_-12px_rgba(13,95,183,0.2)] hover:border-primary/30 transition-all duration-300">
        
        {/* Holographic Decor */}
        <div className="holo-ring absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 border border-dashed border-primary/20 rounded-full pointer-events-none animate-spin-slow -z-10 before:absolute before:-top-[1px] before:left-1/2 before:w-2.5 before:h-2.5 before:bg-primary before:rounded-full before:shadow-[0_0_10px_#0d5fb7]"></div>

        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-full bg-white/5 border border-white/10 mb-4 shadow-[0_0_20px_rgba(13,95,183,0.3)]">
            <img src="https://demo.hmhlabz.com/immihire/wp-content/uploads/immihire-logo.webp" alt="Logo" className="w-12 h-12 object-contain filter brightness-200" />
          </div>
          <h1 className="font-heading font-bold text-2xl tracking-tight">Admin Portal</h1>
          <p className="text-gray-400 text-xs font-mono mt-2 uppercase tracking-widest">Restricted Access // Level 5</p>
        </div>

        <form onSubmit={handleLogin}>
          
          <div className="admin-input-group relative mb-6">
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="admin-input w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-4 pl-12 text-sm focus:outline-none focus:bg-primary/10 focus:border-primary focus:shadow-[0_0_15px_rgba(13,95,183,0.2)] transition-all peer" 
              placeholder="Admin ID" 
            />
            <i className="fa-solid fa-user-shield absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 peer-focus:text-primary transition-colors"></i>
          </div>

          <div className="admin-input-group relative mb-6">
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-input w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-4 pl-12 text-sm focus:outline-none focus:bg-primary/10 focus:border-primary focus:shadow-[0_0_15px_rgba(13,95,183,0.2)] transition-all peer" 
              placeholder="Passcode" 
            />
            <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 peer-focus:text-primary transition-colors"></i>
          </div>

          <div className="flex justify-between items-center mb-8 text-xs text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="accent-primary rounded" /> Remember Device
            </label>
            <button onClick={(e) => { e.preventDefault(); router.push('/forgot-password') }} className="hover:text-primary transition-colors">Lost Credentials?</button>
          </div>

          {error && <div className="mb-4 text-red-400 text-xs text-center border border-red-900/50 bg-red-900/20 p-2 rounded">{error}</div>}

          <button 
            type="submit" 
            disabled={isScanning}
            className={`scan-btn relative w-full p-4 font-bold rounded-xl overflow-hidden transition-all flex items-center justify-center gap-2 tracking-widest uppercase text-sm
              ${accessGranted ? 'bg-success shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-primary hover:bg-[#004494] hover:shadow-[0_0_20px_rgba(13,95,183,0.4)]'}
              ${isScanning ? 'scanning' : ''} disabled:cursor-not-allowed`}
          >
            <span>{btnText}</span>
            {isScanning && !accessGranted && <i className="fa-solid fa-circle-notch fa-spin text-lg"></i>}
            {!isScanning && !accessGranted && <i className="fa-solid fa-fingerprint text-lg"></i>}
            {accessGranted && <i className="fa-solid fa-check text-lg"></i>}
            {isScanning && !accessGranted && <div className="scan-line-horizontal absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"></div>}
          </button>
        </form>

        <div className="text-center mt-8 border-t border-white/5 pt-4">
          <p className="text-[0.6rem] text-gray-500 font-mono">
              SYSTEM ID: IMMI-CORE-V2.4 <br/>
              SECURE CONNECTION ESTABLISHED
          </p>
        </div>
      </div>

      {/* Success Access Granted Overlay */}
      <div className={`access-overlay fixed inset-0 bg-primary z-[100] flex items-center justify-center origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.86,0,0.07,1)] ${accessGranted ? 'scale-y-100' : 'scale-y-0'}`}>
        <h1 className={`text-white font-heading font-extrabold text-5xl transition-all duration-500 delay-300 ${accessGranted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
          ACCESS GRANTED
        </h1>
      </div>
    </div>
  );
}
