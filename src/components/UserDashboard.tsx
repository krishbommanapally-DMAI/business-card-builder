/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, CreditCard, Layout, Settings, LogOut, Plus, Edit2, Eye, 
  Trash2, Copy, Check, Users, QrCode, HardDrive, ShieldCheck, 
  ChevronRight, Sparkles, Bell, Globe2, Laptop, Monitor, Database, X
} from 'lucide-react';
import { User, DigitalCard } from '../types';
import { mockCards, createInitialCard } from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabase';
import { QRCodeView } from './QRCodeView';

interface UserDashboardProps {
  user: User;
  cards: DigitalCard[];
  onLogout: () => void;
  onEditCard: (cardId: string) => void;
  onViewCard: (slug: string) => void;
  onAddCard: (newCard: DigitalCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function UserDashboard({ 
  user, 
  cards, 
  onLogout, 
  onEditCard, 
  onViewCard, 
  onAddCard, 
  onDeleteCard 
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'analytics' | 'subscription' | 'settings'>('overview');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedQrCard, setSelectedQrCard] = useState<DigitalCard | null>(null);
  const [editName, setEditName] = useState(user.fullName);
  const [editEmail, setEditEmail] = useState(user.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User notifications log
  const notifications = [
    { id: 'n1', text: 'Sarah Chen scanned your "alexrivera" card QR.', date: '3 hours ago' },
    { id: 'n2', text: 'Premium subscription renewed successfully.', date: '3 days ago' },
  ];

  // Copy / Share card link helper
  const handleCopyLink = async (slug: string) => {
    const card = cards.find(c => c.slug === slug);
    const link = `${window.location.origin}/${slug}`;
    const fullName = card ? `${card.profile?.firstName || ''} ${card.profile?.lastName || ''}`.trim() : 'Digital Card';

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} - Digital Business Card`,
          text: `Check out ${fullName}'s digital business card:`,
          url: link,
        });
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Creating a new card
  const handleCreateNewCard = () => {
    const slug = `user_${Math.random().toString(36).substr(2, 5)}`;
    const newCard = createInitialCard(user.id, slug);
    onAddCard(newCard);
    onEditCard(newCard.id);
  };

  // Calculate sum metrics
  const totalViews = cards.reduce((acc, c) => acc + c.analytics.views, 0);
  const totalScans = cards.reduce((acc, c) => acc + c.analytics.qrScans, 0);
  const totalClicks = cards.reduce((acc, c) => acc + c.analytics.clicks, 0);
  const totalDownloads = cards.reduce((acc, c) => acc + c.analytics.downloads, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    user.fullName = editName;
    user.email = editEmail;
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div id="user-dashboard" className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white text-slate-800 shrink-0 flex flex-col justify-between border-r border-slate-200/70">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white font-bold">
              <span className="text-base font-display font-black">C</span>
            </div>
            <span className="text-xl font-display font-extrabold text-slate-950 tracking-tight">CardNest</span>
          </div>

          {/* Database Connection Status Pill */}
          {isSupabaseConfigured ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold rounded-xl mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Supabase Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-xl mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              <span>Sandbox State</span>
            </div>
          )}

          {/* Mini User Tag */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-8 border border-slate-200/50">
            <img 
              src={user.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"} 
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
              alt="Avatar"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">{user.fullName}</h4>
              <span className="inline-flex items-center gap-1 text-[9px] bg-slate-900/10 border border-slate-950/15 text-slate-800 font-extrabold px-1.5 py-0.5 rounded-md mt-0.5 uppercase tracking-wide">
                {user.subscription.plan} Member
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 text-slate-500 font-semibold text-sm">
            <button 
              id="tab-btn-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <Layout size={18} /> Overview
            </button>
            <button 
              id="tab-btn-cards"
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'cards' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <CreditCard size={18} /> My Cards ({cards.length})
            </button>
            <button 
              id="tab-btn-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'analytics' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <BarChart3 size={18} /> Advanced Analytics
            </button>
            <button 
              id="tab-btn-subscription"
              onClick={() => setActiveTab('subscription')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'subscription' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <ShieldCheck size={18} /> Subscription Settings
            </button>
            <button 
              id="tab-btn-settings"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <Settings size={18} /> Profile Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button 
            id="btn-sidebar-logout"
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-50 hover:text-red-600 text-left text-slate-500 font-bold text-sm border border-transparent hover:border-red-100/50 transition-all cursor-pointer"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        
        {user.isVerified === false && (
          <div className="mb-6 p-5 bg-amber-50/75 border border-amber-200/60 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/25 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <h4 className="font-display font-extrabold text-slate-900 text-base">Account Verification Pending Approval</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Your registration is currently under administrator review. You are welcome to design and customize your contactless business card, but public visitors will be blocked from viewing your card slug until an administrator approves your account.
                </p>
              </div>
            </div>
            <span className="bg-amber-100 border border-amber-200/50 text-amber-800 font-extrabold px-3 py-1.5 rounded-xl text-[10px] tracking-wider uppercase shrink-0">
              Awaiting Verification
            </span>
          </div>
        )}

        {/* Header Block */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight mt-1">
              {activeTab === 'overview' && `Welcome Back, ${user.fullName}!`}
              {activeTab === 'cards' && 'Manage Your Digital Cards'}
              {activeTab === 'analytics' && 'Detailed Audience Insights'}
              {activeTab === 'subscription' && 'Subscription & Billings'}
              {activeTab === 'settings' && 'Account Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Create Card Button */}
            <button 
              id="btn-header-create-card"
              onClick={handleCreateNewCard}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-slate-950/10 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={15} /> Create Card
            </button>
          </div>
        </header>

        {/* Tab Content Rendering */}
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            {/* Simple stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <Eye size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Total Views</span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-slate-900">{totalViews}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <QrCode size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">QR Scans</span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-slate-900">{totalScans}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <HardDrive size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Storage Used</span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-slate-900">4.2 / 10 MB</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Active Plan</span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-indigo-700">{user.subscription.plan}</span>
                </div>
              </div>
            </div>

            {/* Core Cards Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left col: list of user cards */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-extrabold text-lg text-slate-900">My Cards ({cards.length})</h3>
                  <button onClick={() => setActiveTab('cards')} className="text-indigo-600 hover:underline text-xs font-bold flex items-center gap-0.5">
                    View All <ChevronRight size={14} />
                  </button>
                </div>

                {cards.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                    <span className="text-slate-400 font-semibold text-sm">No business cards created yet.</span>
                    <button onClick={handleCreateNewCard} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs mx-auto flex items-center gap-1 shadow-md">
                      <Plus size={14} /> Create Card Now
                    </button>
                  </div>
                ) : (
                  cards.map((card) => (
                    <div key={card.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <img 
                          src={card.avatar.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"} 
                          className="w-12 h-12 rounded-full object-cover border border-slate-100 shrink-0"
                          alt="avatar"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{card.profile.firstName} {card.profile.lastName}</h4>
                          <span className="text-xs text-slate-500 block truncate">{card.profile.designation}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{window.location.host}/{card.slug}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedQrCard(card)}
                          className="p-2 bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                          title="Get Scannable QR Code"
                        >
                          <QrCode size={16} />
                        </button>
                        <button 
                          onClick={() => onViewCard(card.slug)}
                          className="p-2 bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                          title="View Live Card"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => onEditCard(card.id)}
                          className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:text-indigo-950 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-1 font-bold text-xs cursor-pointer"
                          title="Edit Card"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button 
                          onClick={() => handleCopyLink(card.slug)}
                          className="p-2 bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                          title="Copy Public Link"
                        >
                          {copiedSlug === card.slug ? <Check className="text-emerald-500" size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right col: quick help, notification log & alerts */}
              <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-tr from-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-indigo-900/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl"></div>
                  <span className="inline-flex items-center gap-1 bg-white/10 text-indigo-300 font-extrabold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider mb-4 border border-white/5">
                    <Sparkles size={11} /> Platform Tip
                  </span>
                  <h4 className="font-display font-bold text-lg leading-snug">Connect NFC Tokens</h4>
                  <p className="text-xs text-indigo-200/80 mt-2 leading-relaxed">
                    Link your CardNest public URL directly to any physical NFC chip. When you hold your NFC keychain next to any smartphone, your business card launches instantly in their browser!
                  </p>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h4 className="font-display font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
                    <Bell size={16} className="text-slate-500" /> Recent Activity
                  </h4>
                  <div className="flex flex-col gap-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="text-xs pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                        <p className="text-slate-700 font-medium leading-relaxed">{notif.text}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY CARDS */}
        {activeTab === 'cards' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                You currently have {cards.length} cards. Your Premium plan supports unlimited interactive profiles.
              </p>
              <button 
                id="btn-cards-tab-create"
                onClick={handleCreateNewCard}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <Plus size={15} /> Create New Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card) => (
                <div key={card.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    {/* Header profile block */}
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={card.avatar.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-50"
                        alt="Avatar"
                      />
                      <div className="min-w-0">
                        <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider border mb-1 ${card.status === 'published' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                          {card.status}
                        </span>
                        <h3 className="font-display font-bold text-base text-slate-900 truncate">
                          {card.profile.firstName} {card.profile.lastName}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{card.profile.designation}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic mb-6">
                      "{card.profile.tagline || 'No custom tagline set.'}"
                    </p>

                    {/* Meta statistics counters */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center mb-6">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">VIEWS</span>
                        <span className="text-sm font-bold text-slate-800">{card.analytics.views}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">SCANS</span>
                        <span className="text-sm font-bold text-slate-800">{card.analytics.qrScans}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">CLICKS</span>
                        <span className="text-sm font-bold text-slate-800">{card.analytics.clicks}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => onEditCard(card.id)}
                      className="flex-1 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit2 size={14} /> Edit Builder
                    </button>
                    <button 
                      onClick={() => setSelectedQrCard(card)}
                      className="p-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                      title="Get QR Code"
                    >
                      <QrCode size={14} />
                    </button>
                    <button 
                      onClick={() => onViewCard(card.slug)}
                      className="p-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                      title="View Public Link"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={() => handleCopyLink(card.slug)}
                      className="p-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                      title="Copy Public Link"
                    >
                      {copiedSlug === card.slug ? <Check className="text-emerald-500" size={14} /> : <Copy size={14} />}
                    </button>
                    <button 
                      onClick={() => onDeleteCard(card.id)}
                      className="p-2.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl border border-transparent hover:border-red-100 transition-all cursor-pointer"
                      title="Delete Card"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADVANCED ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-8">
            {/* Quick counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Accumulated Views</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1 block">{totalViews}</span>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Dynamic Scans</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1 block">{totalScans}</span>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Button Clickthroughs</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1 block">{totalClicks}</span>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Asset Downloads</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1 block">{totalDownloads}</span>
              </div>
            </div>

            {/* Simulated analytics charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Detailed view logs map bar charts */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-base text-slate-900 mb-6">Views & Scans Timeline Log (Last 7 Days)</h3>
                
                {/* Visual Custom Chart Bar */}
                <div className="h-60 flex items-end justify-between gap-2.5 pt-4">
                  {cards[0]?.analytics.timeline.map((item, idx) => {
                    const viewsHeight = Math.min(100, (item.views / 300) * 100);
                    const scansHeight = Math.min(100, (item.scans / 100) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 bg-slate-950 text-white text-[9px] font-bold px-2 py-1 rounded-md mb-1 absolute -translate-y-28 transition-all pointer-events-none text-center shadow-lg z-10">
                          Views: {item.views} <br/> Scans: {item.scans}
                        </div>
                        <div className="w-full flex gap-1.5 items-end justify-center h-full">
                          <div 
                            style={{ height: `${viewsHeight}%` }}
                            className="w-4 bg-indigo-600 rounded-t-md hover:bg-indigo-500 transition-all shrink-0"
                          ></div>
                          <div 
                            style={{ height: `${scansHeight}%` }}
                            className="w-4 bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-all shrink-0"
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-1 block font-mono">{item.date}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 items-center justify-center mt-6 text-xs text-slate-500 font-semibold border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-indigo-600 inline-block"></span> Page Views</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500 inline-block"></span> QR Scans</span>
                </div>
              </div>

              {/* Geographic Country Distribution */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 mb-6">Traffic by Country</h3>
                  <div className="flex flex-col gap-4">
                    {cards[0]?.analytics.countries.map((c, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                          <span>{c.name}</span>
                          <span>{c.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full" 
                            style={{ width: `${c.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 text-center block mt-6 font-semibold">
                  Updating in real-time from server logs
                </span>
              </div>
            </div>

            {/* Devices & Browsers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Devices Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <h3 className="font-display font-bold text-base text-slate-900 mb-4 flex items-center gap-1.5">
                  <Laptop size={18} className="text-slate-500" /> Device Types
                </h3>
                <div className="flex items-center justify-between gap-6 pt-2">
                  <div className="flex flex-col gap-3 flex-1 text-xs">
                    <div className="flex justify-between font-bold border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500">Mobile (Taps)</span>
                      <span className="text-slate-900">72%</span>
                    </div>
                    <div className="flex justify-between font-bold border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500">Desktop</span>
                      <span className="text-slate-900">24%</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-500">Tablet</span>
                      <span className="text-slate-900">4%</span>
                    </div>
                  </div>

                  <div className="w-24 h-24 rounded-full border-8 border-indigo-600/10 relative flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Interactive</span>
                  </div>
                </div>
              </div>

              {/* Browsers Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <h3 className="font-display font-bold text-base text-slate-900 mb-4 flex items-center gap-1.5">
                  <Globe2 size={18} className="text-slate-500" /> Web Browsers
                </h3>
                <div className="flex items-center justify-between gap-6 pt-2">
                  <div className="flex flex-col gap-3 flex-1 text-xs">
                    <div className="flex justify-between font-bold border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500">Apple Safari</span>
                      <span className="text-slate-900">48%</span>
                    </div>
                    <div className="flex justify-between font-bold border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500">Google Chrome</span>
                      <span className="text-slate-900">38%</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-500">Firefox/Edge</span>
                      <span className="text-slate-900">14%</span>
                    </div>
                  </div>

                  <div className="w-24 h-24 rounded-full border-8 border-emerald-500/10 relative flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase text-center">Inbound</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUBSCRIPTION */}
        {activeTab === 'subscription' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Level</span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-indigo-700 mt-1">
                  CardNest {user.subscription.plan} Member
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Subscription automatic renews on: <strong>{user.subscription.expiresAt}</strong>
                </p>
              </div>

              <span className="inline-flex px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                ● STATUS: {user.subscription.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="border border-slate-200 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plan Billing</span>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-2 block">${user.subscription.price} <span className="text-xs text-slate-500 font-semibold">/ mo</span></span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-4 font-semibold">Standard monthly recurrence</span>
              </div>

              <div className="border border-slate-200 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Platform Cards</span>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-2 block">Unlimited</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-4 font-semibold">Create separate brand identities</span>
              </div>

              <div className="border border-slate-200 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Custom Domains</span>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-2 block">Enabled</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-4 font-semibold">card.yourname.com</span>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl text-slate-900 mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-display font-bold text-base text-indigo-950">Need Enterprise sync capabilities?</h4>
                <p className="text-xs text-indigo-800 mt-1 leading-normal">
                  Manage multiple team members, sync contact cards bulk blueprints, and export CSV lead lists automatically.
                </p>
              </div>

              <button className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs whitespace-nowrap shadow-md transition-all cursor-pointer">
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-4 mb-6">
              Edit Account Credentials
            </h3>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Legal Name</label>
                <input 
                  type="text" 
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-950 focus:outline-none focus:border-indigo-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email address</label>
                <input 
                  type="email" 
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-950 focus:outline-none focus:border-indigo-600 text-sm"
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit"
                  id="btn-save-settings"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Save Personal Profile
                </button>

                {saveSuccess && (
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                    <Check size={16} /> Profile changes saved!
                  </span>
                )}
              </div>
            </form>

            <div className="h-px bg-slate-100 my-8"></div>

            <div className="text-left bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
              <h4 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Database size={18} className="text-slate-700" /> Supabase Connection Status
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your application is configured to automatically synchronize cards with your Supabase database instance when environment keys are set. Make sure you set <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in the Settings/Secrets panel.
              </p>

              {isSupabaseConfigured ? (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  <div className="text-xs text-emerald-800 font-semibold">
                    Live Sync active: cards are being fetched and synchronized directly with your Supabase tables!
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  <div className="text-xs text-amber-800 font-semibold">
                    Sandbox State active: utilizing mock local storage database. Configure keys in settings to activate live tables.
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Required PostgreSQL SQL Table Schema</h5>
                <p className="text-xs text-slate-500 mb-3">Copy and run this statement inside your Supabase project's <strong>SQL Editor</strong> to create the <code>cards</code> table perfectly aligned with our app:</p>
                <pre className="p-4 bg-slate-950 text-slate-300 text-[10px] font-mono rounded-xl overflow-x-auto max-h-60 border border-slate-800 leading-normal">
{`CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  template_id TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Modular JSONB payloads for dynamic card widgets
  theme JSONB,
  hero JSONB,
  avatar JSONB,
  company_logo JSONB,
  profile JSONB,
  contact JSONB,
  social_links JSONB,
  custom_buttons JSONB,
  about JSONB,
  services JSONB,
  products JSONB,
  gallery JSONB,
  videos JSONB,
  testimonials JSONB,
  certificates JSONB,
  skills JSONB,
  education JSONB,
  experience JSONB,
  downloads JSONB,
  business_hours JSONB,
  qr_code JSONB,
  seo JSONB,
  analytics JSONB
);`}
                </pre>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-8"></div>

            <div className="text-left bg-red-50/40 border border-red-100 rounded-2xl p-6">
              <h4 className="font-display font-bold text-sm text-red-900">Danger Zone</h4>
              <p className="text-xs text-red-700 mt-1 leading-normal">
                Once you delete your account, your digital business cards will be archived and completely removed from CardNest servers forever. Scanners will receive a inactive page.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs mt-4 shadow-sm transition-all cursor-pointer">
                Archive & Delete Account
              </button>
            </div>
          </div>
        )}

      </main>

      {/* QR Code Popup Dialog Modal */}
      {selectedQrCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full relative border border-slate-200 text-center"
          >
            <button 
              onClick={() => setSelectedQrCard(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src={selectedQrCard.avatar?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                alt="Avatar"
              />
              <div className="text-left min-w-0">
                <h3 className="font-display font-extrabold text-sm text-slate-900 truncate">
                  {selectedQrCard.profile?.firstName} {selectedQrCard.profile?.lastName}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono block truncate">
                  {window.location.host}/{selectedQrCard.slug}
                </span>
              </div>
            </div>

            <div className="my-5 flex flex-col items-center justify-center">
              <QRCodeView 
                value={window.location.origin + '/' + selectedQrCard.slug}
                size={180}
                foregroundColor={selectedQrCard.qrCode?.foregroundColor || '#0f172a'}
                backgroundColor={selectedQrCard.qrCode?.backgroundColor || '#ffffff'}
                logoUrl={selectedQrCard.qrCode?.includeLogo ? (selectedQrCard.companyLogo?.url || selectedQrCard.avatar?.url) : undefined}
                showDownload={true}
                downloadFileName={`${selectedQrCard.slug}_qr.png`}
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-5">
              Scan with any smartphone camera to instantly view and save this digital business card!
            </p>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button 
                onClick={() => {
                  onViewCard(selectedQrCard.slug);
                  setSelectedQrCard(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Open Card View
              </button>
              <button 
                onClick={() => {
                  handleCopyLink(selectedQrCard.slug);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {copiedSlug === selectedQrCard.slug ? 'Copied Link!' : 'Copy Link'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
