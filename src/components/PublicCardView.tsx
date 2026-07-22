/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Mail, Globe, MapPin, Calendar, Smartphone, Download, 
  MessageSquare, Star, QrCode, Check, Award, Clock, ArrowLeft,
  ChevronRight, Sparkles, Send, ShieldAlert, X, AlertCircle, ShoppingBag
} from 'lucide-react';
import { DigitalCard } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface PublicCardViewProps {
  card?: DigitalCard;
  isVerified?: boolean;
  isLoading?: boolean;
  onBackToDashboard?: () => void; // Optional button back to panels
  fetchError?: string | null; // Added detailed error/diagnostics message
}

export default function PublicCardView({ card, isVerified, isLoading, onBackToDashboard, fetchError }: PublicCardViewProps) {
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', note: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white font-sans relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-48 h-48 rounded-full blur-3xl opacity-20 bg-indigo-500 pointer-events-none"></div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 animate-duration-1000"></div>
          <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase font-mono animate-pulse">Loading Digital Card...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white font-sans relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden z-10">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-white mb-3">Card Not Found</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            The digital business card you are looking for doesn't exist, is private, or has been moved. Please double check the URL and try again.
          </p>

          {/* Detailed Error Diagnostic Panel */}
          {fetchError && (
            <div className="mb-6 p-4 bg-rose-950/70 border border-rose-500/20 text-left rounded-2xl text-xs text-rose-200 font-mono">
              <p className="font-bold mb-1 text-rose-400 flex items-center gap-1">
                <AlertCircle size={14} /> Diagnostic Error:
              </p>
              <p className="leading-relaxed text-[11px] whitespace-pre-wrap text-rose-300/90 break-words mb-2">
                {fetchError}
              </p>
              <div className="h-px bg-slate-800 my-2"></div>
              <p className="text-[10px] text-slate-400 leading-normal">
                💡 <strong>Troubleshooting:</strong> If the card is in your database, make sure its "slug" matches exactly (case-insensitively) and that your database schema/policies allow public select queries.
              </p>
            </div>
          )}
          
          {onBackToDashboard && (
            <button 
              onClick={onBackToDashboard}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer w-full mb-4"
            >
              ← Back to Dashboard
            </button>
          )}

          {isSupabaseConfigured ? (
            <div className="mt-6 text-left bg-slate-950/80 border border-indigo-500/20 p-4 rounded-2xl text-xs text-indigo-200 font-mono">
              <p className="font-bold mb-1 text-indigo-400">⚡ Developer Note (Supabase RLS):</p>
              <p className="mb-2 text-[11px] leading-normal text-slate-400">
                If this card exists in your database but returns "Not Found" for logged-out/guest users, your Row Level Security (RLS) is blocking public read access.
              </p>
              <p className="mb-2 text-[11px] leading-normal text-slate-400">
                To fix this, go to your **Supabase SQL Editor** and run:
              </p>
              <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[10px] overflow-x-auto text-indigo-300">
                {`DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."cards";\n\nCREATE POLICY "Enable read access for all users" \nON "public"."cards" \nFOR SELECT \nUSING (true);`}
              </pre>
            </div>
          ) : (
            <div className="mt-6 text-left bg-rose-950/80 border border-rose-500/20 p-4 rounded-2xl text-xs text-rose-200 font-mono">
              <p className="font-bold mb-1 text-rose-400 flex items-center gap-1">
                <AlertCircle size={14} /> Database Disconnected:
              </p>
              <p className="mb-2 text-[11px] leading-normal text-slate-300">
                This app is running in **Local Offline Mode** because Supabase environment variables are missing on this server.
              </p>
              <p className="text-[11px] leading-normal text-slate-300">
                💡 <strong>To fix:</strong> Please configure <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in your hosting deployment (e.g., your Vercel Dashboard) to enable cloud queries.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isVerified === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Ambient light ornament */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-white mb-3">Card Awaiting Approval</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            This digital business card is currently awaiting administrator review and activation. Please check back again soon!
          </p>
          
          {onBackToDashboard && (
            <button 
              id="btn-back-awaiting"
              onClick={onBackToDashboard}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              ← Back to Workspace
            </button>
          )}
        </div>
      </div>
    );
  }

  // Download VCard contact logic helper
  const handleDownloadVCard = () => {
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
N:${card.profile.lastName};${card.profile.firstName};;;
FN:${card.profile.firstName} ${card.profile.lastName}
ORG:${card.profile.company}
TITLE:${card.profile.designation}
TEL;TYPE=CELL:${card.contact.phone || ''}
EMAIL;TYPE=PREF,INTERNET:${card.contact.email || ''}
URL:${card.contact.website || ''}
ADR;TYPE=WORK:;;${card.contact.address || ''};;;;
END:VCARD`;

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${card.slug}_contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    card.analytics.downloads += 1;
  };

  // WhatsApp purchase flow builder
  const handleWhatsAppOrder = (productTitle: string, price: string) => {
    const phone = card.contact.whatsapp || card.contact.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hi ${card.profile.firstName}, I saw your products on your CardNest digital card and would like to order "${productTitle}" for ${price}. Let me know if it is available!`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    card.analytics.clicks += 1;
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    card.analytics.clicks += 1;
  };

  // Book appointment handler
  const handleBookSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setAppointmentModalOpen(false);
      setSelectedSlot(null);
      setBookingForm({ name: '', email: '', note: '' });
    }, 2000);
    card.analytics.clicks += 1;
  };

  // Business hours slots preseeded
  const mockTimeSlots = [
    { id: 's1', time: '09:30 AM', available: true },
    { id: 's2', time: '11:00 AM', available: true },
    { id: 's3', time: '02:00 PM', available: false },
    { id: 's4', time: '03:30 PM', available: true },
    { id: 's5', time: '05:00 PM', available: true }
  ];

  return (
    <div 
      style={{ fontFamily: card.theme.fontFamily }}
      className={`min-h-screen bg-slate-900 flex flex-col items-center justify-start pb-12 selection:bg-indigo-600 selection:text-white relative`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 w-full max-w-lg h-96 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-48 h-48 rounded-full blur-3xl opacity-30 animate-pulse-slow" style={{ backgroundColor: card.theme.primaryColor }}></div>
        <div className="absolute top-40 right-10 w-48 h-48 rounded-full blur-3xl opacity-20 animate-pulse-slow" style={{ backgroundColor: card.theme.secondaryColor, animationDelay: '2s' }}></div>
      </div>

      {/* Floating share controls - Only Share Card to look clean and professional */}
      <div className="w-full max-w-lg px-4 pt-6 shrink-0 z-20 flex justify-end items-center">
        <button 
          onClick={handleShareLink}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
        >
          {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Smartphone size={14} />} {copiedUrl ? 'Copied' : 'Share Card'}
        </button>
      </div>

      {/* Primary Card View Sheet */}
      <main 
        style={{ borderRadius: card.theme.borderRadius === 'full' ? '32px' : card.theme.borderRadius === 'none' ? '0px' : '24px' }}
        className={`w-full max-w-md mt-6 bg-white border border-slate-200/50 shadow-2xl relative z-10 overflow-hidden flex flex-col justify-start shrink-0 ${card.theme.darkMode ? 'bg-slate-950 border-white/5 text-white' : 'bg-white text-slate-800'}`}
      >
        
        {/* HERO SECTION CONTAINER */}
        {card.hero.enabled && card.hero.type !== 'none' && (
          <div 
            style={{
              height: card.hero.height === 'small' ? '120px' : card.hero.height === 'large' ? '220px' : '170px',
              background: card.hero.type === 'gradient'
                ? `linear-gradient(135deg, ${card.hero.gradientStart || '#3B82F6'}, ${card.hero.gradientEnd || '#1E3A8A'})`
                : card.hero.solidColor || card.theme.primaryColor
            }}
            className="w-full relative shrink-0 overflow-hidden"
          >
            {card.hero.type === 'image' && card.hero.mediaUrl && (
              <img src={card.hero.mediaUrl} className="absolute inset-0 w-full h-full object-cover" alt="Hero background" />
            )}
            {/* Dark blur overlay */}
            <div 
              style={{
                backgroundColor: card.hero.overlayColor || '#000000',
                opacity: card.hero.overlayOpacity || 0.1,
                backdropFilter: `blur(${card.hero.overlayBlur || 0}px)`
              }}
              className="absolute inset-0"
            ></div>
          </div>
        )}

        {/* OVERLAPPING AVATAR BLOCK */}
        <div className="flex flex-col items-center -mt-12 px-6 pb-4 shrink-0 text-center relative z-10">
          <img 
            src={card.avatar.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"} 
            style={{
              borderWidth: `${card.avatar.borderWidth}px`,
              borderColor: card.avatar.borderColor,
              boxShadow: card.avatar.shadow === 'glow' ? `0 0 20px ${card.theme.primaryColor}` : '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
            className="w-24 h-24 rounded-full object-cover shadow-lg"
            alt="profile logo"
          />
          <h2 className="text-2xl font-display font-extrabold mt-3 tracking-tight">
            {card.profile.prefix && `${card.profile.prefix} `}{card.profile.firstName} {card.profile.lastName}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{card.profile.designation}</p>
          <p className="text-base font-extrabold mt-0.5 tracking-tight" style={{ color: card.theme.primaryColor }}>
            {card.profile.company}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 italic px-4 leading-relaxed max-w-sm">
            "{card.profile.tagline || 'Tagline placeholder'}"
          </p>
        </div>

        {/* QUICK DIRECT CONTACT GRID */}
        <div className="grid grid-cols-4 gap-2 px-6 shrink-0 mb-6">
          {card.contact.phone && (
            <a 
              href={`tel:${card.contact.phone}`}
              className="bg-slate-50 dark:bg-white/5 border dark:border-white/5 py-3 rounded-2xl flex flex-col items-center gap-1.5 text-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <Phone size={18} className="text-slate-500" style={{ color: card.theme.primaryColor }} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Call</span>
            </a>
          )}
          {card.contact.whatsapp && (
            <a 
              href={`https://wa.me/${card.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-50 dark:bg-white/5 border dark:border-white/5 py-3 rounded-2xl flex flex-col items-center gap-1.5 text-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <MessageSquare size={18} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">WhatsApp</span>
            </a>
          )}
          {card.contact.email && (
            <a 
              href={`mailto:${card.contact.email}`}
              className="bg-slate-50 dark:bg-white/5 border dark:border-white/5 py-3 rounded-2xl flex flex-col items-center gap-1.5 text-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <Mail size={18} className="text-slate-500" style={{ color: card.theme.primaryColor }} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Email</span>
            </a>
          )}
          <button 
            onClick={handleDownloadVCard}
            className="bg-slate-50 dark:bg-white/5 border dark:border-white/5 py-3 rounded-2xl flex flex-col items-center gap-1.5 text-center hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            <Download size={18} className="text-slate-500" style={{ color: card.theme.primaryColor }} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Save vCard</span>
          </button>
        </div>

        {/* CORE DETAILS COLLAPSIBLE DESCRIPTION */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5">
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Biography</span>
          <p className="text-base text-slate-900 dark:text-slate-100 mt-2 leading-relaxed font-medium">
            {card.profile.about}
          </p>
        </div>

        {/* SERVICES OFFERED */}
        {card.services.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">My Services</span>
            <div className="flex flex-col gap-2.5">
              {card.services.map((s) => (
                <div key={s.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border dark:border-white/5 hover:shadow-sm transition-all">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={15} style={{ color: card.theme.primaryColor }} /> {s.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-1.5 leading-relaxed font-medium">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* E-COMMERCE PRODUCTS CART */}
        {card.products.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Store Products</span>
            <div className="grid grid-cols-1 gap-3">
              {card.products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border dark:border-white/5 flex flex-col justify-between hover:shadow-sm transition-all gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</h4>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 shrink-0 bg-white dark:bg-white/10 px-2.5 py-1 rounded border dark:border-white/5">{p.price}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1.5 leading-normal font-medium">
                      {p.description}
                    </p>
                  </div>
                  
                  {p.whatsappOrder && (
                    <button 
                      onClick={() => handleWhatsAppOrder(p.title, p.price)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 active:scale-98 transition-all cursor-pointer"
                    >
                      <ShoppingBag size={15} /> Buy via WhatsApp
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESSIVE SKILLS */}
        {card.skills.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Technical Deliverables</span>
            <div className="flex flex-col gap-3">
              {card.skills.map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>{s.name}</span>
                    <span>{s.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: card.theme.primaryColor, width: `${s.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOCIAL LINK CAROUSEL GRID */}
        {card.socialLinks.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Find Me Elsewhere</span>
            <div className="grid grid-cols-2 gap-2.5">
              {card.socialLinks.map((link) => (
                <a 
                  key={link.id} 
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-slate-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-bold text-sm"
                >
                  <Smartphone size={16} className="text-indigo-500" />
                  <span className="capitalize text-slate-700 dark:text-slate-300">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* APPOINTMENT SCHEDULER WIDGET */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Appointment Slots</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select a time slot below to secure your 15-minute consultation.</p>
          
          <div className="grid grid-cols-2 gap-2.5">
            {mockTimeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.available}
                onClick={() => {
                  setSelectedSlot(slot.time);
                  setAppointmentModalOpen(true);
                }}
                className={`p-3 text-sm font-bold border rounded-2xl transition-all cursor-pointer ${!slot.available ? 'bg-slate-100 dark:bg-white/5 border-slate-200/50 text-slate-400 line-through cursor-not-allowed' : selectedSlot === slot.time ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-700 dark:text-slate-300 hover:border-slate-300'}`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* OFFICE DIRECT LOCATION MAP BOX */}
        {card.contact.address && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Office Location</span>
            <div className="bg-slate-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-4 flex gap-3.5 items-start">
              <MapPin size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-normal font-semibold">
                  {card.contact.address}
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5 mt-2"
                >
                  Get GPS Driving Directions <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CARD FOOTER & QR CODE POPUP */}
        <div className="bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 p-6 text-center">
          <div className="inline-flex p-3.5 bg-white border border-slate-200 rounded-3xl mb-4 shadow-sm">
            <QrCode size={130} className="text-slate-900" />
          </div>
          <h4 className="font-display font-extrabold text-base text-slate-900 dark:text-white leading-tight">
            {card.qrCode.frameText || 'SCAN TO DOWNLOAD CONTACT'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">
            Scan with any smartphone camera to instantly save my contact details to your native address book.
          </p>

          <span className="text-[10px] text-slate-400 font-bold block mt-8 uppercase tracking-widest">
            Powered by Digital Moksha
          </span>
        </div>

      </main>

      {/* Booking Slot Request Modal */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full relative border border-slate-200 dark:border-white/5"
          >
            <button 
              onClick={() => setAppointmentModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <Calendar size={32} className="text-indigo-600 mx-auto mb-3" />
              <h3 className="text-xl font-display font-bold">Secure Your Time Slot</h3>
              <p className="text-slate-500 text-xs mt-1">
                You are requesting: <strong>{selectedSlot}</strong>
              </p>
            </div>

            {bookingSuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-5 rounded-2xl text-center flex flex-col items-center gap-2 mb-2">
                <Check className="text-emerald-500 text-xl" size={24} />
                <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-400">Appointment Saved!</h4>
                <p className="text-[10px] text-emerald-700/85">Check your inbox for the calendar confirmation link.</p>
              </div>
            ) : (
              <form onSubmit={handleBookSlotSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs focus:outline-none focus:border-indigo-600 text-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Your Email</label>
                  <input 
                    type="email" 
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    placeholder="marcus@gmail.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs focus:outline-none focus:border-indigo-600 text-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Short booking notes</label>
                  <textarea 
                    rows={2}
                    value={bookingForm.note}
                    onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                    placeholder="Discuss design systems consulting"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs focus:outline-none focus:border-indigo-600 text-slate-950 dark:text-white"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-950 dark:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs shadow-md mt-2 cursor-pointer"
                >
                  Submit Calendar Request
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
