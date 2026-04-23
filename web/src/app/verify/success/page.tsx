'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get('document_id');
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    // In a real scenario, you might want to call an endpoint to verify the session status
    if (documentId && sessionId) {
      setStatus('success');
      
      // Automatically trigger download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = `${process.env.NEXT_PUBLIC_API_URL || ''}`;
        link.setAttribute('download', 'Verification_Letter.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1500);
    } else {
      setStatus('error');
    }
  }, [documentId, sessionId]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 relative">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl text-center">
          
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <h2 className="text-xl font-semibold text-white">Verifying Payment...</h2>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Invalid Session</h2>
              <p className="text-slate-400 text-sm">We could not verify your payment session.</p>
              <Link href="/verify" className="inline-block mt-4 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors border border-slate-700">
                Return to Verification
              </Link>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold font-jakarta text-white mb-2">Payment Successful!</h2>
                <p className="text-slate-400 font-sans text-sm">
                  Your document has been securely unlocked.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <Link 
                  href={`/api/download-document?id=${documentId}`}
                  target="_blank"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Document
                </Link>

                <Link 
                  href="/verify"
                  className="w-full block bg-transparent hover:bg-white/5 text-slate-300 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Verify Another Document
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
