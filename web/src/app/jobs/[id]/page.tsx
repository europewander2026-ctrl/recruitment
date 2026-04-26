import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Briefcase, Banknote, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getCurrencySuffix, formatSalary } from '@/lib/currency';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const job = await prisma.job.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!job || job.status !== 'active') {
        notFound();
    }

    const salaryString = formatSalary(job.salary || '', job.country, job.salaryPeriod);
    
    // Process responsibilities into a list
    const responsibilitiesList = job.responsibilities 
        ? job.responsibilities.split('\n').map(r => r.trim()).filter(r => r.length > 0)
        : [];

    return (
        <div className="bg-[#f8f9fa] text-slate-800 font-sans min-h-screen flex flex-col overflow-x-hidden">
            {/* Global Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm py-4 sticky top-0 z-50 border-b border-slate-100">
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
                </div>
            </header>

            <main className="flex-1 py-12">
                <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                    
                    <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#002366] transition-colors mb-8">
                        <ArrowLeft size={16} /> Back to Job Board
                    </Link>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                        {/* Job Header */}
                        <div className="bg-gradient-to-br from-[#002366] to-blue-900 text-white p-10 lg:p-14 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-blue-500/10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 50%)' }}></div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-blue-500/30 border border-blue-400/50 text-blue-50 text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-sm">
                                        {job.category}
                                    </span>
                                    <span className="px-4 py-1.5 bg-green-500/30 border border-green-400/50 text-green-50 text-xs font-bold rounded-full backdrop-blur-sm">
                                        🟢 Actively Recruiting
                                    </span>
                                </div>
                                
                                <h1 className="font-heading font-bold text-3xl md:text-5xl mb-6 leading-tight">
                                    {job.title}
                                </h1>
                                
                                <div className="flex flex-col sm:flex-row gap-6 text-blue-100">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="text-amber-400" size={20} />
                                        <span className="font-medium">{job.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="text-amber-400" size={20} />
                                        <span className="font-medium">{job.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Banknote className="text-amber-400" size={20} />
                                        <span className="font-medium">{salaryString}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Body */}
                        <div className="p-10 lg:p-14">
                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-xl font-bold text-[#002366] mb-6 flex items-center gap-2">
                                    <Briefcase className="text-blue-500" size={24} /> 
                                    Role Overview & Responsibilities
                                </h3>
                                
                                {responsibilitiesList.length > 0 ? (
                                    <ul className="space-y-4 mb-10">
                                        {responsibilitiesList.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-slate-600 leading-relaxed">
                                                <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                                                <span>{item.replace(/^[-\*]\s*/, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-500 italic mb-10">Detailed responsibilities will be discussed during the interview process.</p>
                                )}
                            </div>

                            {/* CTA */}
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center mt-8">
                                <h4 className="font-bold text-lg text-slate-800 mb-2">Ready to start your journey?</h4>
                                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">Submit your application securely. Our recruitment team will review your profile and contact you if you're a match.</p>
                                <Link 
                                    href={`/apply?jobId=${job.id}&title=${encodeURIComponent(job.title || '')}`}
                                    className="inline-block px-10 py-4 bg-[#002366] hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto"
                                >
                                    Apply for this Position
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Global Footer */}
            <footer className="bg-[#002366] text-white border-t border-blue-900 pt-16 pb-8 mt-auto">
                <div className="container mx-auto px-6 lg:px-12 text-center text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} Eurovanta Talent. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}
