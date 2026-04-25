import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const page = await prisma.pageContent.findUnique({
    where: { slug }
  });

  return (
    <div className="bg-[#f8f9fa] text-slate-800 font-sans min-h-screen flex flex-col overflow-x-hidden">
        {/* Global Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm py-4 sticky top-0 z-50">
            <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-heading font-bold text-2xl tracking-tight text-darkBlue">
                    <Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} priority className="object-contain" />
                </Link>
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/#jobs" className="hover:text-primary transition-colors">Available Positions</Link>
                    <Link href="/#apply" className="hover:text-primary transition-colors">Apply Now</Link>
                    <Link href="/verify" className="hover:text-primary transition-colors">Verify Your Letter</Link>
                    <Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/verify" className="hidden md:block text-sm font-bold text-primary hover:text-blue-700 transition-colors">
                        Verify Document
                    </Link>
                    <Link href="/login" className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30 transition-all">
                        Admin Login
                    </Link>
                </div>
            </div>
        </header>

        <main className="flex-1 container mx-auto px-6 lg:px-12 py-16">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 lg:p-16 shadow-sm border border-slate-100">
                {!page || !page.content ? (
                    <div className="text-center py-20">
                        <i className="fa-solid fa-file-contract text-5xl text-slate-300 mb-6"></i>
                        <h1 className="text-3xl font-bold text-darkBlue mb-4">Content being updated.</h1>
                        <p className="text-slate-500">Please check back soon.</p>
                    </div>
                ) : (
                    <article className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-headings:text-darkBlue prose-a:text-primary hover:prose-a:text-blue-700">
                        {/* Simple markdown to HTML rendering for basic usage without external parsers */}
                        <div dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br/>').replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>') }} />
                    </article>
                )}
            </div>
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <Link href="/" className="font-heading font-bold text-2xl tracking-tight text-darkBlue">
                            <Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} className="object-contain" />
                        </Link>
                        <p className="text-slate-500 text-sm mt-2">Connecting Talent with Europe</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/#jobs" className="hover:text-primary transition-colors">Available Positions</Link>
                        <Link href="/#apply" className="hover:text-primary transition-colors">Apply Now</Link>
                        <Link href="/verify" className="hover:text-primary transition-colors">Verify Your Letter</Link>
                        <Link href="/legal/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/legal/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/legal/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
                        <Link href="/legal/gdpr-policy" className="hover:text-primary transition-colors">GDPR Policy</Link>
                    </div>
                </div>
                
                <div className="text-center mb-8">
                    <p className="text-sm font-bold text-slate-600">Poland | Czech Republic | Serbia | Lithuania | Latvia</p>
                </div>

                <div className="text-center text-xs text-slate-400 max-w-4xl mx-auto mb-8">
                    <p>Eurovanta Talent is a registered recruitment agency operating in compliance with EU employment and data protection regulations. We do not charge placement fees. A document handling fee of €25 applies only after successful candidate selection and letter verification.</p>
                </div>

                <div className="text-center text-sm text-slate-400 border-t border-slate-200 pt-8">
                    &copy; {new Date().getFullYear()} Eurovanta Talent. All Rights Reserved.
                </div>
            </div>
        </footer>
    </div>
  );
}
