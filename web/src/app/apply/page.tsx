"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ApplyPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        nationality: '',
        residence: '',
        email: '',
        phone: '',
        country: '',
        industry: '',
        experience: '',
        education: '',
        passport: 'yes',
        passportExpiry: '',
        cv: null as File | null,
        gdpr1: false,
        gdpr2: false,
        gdpr3: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        
        if (!formData.gdpr1 || !formData.gdpr2 || !formData.gdpr3) {
            setErrorMsg('You must agree to all privacy and GDPR terms to proceed.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    dob: formData.dob,
                    nationality: formData.nationality,
                    residence: formData.residence,
                    email: formData.email,
                    phone: formData.phone,
                    country: formData.country,
                    industry: formData.industry,
                    experience: formData.experience,
                    education: formData.education,
                    passport: formData.passport,
                    passportExpiry: formData.passportExpiry
                    // CV upload skipped in JSON payload, typically sent via multipart/form-data or to S3
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setIsSuccess(true);
            } else {
                setErrorMsg(data.error || 'Failed to submit application.');
            }
        } catch (error) {
            setErrorMsg('An error occurred while submitting your application.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <Head><title>Application Received | Eurovanta Talent</title></Head>
                <div className="bg-white max-w-lg w-full p-10 rounded-3xl shadow-sm border border-slate-200 text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-[#002366] mb-4">Application Received</h1>
                    <p className="text-slate-500 mb-8">
                        Thank you for applying to Eurovanta Talent. Your application has been securely logged in our system. Our recruitment team will review your profile and contact you soon.
                    </p>
                    <Link href="/" className="inline-block px-8 py-3 bg-[#002366] text-white font-bold rounded-full hover:bg-blue-900 transition-colors">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <Head><title>Apply Now | Eurovanta Talent</title></Head>
            
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-[#002366] mb-4">Official Application Portal</h1>
                    <p className="text-slate-500">Please fill out all required fields securely to submit your profile for review.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 text-[#002366]">
                        <ShieldCheck size={24} />
                        <h2 className="font-bold text-xl">SECTION 4 — APPLICATION FORM</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Legal Name *</label>
                                <input required type="text" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="As it appears on passport" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth *</label>
                                <input required type="date" value={formData.dob} onChange={e=>setFormData({...formData, dob: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nationality *</label>
                                <input required type="text" value={formData.nationality} onChange={e=>setFormData({...formData, nationality: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="e.g. Indian, Nigerian" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Current Residence *</label>
                                <input required type="text" value={formData.residence} onChange={e=>setFormData({...formData, residence: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="City, Country" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                                <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                                <input required type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="+1234567890" />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Professional Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Country *</label>
                                <select required value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm">
                                    <option value="">Select a country</option>
                                    <optgroup label="Active European Placements">
                                        <option value="Poland">Poland</option>
                                        <option value="Czech Republic">Czech Republic</option>
                                        <option value="Serbia">Serbia</option>
                                        <option value="Lithuania">Lithuania</option>
                                        <option value="Latvia">Latvia</option>
                                    </optgroup>
                                    <optgroup label="Middle East Placements">
                                        <option value="UAE">United Arab Emirates (UAE)</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="Qatar">Qatar</option>
                                        <option value="Oman">Oman</option>
                                        <option value="Bahrain">Bahrain</option>
                                        <option value="Kuwait">Kuwait</option>
                                    </optgroup>
                                    <optgroup label="Closed Programs">
                                        <option value="Hungary" disabled>Hungary (Closed 2024)</option>
                                        <option value="Croatia" disabled>Croatia (Closed 2025)</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Industry *</label>
                                <input required type="text" value={formData.industry} onChange={e=>setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="e.g. Manufacturing, Logistics" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience *</label>
                                <input required type="text" value={formData.experience} onChange={e=>setFormData({...formData, experience: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="e.g. 5 Years" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Education *</label>
                                <input required type="text" value={formData.education} onChange={e=>setFormData({...formData, education: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="e.g. High School, Bachelor's" />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Passport & Documents */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Do you have a valid passport? *</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="passport" value="yes" checked={formData.passport === 'yes'} onChange={()=>setFormData({...formData, passport: 'yes'})} className="w-4 h-4 text-[#002366]" /> Yes
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="passport" value="no" checked={formData.passport === 'no'} onChange={()=>setFormData({...formData, passport: 'no'})} className="w-4 h-4 text-[#002366]" /> No
                                    </label>
                                </div>
                            </div>
                            {formData.passport === 'yes' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Passport Expiry Date *</label>
                                    <input required type="date" value={formData.passportExpiry} onChange={e=>setFormData({...formData, passportExpiry: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" />
                                </div>
                            )}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Upload CV / Resume *</label>
                                <input required type="file" onChange={e=>setFormData({...formData, cv: e.target.files ? e.target.files[0] : null})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#002366] hover:file:bg-blue-100" />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* GDPR & Privacy */}
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 text-sm text-slate-600">
                                <input type="checkbox" checked={formData.gdpr1} onChange={e=>setFormData({...formData, gdpr1: e.target.checked})} className="mt-1 w-5 h-5 text-[#002366] rounded border-slate-300" />
                                <span>I consent to the collection and processing of my personal data by Eurovanta Talent for recruitment purposes according to the GDPR Privacy Policy. *</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-600">
                                <input type="checkbox" checked={formData.gdpr2} onChange={e=>setFormData({...formData, gdpr2: e.target.checked})} className="mt-1 w-5 h-5 text-[#002366] rounded border-slate-300" />
                                <span>I confirm that all information provided in this application is true and accurate. *</span>
                            </label>
                            <label className="flex items-start gap-3 text-sm text-slate-600">
                                <input type="checkbox" checked={formData.gdpr3} onChange={e=>setFormData({...formData, gdpr3: e.target.checked})} className="mt-1 w-5 h-5 text-[#002366] rounded border-slate-300" />
                                <span>I understand that Eurovanta Talent will not ask for advance placement fees and I have read the fraud warning. *</span>
                            </label>
                        </div>

                        {errorMsg && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                                {errorMsg}
                            </div>
                        )}

                        <div className="pt-4">
                            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-[#002366] hover:bg-blue-900 text-[#D4AF37] font-bold text-lg rounded-xl shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
