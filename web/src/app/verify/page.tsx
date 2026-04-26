'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'verified' | 'not_found' | 'suspicious'>('idle');
  const [documentInfo, setDocumentInfo] = useState<any | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentInfo(null);
    setStatus('loading');

    try {
      const res = await fetch(`/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationCode: code, candidateName, candidateEmail })
      });

      const data = await res.json();

      if (data.success) {
        if (data.status === 'VERIFIED') {
            setStatus('verified');
            setDocumentInfo(data.document);
        } else if (data.status === 'NOT_FOUND') {
            setStatus('not_found');
        } else if (data.status === 'SUSPICIOUS') {
            setStatus('suspicious');
        } else {
            setStatus('not_found');
        }
      } else {
        setStatus('not_found');
      }
    } catch (err) {
      setStatus('not_found');
    }
  };

  const handlePayment = async (provider: 'nomadpay' | 'payoneer') => {
    if (!documentInfo?.id) return;
    
    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/checkout/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: documentInfo.id })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setStatus('not_found');
      }
    } catch (err) {
      setStatus('not_found');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-jakarta text-white mb-2">Eurovanta Talent</h1>
          <p className="text-slate-400 font-sans">Secure Document Verification</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
          {status === 'idle' || status === 'loading' ? (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name (as per Passport)
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-all"
                  placeholder="e.g. EVT-TEST-2026"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Verify Document'
                )}
              </button>
            </form>
          ) : status === 'not_found' ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30 text-3xl font-bold">
                ✕
              </div>
              <h2 className="text-xl font-semibold text-white mb-1">Document Not Found</h2>
              <p className="text-slate-400 text-sm">We could not verify this document. The details provided do not match any official records in our system.</p>
              <button onClick={() => setStatus('idle')} className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">Try Again</button>
            </div>
          ) : status === 'suspicious' ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30 text-3xl font-bold">
                ⚠️
              </div>
              <h2 className="text-xl font-semibold text-white mb-1">Suspicious Document</h2>
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg text-left">
                  <p className="text-amber-400 text-sm font-medium">This code corresponds to a placement program in Hungary or Croatia.</p>
                  <p className="text-slate-300 text-sm mt-2">Be advised: Eurovanta Talent's placement programs for Hungary and Croatia are <strong>permanently closed</strong>. We are not issuing any active offer letters for these regions. If you received this letter recently from someone claiming to be an agent, it is likely fraudulent.</p>
              </div>
              <button onClick={() => setStatus('idle')} className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">Verify Another Code</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">Document Verified</h2>
                <p className="text-slate-400 text-sm">This document is valid and registered in our system.</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate</span>
                  <span className="text-white font-medium">{documentInfo.candidateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Role/Placement</span>
                  <span className="text-white font-medium">{documentInfo.placementCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Document Type</span>
                  <span className="text-white font-medium">Official Offer Letter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Document Status</span>
                  <span className="text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded">{documentInfo.status}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => alert("Payment Gateway Mock Triggered")}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay & Download My Letter — €25
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setDocumentInfo(null);
                    setCode('');
                    setStatus('idle');
                  }}
                  className="w-full mt-3 bg-transparent hover:bg-white/5 text-slate-300 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Verify Another Document
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Eurovanta Talent. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
