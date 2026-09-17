'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ContactPage() {
  const { addToast } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast('আপনার বার্তা সফলভাবে প্রেরণ করা হয়েছে। আমরা দ্রুত যোগাযোগ করব।', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-serif">
          যোগাযোগ ও সাপোর্ট
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          যেকোনো জিজ্ঞাসা, প্যাকেজ আপগ্রেড সহায়তা বা পরামর্শের জন্য আমাদের সাথে নির্দ্বিধায় যোগাযোগ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Contact info */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-slate-100 pb-3 border-b border-slate-800">
            হেল্পলাইন ও অফিস
          </h3>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <div>
                <span className="font-bold text-slate-100 block">সাপোর্ট হটলাইন:</span>
                <span className="font-mono text-amber-300">+880 1700-000000</span>
                <span className="text-slate-500 block">সকাল ১০টা থেকে রাত ১০টা পর্যন্ত</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <div>
                <span className="font-bold text-slate-100 block">ইমেইল:</span>
                <span className="text-slate-200">support@monerjone.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <div>
                <span className="font-bold text-slate-100 block">প্রধান কার্যালয়:</span>
                <span className="text-slate-200">ধানমন্ডি, ঢাকা - ১২০৯, বাংলাদেশ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-xl">
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="text-lg font-bold text-slate-100">বার্তা প্রাপ্ত হয়েছে!</h3>
              <p className="text-xs text-slate-400">আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-100 mb-2">সরাসরি মেসেজ পাঠান</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">আপনার নাম</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">আপনার বার্তা / জিজ্ঞাসা</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
