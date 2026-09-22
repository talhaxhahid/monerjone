import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | MonerJone',
  description: 'Get in touch with the MonerJone support team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F3FA] font-serif">
          Contact Us
        </h1>
        <p className="text-sm text-[#B9AFD1] max-w-xl mx-auto">
          Questions, feedback, or need help with your account? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#1F1640]/90 border border-[#FF4D7E]/20 shadow-xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#150E2B] border border-white/10 flex items-center justify-center text-[#FF4D7E] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-[#F5F3FA] block text-sm">Office</span>
            <p className="text-xs text-[#B9AFD1] mt-0.5">Gulshan Avenue, Dhaka 1212, Bangladesh</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#150E2B] border border-white/10 flex items-center justify-center text-[#FF4D7E] shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-[#F5F3FA] block text-sm">Email</span>
            <a href="mailto:monerjone.com@gmail.com" className="text-xs text-[#B9AFD1] hover:text-[#FF4D7E] mt-0.5 block">
              monerjone.com@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#150E2B] border border-white/10 flex items-center justify-center text-[#FF4D7E] shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-[#F5F3FA] block text-sm">Phone</span>
            <a href="tel:01627721328" className="text-xs text-[#B9AFD1] hover:text-[#FF4D7E] mt-0.5 block">
              01627721328
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-[#F5F3FA] block text-sm">WhatsApp</span>
            <a
              href="https://wa.me/+8801627721328"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#B9AFD1] hover:text-[#FF4D7E] mt-0.5 block"
            >
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
