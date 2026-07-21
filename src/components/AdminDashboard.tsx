/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, CreditCard, BarChart3, Settings, ShieldAlert, Search, 
  Trash2, ShieldCheck, Database, Sliders, LayoutGrid, Check, LogOut
} from 'lucide-react';
import { mockAdminStats } from '../data/mockData';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'plans' | 'cms'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState<any[]>(() => {
    const raw = localStorage.getItem('cardnest_local_users');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: any) => ({
            id: u.id,
            name: u.fullName || u.name || 'Anonymous User',
            email: u.email,
            role: u.role === 'super_admin' ? 'Super Admin' : 'Premium User',
            cards: u.id === 'user-001' ? 2 : u.id === 'user-002' ? 1 : 0,
            status: u.isVerified === false ? 'Pending Approval' : (u.subscription?.status === 'suspended' ? 'Suspended' : 'Active'),
            isVerified: u.isVerified !== false
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'user-001', name: 'Alex Rivera', email: 'alex.rivera@designco.io', role: 'Premium User', cards: 2, status: 'Active', isVerified: true },
      { id: 'user-002', name: 'Dr. Sarah Chen', email: 'dr.sarah.chen@medcare.org', role: 'Premium User', cards: 1, status: 'Active', isVerified: true },
      { id: 'user-free', name: 'Marcus Vance', email: 'marcus.vance@gmail.com', role: 'Free User', cards: 0, status: 'Active', isVerified: true }
    ];
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filtered Users list
  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Verify / Approve user account
  const handleVerifyUser = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        triggerToast(`User "${u.name}" account successfully verified & published!`);
        return { ...u, isVerified: true, status: 'Active' };
      }
      return u;
    }));

    const raw = localStorage.getItem('cardnest_local_users');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed)) {
          const updated = parsed.map((u: any) => {
            if (u.id === userId) {
              return { ...u, isVerified: true };
            }
            return u;
          });
          localStorage.setItem('cardnest_local_users', JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Toggle suspension state
  const handleToggleSuspend = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        triggerToast(`User "${u.name}" status updated to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));

    const raw = localStorage.getItem('cardnest_local_users');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed)) {
          const updated = parsed.map((u: any) => {
            if (u.id === userId) {
              const currentStatus = u.subscription?.status || 'active';
              return { 
                ...u, 
                subscription: { 
                  ...u.subscription, 
                  status: currentStatus === 'suspended' ? 'active' : 'suspended' 
                } 
              };
            }
            return u;
          });
          localStorage.setItem('cardnest_local_users', JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div id="admin-dashboard" className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white text-slate-800 shrink-0 flex flex-col justify-between border-r border-slate-200/70">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white font-bold">
              <span className="text-base font-display font-black">C</span>
            </div>
            <span className="text-xl font-display font-extrabold text-slate-950 tracking-tight">AdminNest</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl mb-8 border border-red-100">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              AD
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Platform SuperAdmin</h4>
              <span className="text-[9px] text-red-600 font-extrabold uppercase mt-0.5 block">Root Admin View</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 text-slate-500 font-semibold text-sm">
            <button 
              id="admin-tab-btn-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <BarChart3 size={18} /> Global Overview
            </button>
            <button 
              id="admin-tab-btn-users"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'users' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <Users size={18} /> User Directory
            </button>
            <button 
              id="admin-tab-btn-plans"
              onClick={() => setActiveTab('plans')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'plans' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <Sliders size={18} /> Plan Configurations
            </button>
            <button 
              id="admin-tab-btn-cms"
              onClick={() => setActiveTab('cms')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'cms' ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/10' : 'hover:bg-slate-50 hover:text-slate-950'}`}
            >
              <LayoutGrid size={18} /> Landing Page CMS
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button 
            id="btn-admin-logout"
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-50 hover:text-red-600 text-left text-slate-500 font-bold text-sm border border-transparent hover:border-red-100 transition-all cursor-pointer"
          >
            <LogOut size={18} /> Quit Admin View
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl relative">
        {/* Toast alerts */}
        {successMsg && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white font-bold py-3 px-5 rounded-2xl text-xs shadow-2xl flex items-center gap-2">
            <Check size={16} className="text-emerald-500" /> {successMsg}
          </div>
        )}

        <header className="mb-8 pb-6 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Administrative Control Hub</span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-1">
            {activeTab === 'overview' && 'Global Platforms Revenue & Audits'}
            {activeTab === 'users' && 'SaaS Member Management'}
            {activeTab === 'plans' && 'Tier Configs & Pricing Matrix'}
            {activeTab === 'cms' && 'Dynamic Landing Page CMS'}
          </h1>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            {/* Real Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Total Signups</span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-slate-900">{mockAdminStats.totalUsers}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Active Premium</span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-slate-900">{mockAdminStats.activePremiumUsers}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Monthly Revenue</span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-indigo-600">${mockAdminStats.totalRevenue}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <Database size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Storage Load</span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-slate-900">12.04 GB</span>
                </div>
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Revenue chart log */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-base text-slate-900 mb-6">Revenue Growth (Trailing 6 Months)</h3>
                
                {/* Visual Admin Revenue Chart */}
                <div className="h-60 flex items-end justify-between gap-4 pt-4">
                  {mockAdminStats.totalSubscriptions.map((item, idx) => {
                    const heightPct = (item.revenue / 10000) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                        <div className="opacity-0 group-hover:opacity-100 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-1 absolute -translate-y-28 transition-all pointer-events-none text-center">
                          Rev: ${item.revenue} <br/> Users: {item.users}
                        </div>
                        <div 
                          style={{ height: `${heightPct}%` }}
                          className="w-full bg-indigo-600 rounded-t-xl hover:bg-indigo-500 transition-all flex items-center justify-center text-[10px] text-white font-extrabold"
                        >
                          {heightPct > 20 && `$${Math.round(item.revenue/100)/10}k`}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-1 block">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Admin activity logs */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-base text-slate-900 mb-4">Platform Events Log</h3>
                <div className="flex flex-col gap-3.5">
                  {mockAdminStats.recentActivities.map((act) => (
                    <div key={act.id} className="text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <p className="text-slate-700 font-medium leading-relaxed">{act.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{act.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            {/* Search filter row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search user email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm bg-slate-50"
                />
              </div>

              <span className="text-xs font-semibold text-slate-500">
                Found {filteredUsers.length} total users matching queries
              </span>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-bold text-xs uppercase bg-slate-50">
                    <th className="p-4">Account Member</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Role Level</th>
                    <th className="p-4">Active Cards</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">{u.name}</td>
                      <td className="p-4 text-slate-600 font-mono text-xs">{u.email}</td>
                      <td className="p-4 font-semibold text-indigo-700">{u.role}</td>
                      <td className="p-4 font-semibold">{u.cards}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider border ${
                          u.status === 'Active' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                            : u.status === 'Pending Approval' 
                            ? 'bg-amber-50 border-amber-100 text-amber-700 font-extrabold' 
                            : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        {u.status === 'Pending Approval' ? (
                          <button 
                            id={`btn-approve-user-${u.id}`}
                            onClick={() => handleVerifyUser(u.id)}
                            title="Verify & Publish Account"
                            className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <ShieldCheck size={14} />
                            <span>Verify User</span>
                          </button>
                        ) : (
                          <button 
                            id={`btn-suspend-user-${u.id}`}
                            onClick={() => handleToggleSuspend(u.id)}
                            title={u.status === 'Active' ? "Suspend Account" : "Activate Account"}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              u.status === 'Active' 
                                ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100' 
                                : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'Active' ? <ShieldAlert size={15} /> : <ShieldCheck size={15} />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PLANS CONFIGS */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-900 mb-4 border-b border-slate-100 pb-3">
                Edit Subscription Rates
              </h3>
              
              <div className="flex flex-col gap-4 text-sm font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Free Tier</span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-800">$0 / Month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Basic Tier</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="9" className="w-16 px-2.5 py-1.5 border border-slate-200 rounded-lg text-center bg-slate-50 text-slate-950 font-bold" />
                    <span className="text-slate-500">/ mo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Premium Tier</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="19" className="w-16 px-2.5 py-1.5 border border-slate-200 rounded-lg text-center bg-slate-50 text-slate-950 font-bold" />
                    <span className="text-slate-500">/ mo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Enterprise Tier</span>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="99" className="w-16 px-2.5 py-1.5 border border-slate-200 rounded-lg text-center bg-slate-50 text-slate-950 font-bold" />
                    <span className="text-slate-500">/ mo</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => triggerToast('Subscription pricing matrix successfully saved')}
                className="mt-6 w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              >
                Sync Tier Configurations
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-900 mb-4 border-b border-slate-100 pb-3">
                General Settings & Cloud Sizing
              </h3>
              <div className="flex flex-col gap-4 text-xs font-bold text-slate-600">
                <div>
                  <label className="block mb-1.5 text-slate-500">Inbound File Size Limit (MB)</label>
                  <input type="text" defaultValue="10" className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-950 rounded-xl" />
                </div>
                <div>
                  <label className="block mb-1.5 text-slate-500">Global Storage Warning Limit (GB)</label>
                  <input type="text" defaultValue="500" className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-950 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CMS LANDING PAGE */}
        {activeTab === 'cms' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl">
            <h3 className="font-display font-bold text-base text-slate-900 mb-6 border-b border-slate-100 pb-3">
              Hero & Features Headline Content
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Hero Title Headline</label>
                <input 
                  type="text" 
                  defaultValue="The Digital Business Card Built for High-Performers" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Hero Subtitle Paragraph</label>
                <textarea 
                  rows={3} 
                  defaultValue="Create stunning contactless business cards embedded with rich galleries, dynamic custom links, appointment schedulers, services, and live analytics. Print or scan instantly with custom dynamic QR codes."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 leading-normal"
                />
              </div>

              <button 
                onClick={() => triggerToast('CMS Homepage headlines sync completed')}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Sync Homepage CMS
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
