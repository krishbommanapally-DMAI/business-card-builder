/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Palette, Smartphone, User2, MessageSquare, Link, 
  BookOpen, QrCode, Eye, Check, RefreshCw, Plus, Trash2, Calendar, 
  MapPin, Clock, Star, Award, Code2, GraduationCap, Briefcase, Download, ShoppingBag
} from 'lucide-react';
import { DigitalCard, CardTheme, SocialLink, CustomButton, ServiceItem, ProductItem, SkillItem } from '../types';

interface CardBuilderProps {
  card: DigitalCard;
  onSave: (updatedCard: DigitalCard) => void;
  onBack: () => void;
}

export default function CardBuilder({ card, onSave, onBack }: CardBuilderProps) {
  const [activeTab, setActiveTab] = useState<'theme' | 'profile' | 'contact' | 'socials' | 'modules' | 'qr'>('profile');
  const [editedCard, setEditedCard] = useState<DigitalCard>({ ...card });
  const [saveToast, setSaveToast] = useState(false);

  // Quick State Setter helpers
  const updateCard = (updater: (draft: DigitalCard) => void) => {
    const draft = JSON.parse(JSON.stringify(editedCard)) as DigitalCard;
    updater(draft);
    setEditedCard(draft);
  };

  const handleSaveDraft = () => {
    onSave(editedCard);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Add social link helper
  const addSocialLink = () => {
    const newLink: SocialLink = { id: `sc-${Date.now()}`, platform: 'instagram', url: 'https://instagram.com' };
    updateCard(c => { c.socialLinks.push(newLink); });
  };

  // Delete social link
  const deleteSocialLink = (id: string) => {
    updateCard(c => { c.socialLinks = c.socialLinks.filter(l => l.id !== id); });
  };

  // Add service item
  const addServiceItem = () => {
    const newItem: ServiceItem = { id: `srv-${Date.now()}`, title: 'New Consultation Service', description: 'Describe your professional consulting deliverables.', icon: 'Sparkles' };
    updateCard(c => { c.services.push(newItem); });
  };

  // Delete service
  const deleteServiceItem = (id: string) => {
    updateCard(c => { c.services = c.services.filter(s => s.id !== id); });
  };

  // Add Product item
  const addProductItem = () => {
    const newItem: ProductItem = { id: `prd-${Date.now()}`, title: 'Digital Toolkit Pack', price: '$29', description: 'Downloadable design templates optimized for SaaS teams.', whatsappOrder: true };
    updateCard(c => { c.products.push(newItem); });
  };

  // Delete Product
  const deleteProductItem = (id: string) => {
    updateCard(c => { c.products = c.products.filter(p => p.id !== id); });
  };

  // Add skill progress bar
  const addSkillItem = () => {
    const newItem: SkillItem = { id: `sk-${Date.now()}`, name: 'New Technical Skill', percentage: 80, color: editedCard.theme.primaryColor };
    updateCard(c => { c.skills.push(newItem); });
  };

  // Delete skill
  const deleteSkillItem = (id: string) => {
    updateCard(c => { c.skills = c.skills.filter(s => s.id !== id); });
  };

  return (
    <div id="card-builder-workspace" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      
      {/* Top action control bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 h-20 flex items-center justify-between px-6 sm:px-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            id="btn-builder-back"
            onClick={onBack}
            className="p-2.5 hover:bg-slate-100 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Builder Studio</span>
            <h1 className="text-base sm:text-lg font-display font-bold text-slate-900 leading-tight">
              Designing: {editedCard.profile.firstName} {editedCard.profile.lastName}
            </h1>
          </div>
        </div>

        {/* Builder Status controls */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-slate-400 font-semibold font-mono">{window.location.host}/?card={editedCard.slug}</span>
          
          <button 
            id="btn-builder-save"
            onClick={handleSaveDraft}
            className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-slate-950/10 active:scale-95 transition-all cursor-pointer"
          >
            Save Changes
          </button>

          {saveToast && (
            <div className="fixed bottom-6 left-6 z-50 bg-slate-950 text-white font-bold py-3.5 px-5 rounded-2xl text-xs shadow-2xl flex items-center gap-2 border border-slate-800">
              <Check size={16} className="text-emerald-400" /> Saved business card successfully!
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
        
        {/* LEFT COLUMN: EDITOR TABS CONFIG */}
        <div className="w-full lg:w-3/5 bg-white border-r border-slate-200/50 flex flex-col h-full overflow-hidden">
          
          {/* Builder Mini Subheader tabs */}
          <div className="flex border-b border-slate-200/50 bg-slate-50/50 shrink-0 overflow-x-auto no-scrollbar">
            <button 
              id="builder-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-4 text-xs font-bold border-b-2 text-center transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'profile' ? 'border-slate-950 text-slate-950 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <span className="flex items-center justify-center gap-1.5"><User2 size={13} /> Hero & Bio</span>
            </button>
            <button 
              id="builder-tab-contact"
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-4 px-4 text-xs font-bold border-b-2 text-center transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'contact' ? 'border-slate-950 text-slate-950 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <span className="flex items-center justify-center gap-1.5"><MessageSquare size={13} /> Contacts</span>
            </button>
            <button 
              id="builder-tab-theme"
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-4 px-4 text-xs font-bold border-b-2 text-center transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'theme' ? 'border-slate-950 text-slate-950 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <span className="flex items-center justify-center gap-1.5"><Palette size={13} /> Custom Theme</span>
            </button>
            <button 
              id="builder-tab-socials"
              onClick={() => setActiveTab('socials')}
              className={`flex-1 py-4 px-4 text-xs font-bold border-b-2 text-center transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'socials' ? 'border-slate-950 text-slate-950 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <span className="flex items-center justify-center gap-1.5"><Link size={13} /> Social Links</span>
            </button>
            <button 
              id="builder-tab-modules"
              onClick={() => setActiveTab('modules')}
              className={`flex-1 py-4 px-4 text-xs font-bold border-b-2 text-center transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'modules' ? 'border-slate-950 text-slate-950 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <span className="flex items-center justify-center gap-1.5"><BookOpen size={13} /> Modules</span>
            </button>
            <button 
              id="builder-tab-qr"
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-4 px-4 text-xs font-bold border-b-2 text-center transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'qr' ? 'border-slate-950 text-slate-950 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <span className="flex items-center justify-center gap-1.5"><QrCode size={13} /> SEO & QR</span>
            </button>
          </div>

          {/* Tab content panel scrolling */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-8">
            
            {/* TAB: PROFILE & HERO */}
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Hero Section Type</h3>
                  <div className="grid grid-cols-4 gap-2.5">
                    {['gradient', 'solid', 'image', 'none'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => updateCard(c => { c.hero.type = t as any; })}
                        className={`p-3 text-xs font-bold border rounded-xl capitalize text-center transition-all ${editedCard.hero.type === t ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold' : 'border-slate-200 text-slate-500 hover:text-slate-700'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Gradient detail editor */}
                {editedCard.hero.type === 'gradient' && (
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Gradient Start</label>
                      <input 
                        type="color" 
                        value={editedCard.hero.gradientStart || '#000000'}
                        onChange={(e) => updateCard(c => { c.hero.gradientStart = e.target.value; })}
                        className="w-full h-10 border-0 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Gradient End</label>
                      <input 
                        type="color" 
                        value={editedCard.hero.gradientEnd || '#000000'}
                        onChange={(e) => updateCard(c => { c.hero.gradientEnd = e.target.value; })}
                        className="w-full h-10 border-0 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Profile Bio details */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Personal Description</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">First Name</label>
                      <input 
                        type="text" 
                        value={editedCard.profile.firstName}
                        onChange={(e) => updateCard(c => { c.profile.firstName = e.target.value; })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        value={editedCard.profile.lastName}
                        onChange={(e) => updateCard(c => { c.profile.lastName = e.target.value; })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950 font-medium"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Designation Role</label>
                    <input 
                      type="text" 
                      value={editedCard.profile.designation}
                      onChange={(e) => updateCard(c => { c.profile.designation = e.target.value; })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950 font-medium"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Company / Organization</label>
                    <input 
                      type="text" 
                      value={editedCard.profile.company}
                      onChange={(e) => updateCard(c => { c.profile.company = e.target.value; })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950 font-medium"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Catchy Tagline</label>
                    <input 
                      type="text" 
                      value={editedCard.profile.tagline}
                      onChange={(e) => updateCard(c => { c.profile.tagline = e.target.value; })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950 font-medium"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">About Bio Paragraph</label>
                    <textarea 
                      rows={3}
                      value={editedCard.profile.about}
                      onChange={(e) => updateCard(c => { c.profile.about = e.target.value; })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-indigo-600 text-slate-750 font-medium leading-normal"
                    />
                  </div>
                </div>

                {/* Avatar styling */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Avatar Image URL</h3>
                  <input 
                    type="text" 
                    value={editedCard.avatar.url}
                    onChange={(e) => updateCard(c => { c.avatar.url = e.target.value; })}
                    placeholder="https://unsplash.com/..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950 font-medium mb-4"
                  />
                  
                  <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Border Width</label>
                      <input 
                        type="number" 
                        value={editedCard.avatar.borderWidth}
                        onChange={(e) => updateCard(c => { c.avatar.borderWidth = parseInt(e.target.value) || 0; })}
                        className="w-full px-3 py-1.5 border border-slate-200 bg-white text-slate-950 rounded-xl text-center text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Border Color</label>
                      <input 
                        type="color" 
                        value={editedCard.avatar.borderColor}
                        onChange={(e) => updateCard(c => { c.avatar.borderColor = e.target.value; })}
                        className="w-full h-8 border-0 cursor-pointer rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Glow/Shadow</label>
                      <select 
                        value={editedCard.avatar.shadow}
                        onChange={(e) => updateCard(c => { c.avatar.shadow = e.target.value as any; })}
                        className="w-full px-2 py-1.5 border border-slate-200 bg-white text-slate-950 rounded-xl text-xs font-bold"
                      >
                        <option value="none">None</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                        <option value="glow">Glow Ring</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTACT CHANNELS */}
            {activeTab === 'contact' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Contact Action Channels</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Primary Mobile Number</label>
                      <input 
                        type="text" 
                        value={editedCard.contact.phone || ''}
                        onChange={(e) => updateCard(c => { c.contact.phone = e.target.value; })}
                        placeholder="+1 (555) 019-2831"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">WhatsApp Chat Link (with country code)</label>
                      <input 
                        type="text" 
                        value={editedCard.contact.whatsapp || ''}
                        onChange={(e) => updateCard(c => { c.contact.whatsapp = e.target.value; })}
                        placeholder="15550192831"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Email address</label>
                      <input 
                        type="email" 
                        value={editedCard.contact.email || ''}
                        onChange={(e) => updateCard(c => { c.contact.email = e.target.value; })}
                        placeholder="alex.rivera@designco.io"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Personal / Company Website</label>
                      <input 
                        type="text" 
                        value={editedCard.contact.website || ''}
                        onChange={(e) => updateCard(c => { c.contact.website = e.target.value; })}
                        placeholder="https://designco.io"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Office Location Address</label>
                      <input 
                        type="text" 
                        value={editedCard.contact.address || ''}
                        onChange={(e) => updateCard(c => { c.contact.address = e.target.value; })}
                        placeholder="500 Howard St, San Francisco, CA"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-600 text-slate-950"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: THEME CUSTOMIZATION */}
            {activeTab === 'theme' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Typography Pairings</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['Inter', 'Outfit', 'JetBrains Mono', 'Playfair Display'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => updateCard(c => { c.theme.fontFamily = f as any; })}
                        className={`p-3 text-xs border rounded-xl font-bold text-center transition-all ${editedCard.theme.fontFamily === f ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950' : 'border-slate-200 text-slate-500 hover:text-slate-700'}`}
                        style={{ fontFamily: f }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Primary Brand Colors</h3>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Primary Color</label>
                      <input 
                        type="color" 
                        value={editedCard.theme.primaryColor}
                        onChange={(e) => updateCard(c => { c.theme.primaryColor = e.target.value; })}
                        className="w-full h-10 border-0 cursor-pointer rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Secondary Accent</label>
                      <input 
                        type="color" 
                        value={editedCard.theme.secondaryColor}
                        onChange={(e) => updateCard(c => { c.theme.secondaryColor = e.target.value; })}
                        className="w-full h-10 border-0 cursor-pointer rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Dark mode switch */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Forced Dark Canvas theme</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Toggle complete high-contrast dark palette layout.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateCard(c => { c.theme.darkMode = !c.theme.darkMode; })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${editedCard.theme.darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${editedCard.theme.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                {/* Border Radius styling */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Card Border Roundness</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['none', 'sm', 'md', 'full'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => updateCard(c => { c.theme.borderRadius = r as any; })}
                        className={`p-2.5 text-xs font-bold border rounded-xl capitalize transition-all ${editedCard.theme.borderRadius === r ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold' : 'border-slate-200 text-slate-500 hover:text-slate-700'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SOCIAL LINKS */}
            {activeTab === 'socials' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">Configure Social Coordinates</h3>
                  <button 
                    type="button"
                    onClick={addSocialLink}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Social
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {editedCard.socialLinks.map((link, idx) => (
                    <div key={link.id} className="flex gap-2 bg-slate-50 p-4 border border-slate-200 rounded-2xl items-center">
                      <div className="w-1/3">
                        <label className="block text-[9px] font-bold text-slate-500 mb-1">Platform</label>
                        <select
                          value={link.platform}
                          onChange={(e) => updateCard(c => { c.socialLinks[idx].platform = e.target.value as any; })}
                          className="w-full p-2 border border-slate-200 bg-white text-slate-950 rounded-xl text-xs font-bold"
                        >
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="github">GitHub</option>
                          <option value="twitter">Twitter</option>
                          <option value="youtube">YouTube</option>
                          <option value="telegram">Telegram</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="block text-[9px] font-bold text-slate-500 mb-1">Target link URL</label>
                        <input 
                          type="text" 
                          value={link.url}
                          onChange={(e) => updateCard(c => { c.socialLinks[idx].url = e.target.value; })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-medium"
                        />
                      </div>

                      <button 
                        type="button"
                        onClick={() => deleteSocialLink(link.id)}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl border border-transparent hover:border-red-100 transition-all shrink-0 mt-4 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MODULES (SERVICES & PRODUCTS) */}
            {activeTab === 'modules' && (
              <div className="flex flex-col gap-8">
                
                {/* Services Block */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">My Portfolio Services</h3>
                    <button 
                      type="button"
                      onClick={addServiceItem}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Add Service
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {editedCard.services.map((srv, idx) => (
                      <div key={srv.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-indigo-700">Service item #{idx+1}</span>
                          <button 
                            type="button"
                            onClick={() => deleteServiceItem(srv.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 mb-1">Service Headline Title</label>
                          <input 
                            type="text" 
                            value={srv.title}
                            onChange={(e) => updateCard(c => { c.services[idx].title = e.target.value; })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 mb-1">Brief Description</label>
                          <textarea 
                            rows={2}
                            value={srv.description}
                            onChange={(e) => updateCard(c => { c.services[idx].description = e.target.value; })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-700 leading-normal"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products Block */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">E-Commerce Products</h3>
                    <button 
                      type="button"
                      onClick={addProductItem}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Add Product
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {editedCard.products.map((prd, idx) => (
                      <div key={prd.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-indigo-700">Product item #{idx+1}</span>
                          <button 
                            type="button"
                            onClick={() => deleteProductItem(prd.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Product Title</label>
                            <input 
                              type="text" 
                              value={prd.title}
                              onChange={(e) => updateCard(c => { c.products[idx].title = e.target.value; })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 mb-1">Pricing Label</label>
                            <input 
                              type="text" 
                              value={prd.price}
                              onChange={(e) => updateCard(c => { c.products[idx].price = e.target.value; })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-extrabold text-center"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 mb-1">Description</label>
                          <textarea 
                            rows={2}
                            value={prd.description}
                            onChange={(e) => updateCard(c => { c.products[idx].description = e.target.value; })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-700 leading-normal"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress bars skills */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">Metrics & Skills progress</h3>
                    <button 
                      type="button"
                      onClick={addSkillItem}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Add Skill
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {editedCard.skills.map((sk, idx) => (
                      <div key={sk.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-[9px] font-bold text-slate-500 mb-1">Skill Title</label>
                          <input 
                            type="text" 
                            value={sk.name}
                            onChange={(e) => updateCard(c => { c.skills[idx].name = e.target.value; })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-bold"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-[9px] font-bold text-slate-500 mb-1">Percentage %</label>
                          <input 
                            type="number" 
                            value={sk.percentage}
                            onChange={(e) => updateCard(c => { c.skills[idx].percentage = Math.min(100, parseInt(e.target.value) || 0); })}
                            className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-extrabold text-center"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => deleteSkillItem(sk.id)}
                          className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl border border-transparent hover:border-red-100 transition-all shrink-0 mt-4 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: SEO & QR CODE */}
            {activeTab === 'qr' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Unique Public Slug Link</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Card Slug URL Path</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200">
                      <span className="bg-slate-100 text-slate-500 px-3 py-2.5 text-xs font-semibold flex items-center border-r border-slate-200 whitespace-nowrap">
                        {window.location.host}/?card=
                      </span>
                      <input 
                        type="text" 
                        value={editedCard.slug}
                        onChange={(e) => updateCard(c => { c.slug = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''); })}
                        className="w-full px-4 py-2.5 bg-slate-50 focus:outline-none text-xs text-slate-950 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Meta Optimization SEO</h3>
                  <div className="flex flex-col gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">SEO Page Meta Title</label>
                      <input 
                        type="text" 
                        value={editedCard.seo.metaTitle}
                        onChange={(e) => updateCard(c => { c.seo.metaTitle = e.target.value; })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Search Keywords</label>
                      <input 
                        type="text" 
                        value={editedCard.seo.keywords}
                        onChange={(e) => updateCard(c => { c.seo.keywords = e.target.value; })}
                        placeholder="design consultant, ui token packages"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">QR Framing Texts</h3>
                  <div className="flex flex-col gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">QR Frame Style</label>
                      <select 
                        value={editedCard.qrCode.frameStyle}
                        onChange={(e) => updateCard(c => { c.qrCode.frameStyle = e.target.value as any; })}
                        className="w-full px-3 py-2 border border-slate-200 bg-white text-slate-950 rounded-xl text-xs font-bold"
                      >
                        <option value="none">None</option>
                        <option value="sleek">Sleek Frame</option>
                        <option value="accent">Double Border Frame</option>
                      </select>
                    </div>

                    {editedCard.qrCode.frameStyle !== 'none' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Frame Text Call-To-Action</label>
                        <input 
                          type="text" 
                          value={editedCard.qrCode.frameText || ''}
                          onChange={(e) => updateCard(c => { c.qrCode.frameText = e.target.value; })}
                          placeholder="SCAN MY CARD"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-950 font-bold uppercase"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: REALTIME PHONE PREVIEW */}
        <div className="hidden lg:flex lg:w-2/5 bg-slate-100 flex-col items-center justify-center p-8 overflow-y-auto h-full shrink-0 border-l border-slate-200 relative">
          
          <div className="sticky top-4 flex flex-col items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Smartphone size={13} /> Active Instant Preview
            </span>

            {/* Simulated Phone Shell container */}
            <div 
              style={{ fontFamily: editedCard.theme.fontFamily }}
              className={`w-72 h-[580px] rounded-[44px] p-3 shadow-2xl relative border-4 border-slate-900 shrink-0 transition-all ${editedCard.theme.darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}
            >
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center gap-1.5">
                <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
              </div>

              {/* Dynamic scrollable app body */}
              <div className={`w-full h-full rounded-[34px] overflow-y-auto overflow-x-hidden no-scrollbar text-left relative flex flex-col ${editedCard.theme.darkMode ? 'text-white bg-slate-950' : 'text-slate-800 bg-white'}`}>
                
                {/* Visual Hero header */}
                {editedCard.hero.enabled && editedCard.hero.type !== 'none' && (
                  <div 
                    style={{
                      height: '110px',
                      background: editedCard.hero.type === 'gradient' 
                        ? `linear-gradient(135deg, ${editedCard.hero.gradientStart || '#3B82F6'}, ${editedCard.hero.gradientEnd || '#1E3A8A'})`
                        : editedCard.hero.solidColor || editedCard.theme.primaryColor
                    }}
                    className="w-full shrink-0 relative flex items-center justify-center"
                  >
                    {editedCard.hero.type === 'image' && editedCard.hero.mediaUrl && (
                      <img src={editedCard.hero.mediaUrl} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
                    )}
                  </div>
                )}

                {/* Overlapping circular avatar */}
                <div className="flex flex-col items-center -mt-10 px-4 pb-4 shrink-0 text-center relative z-10">
                  <img 
                    src={editedCard.avatar.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"} 
                    style={{
                      borderWidth: `${editedCard.avatar.borderWidth}px`,
                      borderColor: editedCard.avatar.borderColor,
                      boxShadow: editedCard.avatar.shadow === 'glow' ? `0 0 15px ${editedCard.theme.primaryColor}` : '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}
                    className="w-20 h-20 rounded-full object-cover shadow-lg"
                    alt="profile"
                  />
                  <h4 className="font-bold text-sm mt-2 leading-tight">
                    {editedCard.profile.firstName} {editedCard.profile.lastName}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{editedCard.profile.designation}</p>
                  <p className="text-[9px] font-bold mt-0.5" style={{ color: editedCard.theme.primaryColor }}>
                    {editedCard.profile.company}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-2 italic px-3 max-w-xs truncate leading-normal">
                    "{editedCard.profile.tagline || 'Tagline placeholder'}"
                  </p>
                </div>

                {/* Action Contact buttons */}
                <div className="grid grid-cols-4 gap-1.5 px-4 shrink-0">
                  {editedCard.contact.phone && (
                    <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-xl flex flex-col items-center gap-1 text-center border dark:border-white/5">
                      <Smartphone size={13} className="text-slate-500" style={{ color: editedCard.theme.primaryColor }} />
                      <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300">Call</span>
                    </div>
                  )}
                  {editedCard.contact.whatsapp && (
                    <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-xl flex flex-col items-center gap-1 text-center border dark:border-white/5">
                      <MessageSquare size={13} className="text-slate-500" style={{ color: editedCard.theme.primaryColor }} />
                      <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300">Chat</span>
                    </div>
                  )}
                  {editedCard.contact.email && (
                    <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-xl flex flex-col items-center gap-1 text-center border dark:border-white/5">
                      <Link size={13} className="text-slate-500" style={{ color: editedCard.theme.primaryColor }} />
                      <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300">Email</span>
                    </div>
                  )}
                  <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-xl flex flex-col items-center gap-1 text-center border dark:border-white/5">
                    <Download size={13} className="text-slate-500" style={{ color: editedCard.theme.primaryColor }} />
                    <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300">vCard</span>
                  </div>
                </div>

                {/* Services list */}
                {editedCard.services.length > 0 && (
                  <div className="px-4 py-3 flex flex-col gap-2">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Services</span>
                    {editedCard.services.map((s) => (
                      <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border dark:border-white/5">
                        <h5 className="font-bold text-[10px] text-slate-800 dark:text-white leading-snug">{s.title}</h5>
                        <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">{s.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Products Grid list */}
                {editedCard.products.length > 0 && (
                  <div className="px-4 py-3 flex flex-col gap-2">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Store Products</span>
                    <div className="flex flex-col gap-2">
                      {editedCard.products.map((p) => (
                        <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border dark:border-white/5 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-[10px] text-slate-800 dark:text-white leading-snug truncate">{p.title}</h5>
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-normal truncate">{p.description}</p>
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-800 dark:text-indigo-400 bg-white dark:bg-white/10 px-2 py-1 rounded border dark:border-white/5">
                            {p.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {editedCard.skills.length > 0 && (
                  <div className="px-4 py-3 flex flex-col gap-2">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Technical Skills</span>
                    <div className="flex flex-col gap-2">
                      {editedCard.skills.map((s) => (
                        <div key={s.id}>
                          <div className="flex justify-between text-[9px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            <span>{s.name}</span>
                            <span>{s.percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ backgroundColor: editedCard.theme.primaryColor, width: `${s.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Public QR Teaser */}
                <div className="p-4 mt-auto">
                  <div className="bg-slate-50 dark:bg-white/5 border dark:border-white/5 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0">
                      <QrCode size={24} className="text-slate-900" />
                    </div>
                    <div>
                      <h6 className="font-bold text-[9px] text-slate-800 dark:text-white leading-tight">Interactive Scan QR</h6>
                      <p className="text-[8px] text-slate-500 leading-normal mt-0.5">Scans download vCard directly to contact rosters.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Public preview button */}
            <button 
              onClick={() => {
                onSave(editedCard);
                window.open(`${window.location.origin}/?card=${editedCard.slug}`, '_blank');
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
            >
              <Eye size={14} /> Open Live Business Card View
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
