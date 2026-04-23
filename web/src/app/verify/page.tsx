'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentInfo, setDocumentInfo] = useState<any | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDocumentInfo(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();

      if (data.success) {
        setDocumentInfo(data.document);
      } else {
        setError(data.message || 'Verification failed.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (provider: 'nomadpay' | 'payoneer') => {
    if (!documentInfo?.id) return;
    
    setIsLoading(true);
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
        setError(`Failed to initiate payment with ${provider}.`);
      }
    } catch (err) {
      setError('An error occurred while connecting to payment gateway.');
    } finally {
      setIsLoading(false);
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
          {!documentInfo ? (
            <form onSubmit={handleVerify} className="space-y-6">
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
                  placeholder="e.g. DOC-1234-ABCD"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Verify Document'
                )}
              </button>
            </form>
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
                  <span className="text-slate-400">Role</span>
                  <span className="text-white font-medium">{documentInfo.candidateRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Document Type</span>
                  <span className="text-white font-medium">{documentInfo.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  {documentInfo.isPaid ? (
                    <span className="text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded">Unlocked</span>
                  ) : (
                    <span className="text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded">Payment Required</span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                {documentInfo.isPaid ? (
                  <Link 
                    href={`/api/download-document?id=${documentInfo.id}`}
                    target="_blank"
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Secure PDF
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handlePayment('nomadpay')}
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Pay with Nomadpay
                    </button>
                    <button
                      onClick={() => handlePayment('payoneer')}
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pay with Payoneer
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setDocumentInfo(null);
                    setCode('');
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
