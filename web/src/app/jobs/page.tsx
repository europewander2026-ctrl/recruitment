import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, MapPin, Building2, Banknote } from 'lucide-react';
import { getCurrencySuffix, formatSalary } from '@/lib/currency';

const prisma = new PrismaClient();

// Optional: Enable Next.js to revalidate the page occasionally, 
// or set to dynamic if you want strictly real-time fetching on every load.
export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-[#f8f9fa] text-slate-800 font-sans min-h-screen flex flex-col overflow-x-hidden">
        {/* Global Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm py-4 sticky top-0 z-50">
            <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-heading font-bold text-2xl tracking-tight text-[#002366]">
                    <Image src="/logo.png" alt="Eurovanta Talent Logo" width={220} height={55} priority className="object-contain" />
                </Link>
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
                    <Link href="/" className="hover:text-[#002366] transition-colors">Home</Link>
                    <Link href="/jobs" className="text-[#002366] font-bold">Available Positions</Link>
                    <Link href="/verify" className="hover:text-[#002366] transition-colors">Verify Your Letter</Link>
                    <Link href="/#contact" className="hover:text-[#002366] transition-colors">Contact</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/verify" className="hidden md:block text-sm font-bold text-[#002366] hover:text-amber-500 transition-colors">
                        Verify Document
                    </Link>
                    <Link href="/login" className="font-bold bg-[#002366] text-white hover:bg-blue-900 px-5 py-2.5 rounded-full text-sm shadow-lg shadow-blue-500/30 transition-all">
                        Admin Login
                    </Link>
                </div>
            </div>
        </header>

        <main className="flex-1">
            {/* Page Hero */}
            <div className="bg-[#002366] text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900/50 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">Open Positions</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Join our verified employers across Europe. Browse current opportunities and apply directly through our secure portal.
                    </p>
                </div>
            </div>

            {/* Job Board Grid */}
            <div className="container mx-auto px-6 lg:px-12 py-16">
                {jobs.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                            <Briefcase size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#002366] mb-4">No positions currently available</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            We are currently updating our job board. Please check back soon or submit a general application, and our recruiters will contact you when a matching position opens.
                        </p>
                        <Link href="/apply" className="inline-block px-8 py-4 bg-[#002366] hover:bg-blue-900 text-white font-bold rounded-full shadow-lg transition-all">
                            Submit General Application
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 flex flex-col">
                                <div className="mb-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-blue-50 text-[#002366] text-xs font-bold rounded-full uppercase tracking-wider">
                                            {job.category}
                                        </span>
                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">
                                            Active
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 leading-snug">
                                        {job.title}
                                    </h2>
                                    
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-slate-600">
                                            <MapPin size={16} className="text-slate-400" />
                                            <span>{job.country}</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-600">
                                            <Building2 size={16} className="text-slate-400" />
                                            <span>{job.category}</span>
                                        </li>
                                        {job.salary && (
                                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                                <Banknote size={16} className="text-slate-400 shrink-0" />
                                                <span className="font-medium">
                                                    {formatSalary(job.salary, job.country, job.salaryPeriod)}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                
                                <div className="pt-6 border-t border-slate-100 mt-auto">
                                    <Link href={`/jobs/${job.id}`} className="block w-full text-center py-3 bg-[#002366] hover:bg-blue-900 text-white font-bold rounded-xl shadow-sm transition-colors">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>

        {/* Global Footer */}
        <footer className="bg-[#002366] text-white border-t border-blue-900 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                    <div className="text-center md:text-left">
                        <Link href="/" className="font-heading font-bold text-2xl tracking-tight text-white mb-4 block">
                            <Image src="/favicon.png" alt="Eurovanta Talent Logo" width={64} height={64} className="object-contain" />
                        </Link>
                        <p className="text-slate-300 text-sm mt-4 max-w-sm">Eurovanta Talent connects skilled professionals with verified employers across Europe and the Middle East.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-12 text-sm">
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Quick Links</h4>
                            <ul className="space-y-2 text-slate-300 font-medium">
                                <li><Link href="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
                                <li><Link href="/jobs" className="hover:text-amber-500 transition-colors">Available Positions</Link></li>
                                <li><Link href="/verify" className="hover:text-amber-500 transition-colors">Verify Your Letter</Link></li>
                                <li><Link href="/#contact" className="hover:text-amber-500 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Legal</h4>
                            <ul className="space-y-2 text-slate-300 font-medium">
                                <li><Link href="/legal/privacy-policy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/legal/terms-of-service" className="hover:text-amber-500 transition-colors">Terms of Service</Link></li>
                                <li><Link href="/legal/cookie-policy" className="hover:text-amber-500 transition-colors">Cookie Policy</Link></li>
                                <li><Link href="/legal/gdpr-policy" className="hover:text-amber-500 transition-colors">GDPR Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-400 max-w-4xl mx-auto mb-8">
                    <p>Eurovanta Talent is a registered recruitment agency operating in compliance with EU employment and data protection regulations. We do not charge placement fees. A document handling fee of €25 applies only after successful candidate selection and letter verification.</p>
                </div>

                <div className="text-center text-sm text-slate-400 border-t border-slate-700/50 pt-8">
                    &copy; {new Date().getFullYear()} Eurovanta Talent. All Rights Reserved.
                </div>
            </div>
        </footer>
    </div>
  );
}
