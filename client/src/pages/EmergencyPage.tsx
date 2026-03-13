import React from 'react';
import { Phone, MapPin, Clock, AlertTriangle, ShieldAlert, HeartPulse } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/Button';

export const EmergencyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-inter">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 lg:p-16 shadow-md border-t-4 border-rose-600 dark:border-rose-500 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] -z-10"></div>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-semibold text-sm border border-rose-100 dark:border-rose-800">
                                <AlertTriangle size={16} /> Critical Response Team
                            </div>
                            
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                                Emergency <br />
                                <span className="text-rose-600">Medical Services</span>
                            </h1>
                            
                            <p className="text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                                Our dedicated 24/7 trauma and emergency care unit is standing by. In the event of a life-threatening clinical emergency, dial our priority hotline immediately.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="h-16 px-10 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xl font-bold shadow-sm transition-colors">
                                    <Phone size={24} className="mr-3 animate-pulse" /> 1-800-MED-EMRG
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: <ShieldAlert className="text-rose-600" />, title: "Ambulance Fleet", value: "24/7 Dispatch", desc: "Advanced Life Support (ALS) equipped." },
                                { icon: <HeartPulse className="text-rose-600" />, title: "Trauma Center", value: "Level I Care", desc: "Board-certified specialists." },
                                { icon: <MapPin className="text-rose-600" />, title: "Facility Access", value: "ER Entrance", desc: "Follow red signs via West Gate." },
                                { icon: <Clock className="text-rose-600" />, title: "Triage Protocol", value: "Rapid Assessment", desc: "Prioritized by critical acuity." }
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="mb-4">{item.icon}</div>
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.title}</h3>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.value}</div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm font-normal">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-bold mb-3 dark:text-white text-slate-900">Possible Myocardial Infarction?</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Do not independently operate a vehicle. Contact EMS immediately. If directed by an operator, chew an adult aspirin.</p>
                    </div>
                    <div className="p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-bold mb-3 dark:text-white text-slate-900">Traumatic Injury & Hemorrhage?</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Apply direct, sustained pressure to lacerations using sterile gauze or clean cloth. Elevate the affected extremity above the heart if possible.</p>
                    </div>
                    <div className="p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-bold mb-3 dark:text-white text-slate-900">Toxicological Exposure?</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Identify the agent. Contact Poison Control immediately. Do not induce emesis (vomiting) unless explicitly instructed by a medical professional.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
