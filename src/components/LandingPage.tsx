/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Sparkles, CheckCircle, HelpCircle, ArrowRight, Smartphone, 
  Layers, Users, Shield, BarChart3, ChevronDown, Check, Star, Mail, Menu, X, Code2, Heart, GraduationCap, Briefcase
} from 'lucide-react';
import { subscriptionPlans, mockFAQs } from '../data/mockData';

interface LandingPageProps {
  onRealLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRealRegister: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string; pendingApproval?: boolean }>;
  onSelectCard: (slug: string) => void;
  isSupabaseConnected: boolean;
}

export default function LandingPage({ onRealLogin, onRealRegister, onSelectCard, isSupabaseConnected }: LandingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [regPending, setRegPending] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'login') {
        const result = await onRealLogin(authEmail, authPassword);
        if (!result.success) {
          setAuthError(result.error || 'Login failed. Please check your credentials.');
        } else {
          setShowAuthModal(false);
        }
      } else {
        if (!authFullName.trim()) {
          setAuthError('Please enter your full name.');
          setAuthLoading(false);
          return;
        }
        const result = await onRealRegister(authEmail, authPassword, authFullName);
        if (!result.success) {
          setAuthError(result.error || 'Registration failed.');
        } else {
          if (result.pendingApproval) {
            setRegPending(true);
          } else {
            setShowAuthModal(false);
          }
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected error occurred.');
    } finally {
      setAuthLoading(false);
    }
  };

  const getPrice = (priceStr: string) => {
    if (priceStr === '$0') return '$0';
    const num = parseInt(priceStr.replace('$', ''), 10);
    if (billingCycle === 'yearly') {
      return `$${Math.round(num * 0.8)}`; // 20% discount
    }
    return priceStr;
  };

  return (
    <div id="landing-page" className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white relative">
      {/* Background decoration: Subtle minimalist dot-grid instead of heavy color blurs */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px] opacity-70 pointer-events-none z-0"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-slate-950/20">
              <span className="text-xl font-display font-black">C</span>
            </div>
            <span className="text-2xl font-display font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
              CardNest
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-950 transition-colors">Features</a>
            <a href="#templates" className="hover:text-slate-950 transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-slate-950 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-950 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button 
              id="btn-nav-login"
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors px-4 py-2"
            >
              Log In
            </button>
            <button 
              id="btn-nav-signup"
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="text-sm font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 transition-all shadow-md shadow-slate-950/10 active:scale-95"
            >
              Create Free Card
            </button>
          </div>

          <button 
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-800 p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-200 bg-white"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-slate-700">Features</a>
                <a href="#templates" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-slate-700">Templates</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-slate-700">Pricing</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-slate-700">FAQ</a>
                <div className="h-px bg-slate-100 my-2"></div>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setAuthMode('login'); setShowAuthModal(true); }}
                  className="text-center font-bold text-slate-700 py-2 border border-slate-200 rounded-xl"
                >
                  Log In
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setAuthMode('register'); setShowAuthModal(true); }}
                  className="text-center font-bold bg-slate-950 text-white py-3 rounded-xl shadow-md"
                >
                  Create Free Card
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
            <Sparkles size={13} /> The Modern Professional Identity
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-slate-900 leading-none max-w-5xl mx-auto">
            The Digital Business Card <br/>
            <span className="text-slate-950 font-black">
              Built for High-Performers
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Create stunning contactless business cards embedded with rich galleries, dynamic custom links, appointment schedulers, services, and live analytics. Print or scan instantly with custom dynamic QR codes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              id="btn-hero-cta"
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-slate-950/20 active:scale-98 group cursor-pointer"
            >
              Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="#templates" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-sm cursor-pointer"
            >
              Explore Templates
            </a>
          </div>
        </motion.div>

        {/* Floating Mockup Preview Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 md:mt-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white/40 border border-white/55 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm relative"
        >
          {/* Subtle grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 rounded-3xl"></div>

          <div className="md:col-span-7 text-left relative z-10">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <Smartphone size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-snug">
              Unrivaled visual fidelity. Interactive contact hub.
            </h3>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Ditch static paper templates. Your customers can click to call, message via WhatsApp, navigate with Google Maps, view your digital brochures, browse dynamic products, and even book consultation slots in a responsive browser layout.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">NFC Compatible</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Link your card directly to any physical custom NFC tag.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Dynamic Analytics</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Log every visit, tap, QR scan, brochure download, and click.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center relative z-10">
            {/* Elegant Mock Phone Widget */}
            <div className="w-72 h-[500px] bg-slate-950 rounded-[40px] p-3 shadow-2xl relative border-4 border-slate-800 shrink-0">
              {/* Phone Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center gap-1.5">
                <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
              </div>

              {/* Dynamic Simulated Card View Inside Phone */}
              <div className="w-full h-full bg-slate-900 rounded-[30px] overflow-y-auto overflow-x-hidden no-scrollbar text-white flex flex-col text-left relative text-xs">
                {/* Hero */}
                <div className="w-full h-32 bg-gradient-to-tr from-slate-900 to-indigo-950 shrink-0 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <span className="text-[10px] font-mono tracking-widest text-indigo-300 z-10 uppercase">DESIGNCO</span>
                </div>

                {/* Profile Avatar overlapping */}
                <div className="flex flex-col items-center -mt-10 px-4 pb-4 shrink-0 text-center relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                    className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-lg"
                    alt="Alex"
                  />
                  <h4 className="font-display font-bold text-sm mt-2">Alex Rivera</h4>
                  <p className="text-slate-400 text-[10px]">VP of Design & Product</p>
                  <p className="text-indigo-400 text-[9px] mt-0.5">DesignCo Global</p>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-4 gap-2 px-4 shrink-0">
                  <div className="bg-white/10 p-2 rounded-xl flex flex-col items-center gap-1 hover:bg-white/15 transition-all text-center">
                    <Smartphone size={14} className="text-indigo-300" />
                    <span className="text-[8px] font-medium text-slate-300">Call</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl flex flex-col items-center gap-1 hover:bg-white/15 transition-all text-center">
                    <Mail size={14} className="text-indigo-300" />
                    <span className="text-[8px] font-medium text-slate-300">Email</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl flex flex-col items-center gap-1 hover:bg-white/15 transition-all text-center">
                    <Layers size={14} className="text-indigo-300" />
                    <span className="text-[8px] font-medium text-slate-300">Brochure</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl flex flex-col items-center gap-1 hover:bg-white/15 transition-all text-center">
                    <CreditCard size={14} className="text-indigo-300" />
                    <span className="text-[8px] font-medium text-slate-300">VCard</span>
                  </div>
                </div>

                {/* Services teaser */}
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-px bg-white/10 my-1"></div>
                  <span className="font-bold text-[10px] text-slate-300 uppercase tracking-wider">Services</span>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <h5 className="font-bold text-slate-200">UX Strategy Audit</h5>
                    <p className="text-slate-400 text-[9px] mt-1">Full design blueprints to scale engagement rates rapidly.</p>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <h5 className="font-bold text-slate-200">Design Tokens</h5>
                    <p className="text-slate-400 text-[9px] mt-1">Ready-to-use theme packages compiled in Tailwind CSS.</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-auto p-4">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-[10px] text-center shadow-lg shadow-indigo-600/30">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 bg-white border-y border-slate-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Core Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mt-2 leading-tight">
              A Complete Suite for Modern Professional Branding
            </h2>
            <p className="mt-4 text-slate-600">
              Everything you need to showcase your work, engage potential clients, and analyze network reach inside an incredibly intuitive portal.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-3xl hover:shadow-xl hover:bg-white transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Interactive Hero & Media</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Choose gradients, static design images, or upload responsive looping videos (up to 10MB) that instantly hook scanners. Support autoplay, muted mode, and custom overlay blurs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-3xl hover:shadow-xl hover:bg-white transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Custom Theme Engine</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Tweak primary colors, background glassmorphism settings, button roundness, standard Google Fonts, icon backings, and spacing offsets to reflect your exact brand identity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-3xl hover:shadow-xl hover:bg-white transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Advanced View Analytics</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Visualize geographic origins of your viewers, city densities, click statistics for custom buttons, scanned QR codes, device screen splits, and operational systems.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-3xl hover:shadow-xl hover:bg-white transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Product Cart & WhatsApp</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                List unlimited services or physical/digital products with descriptions and clear pricing. Enable direct WhatsApp ordering to convert page visitors into paying clients instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-3xl hover:shadow-xl hover:bg-white transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Appointments & Schedule</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Allow visitors to request standard consultation slots or schedule events. Bookings are automatically indexed in your user control panel for seamless follow-ups.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 border border-slate-200/50 p-8 rounded-3xl hover:shadow-xl hover:bg-white transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Premium SVG QR Generator</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Create highly brandable QR codes. Customize foreground colors, insert your central company logo, toggle gradient transitions, and apply polished frames like "SCAN ME".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Slider Section */}
      <section id="templates" className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Handcrafted Layouts</span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mt-2">
              Ready-to-Use Templates
            </h2>
            <p className="mt-4 text-slate-600">
              Select one of our beautifully designed, pre-seeded professional cards and customize it immediately in our live visual builder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Corporate Card Card */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col">
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-lg">Alex Rivera</h4>
                  <p className="text-slate-400 text-xs">VP of Design & Product</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Corporate
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clean, structured executive aesthetic with gradient header, visual client testimonials, and professional certifications. Perfect for business leaders.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><GraduationCap size={14} /> Resume</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1"><Heart size={14} /> Testimonials</span>
                </div>
                <button 
                  id="btn-preview-corporate"
                  onClick={() => onSelectCard('alexrivera')}
                  className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-sm text-center transition-all cursor-pointer"
                >
                  View Live Demo Card
                </button>
              </div>
            </div>

            {/* Developer Card Card */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col">
              <div className="p-6 bg-emerald-950 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-mono font-bold text-lg text-emerald-400">Dr. Sarah Chen</h4>
                  <p className="text-slate-400 text-xs font-mono">Staff AI Engineer</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider font-mono">
                  Developer
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-slate-600 leading-relaxed font-mono">
                  Tech-forward minimalist interface modeled after terminal systems. Employs brutalist square buttons, progressive skill charts, and Rust-inspired layouts.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Code2 size={14} /> Git Links</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> Terminal logs</span>
                </div>
                <button 
                  id="btn-preview-developer"
                  onClick={() => onSelectCard('sarahchen')}
                  className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-sm text-center transition-all font-mono cursor-pointer"
                >
                  view_live_demo();
                </button>
              </div>
            </div>

            {/* Luxury Card Card */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col">
              <div className="p-6 bg-amber-950/90 text-amber-50 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-lg text-amber-200">Elena Rostova</h4>
                  <p className="text-amber-300/70 text-xs">Editorial Photographer</p>
                </div>
                <div className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Luxury
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-slate-600 leading-relaxed">
                  High-fashion editorial presentation featuring immersive champagne glassmorphic cards, smooth scrolling layout, and integrated fine art galleries.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Star size={14} /> Gallery</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1"><HelpCircle size={14} /> Catalog</span>
                </div>
                <button 
                  id="btn-preview-photographer"
                  onClick={() => onSelectCard('elenarostova')}
                  className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-sm text-center transition-all cursor-pointer"
                >
                  View Live Demo Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white border-y border-slate-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Pricing Structure</span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mt-2">
              Transparent, Value-Driven Plans
            </h2>
            <p className="mt-4 text-slate-600">
              Pick the tier that fits your professional reach. Switch billing cycles anytime to unlock substantial discounts.
            </p>

            {/* Toggle Billing */}
            <div className="mt-10 inline-flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Yearly <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded-md uppercase">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {subscriptionPlans.map((plan, index) => {
              const isPopular = plan.popular;
              return (
                <div 
                  key={index}
                  className={`bg-white border rounded-3xl p-8 relative flex flex-col ${isPopular ? 'border-indigo-600 shadow-xl ring-2 ring-indigo-600/10' : 'border-slate-200 shadow-md'}`}
                >
                  {isPopular && (
                    <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-display font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed min-h-[40px]">{plan.description}</p>
                  
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-display font-black text-slate-900">{getPrice(plan.price)}</span>
                    <span className="text-slate-500 text-sm font-semibold">/ {billingCycle === 'yearly' && plan.price !== '$0' ? 'year' : plan.billing}</span>
                  </div>

                  <button 
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className={`mt-8 w-full font-bold py-3.5 px-4 rounded-xl text-center text-sm transition-all cursor-pointer ${isPopular ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 active:scale-98' : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-98'}`}
                  >
                    {plan.actionText}
                  </button>

                  <div className="h-px bg-slate-100 my-8"></div>

                  <ul className="flex flex-col gap-4 text-sm text-slate-600">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">User Stories</span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mt-2">
              Trusted by 10,000+ Founders
            </h2>
            <p className="mt-4 text-slate-600">
              Hear directly from designers, AI researchers, medical consultants, and agency operators who revolutionized their client onboarding funnel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "I completely stopped carrying paper business cards. Now I just hold my phone near my client's mobile screen and they have my portfolio, resume, and calendar linked in a single second. The response has been unbelievable!"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center font-bold text-indigo-700">DC</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Daniel Carter</h4>
                  <p className="text-slate-500 text-xs">SaaS Founder</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "We set up our entire consulting practice using CardNest's doctor template. Clients book scheduling slots instantly. Being able to track view spikes on our dashboard allows us to plan advertising perfectly."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-full overflow-hidden flex items-center justify-center font-bold text-rose-700">SC</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Dr. Sarah Chen</h4>
                  <p className="text-slate-500 text-xs">Lead AI Specialist</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "Integrating CardNest has boosted our agency sales by 25%. We printed dynamic QRs on physical acrylic tokens, and our sales representatives hand them out at major visual design exhibitions. Real premium layout!"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full overflow-hidden flex items-center justify-center font-bold text-emerald-700">ER</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Elena Rostova</h4>
                  <p className="text-slate-500 text-xs">Editorial Creative</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Got Questions?</span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {mockFAQs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div 
                  key={index} 
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 hover:bg-white transition-all duration-200"
                >
                  <button 
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full text-left px-6 py-5 font-bold text-slate-800 flex items-center justify-between gap-4 text-base sm:text-lg cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={20} className={`text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section className="bg-slate-950 text-white py-24 relative overflow-hidden z-10">
        {/* Glow blur details */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight">
            Ready to upgrade your professional first-impression?
          </h2>
          <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Create your fully customizable contactless profile card in less than 2 minutes. No technical experience or custom development required.
          </p>
          <div className="mt-10">
            <button 
              id="btn-footer-cta"
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="bg-white text-slate-950 font-bold px-8 py-4 rounded-xl text-base hover:bg-slate-100 transition-all shadow-xl shadow-white/10 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              Build Your Card Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-950 font-bold">
                <span className="text-base font-display font-black">C</span>
              </div>
              <span className="text-xl font-display font-extrabold text-white tracking-tight">CardNest</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Design-centric SaaS Digital Business Card platform empowering creative founders, medical experts, tech specialists, and executive leaders.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest text-[10px]">Product</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Platform features</a></li>
              <li><a href="#templates" className="hover:text-white transition-colors">Ready templates</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">SaaS pricing plans</a></li>
              <li><span className="text-slate-500 cursor-not-allowed">NFC Shop (Coming Soon)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest text-[10px]">Legal</h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">SLA & Refund Terms</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; 2026 CardNest. Built for high-performance SaaS showcases.</span>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-white transition-colors cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </footer>

      {/* Authentication & Simulation Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative border border-slate-200"
          >
            <button 
              id="btn-close-auth-modal"
              onClick={() => {
                setShowAuthModal(false);
                setAuthError(null);
                setRegPending(false);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={20} />
            </button>

            {regPending ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-display font-extrabold text-slate-900">
                  Registration Successful!
                </h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Your account <strong>{authEmail}</strong> has been registered and is currently awaiting administrator review and approval.
                </p>
                <p className="text-slate-500 text-xs mt-3 bg-slate-50 border border-slate-100 p-3 rounded-xl leading-relaxed">
                  You will be able to log in and start customizing your contactless business card as soon as an administrator verifies your account.
                </p>
                <button
                  id="btn-reg-pending-close"
                  onClick={() => {
                    setShowAuthModal(false);
                    setRegPending(false);
                    setAuthEmail('');
                    setAuthPassword('');
                    setAuthFullName('');
                  }}
                  className="mt-6 w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Understood
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-slate-950 text-white font-extrabold rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                    C
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-slate-900">
                    {authMode === 'login' ? 'Log in to CardNest' : 'Create Your Account'}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {authMode === 'login' ? 'Access your dashboard & analytics' : 'Start building premium interactive cards'}
                  </p>
                </div>

                {/* Real Connection Status Banner */}
                <div className="mb-4 flex items-center justify-center">
                  {isSupabaseConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Supabase Live Auth Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold rounded-full">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Secure Local Database Active (Sandbox)
                    </span>
                  )}
                </div>

                {/* Admin / Demo Credentials Helper */}
                <div className="mb-4 p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider">Default Admin Credentials</span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-100/70 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">Quick Auto-fill</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthEmail('admin@cardnest.com');
                      setAuthPassword('Krish2611');
                      setAuthError(null);
                    }}
                    className="w-full p-2 bg-white hover:bg-indigo-50/50 border border-indigo-200 rounded-xl text-left transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-indigo-400"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-indigo-950 text-xs">Chief Administrator</div>
                      <div className="text-[10px] text-indigo-600 font-bold font-mono">Select</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-slate-500 text-[11px] font-mono">
                      <span>admin@cardnest.com</span>
                      <span className="text-slate-400">Password: Krish2611</span>
                    </div>
                  </button>
                  <p className="text-[10px] text-slate-400 mt-2 text-center">
                    {isSupabaseConnected 
                      ? "Note: If using Live Supabase for the first time, sign up as admin@cardnest.com with password Krish2611 to create the admin account."
                      : "Clicking the box above will instantly load and pre-fill the Admin credentials."}
                  </p>
                </div>

                {/* Error Message Display */}
                {authError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-150 text-red-700 text-xs font-semibold rounded-xl text-center">
                    ⚠️ {authError}
                  </div>
                )}



                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Alex Rivera"
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-slate-50 text-slate-900 text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="alex.rivera@designco.io"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-slate-50 text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-slate-50 text-slate-900 text-sm"
                    />
                  </div>

                  <button 
                    type="submit"
                    id="btn-auth-submit"
                    disabled={authLoading}
                    className={`w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2 cursor-pointer transition-all flex items-center justify-center gap-2 ${authLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {authLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </>
                    ) : (
                      authMode === 'login' ? 'Log In' : 'Create Account'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                  {authMode === 'login' ? (
                    <span>Don't have an account? <button onClick={() => { setAuthMode('register'); setAuthError(null); }} className="font-bold text-indigo-600 hover:underline">Sign up</button></span>
                  ) : (
                    <span>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(null); }} className="font-bold text-indigo-600 hover:underline">Log in</button></span>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
