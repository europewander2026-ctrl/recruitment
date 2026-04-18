"use client"
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [btnText, setBtnText] = useState('Initiate Recovery');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsScanning(true);
    setBtnText("Transmitting Protocol...");

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Recovery Initiation Failed');
      }

      setSuccess("Recovery protocol sent to registered node.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
      setBtnText("Initiate Recovery");
    }
  };

  return (
    <div className="bg-[#000814] h-screen flex items-center justify-center overflow-hidden relative font-sans text-white">
      <Head>
        <title>Credential Recovery | ImmiHire</title>
      </Head>

      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full"></canvas>

      <div className="login-card z-10 w-full max-w-[420px] bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-300">
        
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-full bg-white/5 border border-white/10 mb-4 shadow-[0_0_20px_rgba(13,95,183,0.3)]">
            <i className="fa-solid fa-lock-open text-2xl text-primary drop-shadow-[0_0_10px_#0d5fb7]"></i>
          </div>
          <h1 className="font-heading font-bold text-2xl tracking-tight">Recovery Protocol</h1>
          <p className="text-gray-400 text-xs font-mono mt-2 uppercase tracking-widest">Node Identification Required</p>
        </div>

        <form onSubmit={handleForgot}>
          <div className="admin-input-group relative mb-6">
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="admin-input w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-4 pl-12 text-sm focus:outline-none focus:bg-primary/10 focus:border-primary focus:shadow-[0_0_15px_rgba(13,95,183,0.2)] transition-all peer" 
              placeholder="Admin ID" 
            />
            <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 peer-focus:text-primary transition-colors"></i>
          </div>

          {error && <div className="mb-4 text-red-400 text-xs text-center border border-red-900/50 bg-red-900/20 p-3 rounded">{error}</div>}
          {success && <div className="mb-4 text-green-400 text-xs text-center border border-green-900/50 bg-green-900/20 p-3 rounded">{success}</div>}

          <button 
            type="submit" 
            disabled={isScanning}
            className={`scan-btn relative w-full p-4 font-bold rounded-xl overflow-hidden transition-all flex items-center justify-center gap-2 tracking-widest uppercase text-sm
              bg-primary hover:bg-[#004494] hover:shadow-[0_0_20px_rgba(13,95,183,0.4)]
              ${isScanning ? 'scanning' : ''} disabled:cursor-not-allowed`}
          >
            <span>{btnText}</span>
            {isScanning ? (
                <i className="fa-solid fa-circle-notch fa-spin text-lg"></i>
            ) : (
                <i className="fa-solid fa-paper-plane text-lg"></i>
            )}
            {isScanning && <div className="scan-line-horizontal absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"></div>}
          </button>
        </form>

        <div className="text-center mt-6">
           <button onClick={(e) => { e.preventDefault(); router.push('/login') }} className="text-xs text-gray-400 hover:text-primary transition-colors font-bold uppercase tracking-wider">
               &lt; Return to Authenticator
           </button>
        </div>

        <div className="text-center mt-8 border-t border-white/5 pt-4">
          <p className="text-[0.6rem] text-gray-500 font-mono">
              SYSTEM ID: IMMI-CORE-V2.4 <br/>
              SECURE CONNECTION ESTABLISHED
          </p>
        </div>
      </div>
    </div>
  );
}
