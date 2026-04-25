"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function GeneralSettingsPage() {
    const [receiveAlerts, setReceiveAlerts] = useState(true);
    const [publicForms, setPublicForms] = useState(true);
    const [soundAlerts, setSoundAlerts] = useState(true);
    const [defaultCurrency, setDefaultCurrency] = useState('USD');
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        fetch('/api/settings/general')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setReceiveAlerts(data.data.receiveAlerts);
                    setPublicForms(data.data.publicForms);
                    setSoundAlerts(data.data.soundAlerts);
                    setDefaultCurrency(data.data.defaultCurrency);
                }
            })
            .catch(err => console.error('Error fetching general settings', err));
    }, []);

    const updateSetting = async (key: string, value: any) => {
        // Optimistic UI
        if (key === 'receiveAlerts') setReceiveAlerts(value);
        if (key === 'publicForms') setPublicForms(value);
        if (key === 'soundAlerts') setSoundAlerts(value);
        if (key === 'defaultCurrency') setDefaultCurrency(value);
        setStatusMsg("Saving...");

        try {
            const res = await fetch('/api/settings/general', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: value })
            });
            const data = await res.json();
            if (data.success) {
                setStatusMsg("Saved successfully.");
                setTimeout(() => setStatusMsg(""), 2000);
            } else {
                setStatusMsg("Failed to save.");
            }
        } catch (err) {
            setStatusMsg("Failed to save.");
        }
    };

    return (
        <>
<Head><title>General Settings | Eurovanta Talent Admin</title></Head>

            

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
                    <h2 className="font-heading font-bold text-2xl text-darkBlue">General Settings</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h3 className="font-heading font-bold text-xl text-darkBlue mb-6">Global Directives</h3>
                        
                        <div className="space-y-6 max-w-lg">
                            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">Receive Email Alerts</h4>
                                    <p className="text-xs text-slate-500 mt-1">Receive Email Alerts for New Applications</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={receiveAlerts} onChange={(e)=>updateSetting('receiveAlerts', e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-successGreen"></div>
                                </label>
                            </div>

                            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">Public Application Hooks</h4>
                                    <p className="text-xs text-slate-500 mt-1">Permit incoming traffic from the recruitment frontend.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={publicForms} onChange={(e)=>updateSetting('publicForms', e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-successGreen"></div>
                                </label>
                            </div>

                            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">Holographic Telemetry (Sound)</h4>
                                    <p className="text-xs text-slate-500 mt-1">Play interface SFX when hovering 3D elements natively.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={soundAlerts} onChange={(e)=>updateSetting('soundAlerts', e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-successGreen"></div>
                                </label>
                            </div>

                            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800">Default Display Currency</h4>
                                    <p className="text-xs text-slate-500 mt-1">Select the primary currency for Job Salaries.</p>
                                </div>
                                <select 
                                    value={defaultCurrency} 
                                    onChange={(e)=>updateSetting('defaultCurrency', e.target.value)} 
                                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="AED">AED</option>
                                </select>
                            </div>

                            {statusMsg && <p className="text-sm font-bold text-green-600 pt-2">{statusMsg}</p>}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
