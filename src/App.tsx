/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import CardBuilder from './components/CardBuilder';
import PublicCardView from './components/PublicCardView';
import { User, DigitalCard } from './types';
import { mockUsers, mockCards } from './data/mockData';
import { isSupabaseConfigured, dbFetchCards, dbSaveCard, dbDeleteCard, supabase } from './lib/supabase';

export default function App() {
  // Navigation View State: 'landing' | 'dashboard' | 'admin' | 'builder' | 'public'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'admin' | 'builder' | 'public'>('landing');
  
  // Database States
  const [cards, setCards] = useState<DigitalCard[]>(mockCards);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbLoading, setDbLoading] = useState<boolean>(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Specific card focuses
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [activeCardSlug, setActiveCardSlug] = useState<string | null>(null);

  // Initialize demo accounts in localStorage if not exists (for seamless local sandbox auth)
  useEffect(() => {
    const existing = localStorage.getItem('cardnest_local_users');
    if (!existing) {
      const initialUsers = [
        {
          id: 'user-001',
          email: 'alex.rivera@designco.io',
          password: 'password123',
          fullName: 'Alex Rivera',
          role: 'premium_user',
          subscription: {
            plan: 'Premium',
            status: 'active',
            expiresAt: '2029-12-31',
            price: 19
          },
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          joinedAt: '2026-03-12'
        },
        {
          id: 'user-002',
          email: 'dr.sarah.chen@medcare.org',
          password: 'password123',
          fullName: 'Dr. Sarah Chen',
          role: 'premium_user',
          subscription: {
            plan: 'Premium',
            status: 'active',
            expiresAt: '2026-12-15',
            price: 19
          },
          avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
          joinedAt: '2026-05-01'
        },
        {
          id: 'user-admin',
          email: 'admin@cardnest.com',
          password: 'admin',
          fullName: 'Chief Admin',
          role: 'super_admin',
          subscription: {
            plan: 'Enterprise',
            status: 'active',
            expiresAt: '2099-12-31',
            price: 0
          },
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          joinedAt: '2026-01-01'
        }
      ];
      localStorage.setItem('cardnest_local_users', JSON.stringify(initialUsers));
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    async function checkSession() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const sbUser = session.user;
            const mappedUser: User = {
              id: sbUser.id,
              email: sbUser.email || '',
              fullName: sbUser.user_metadata?.fullName || sbUser.user_metadata?.full_name || 'New User',
              role: sbUser.email === 'admin@cardnest.com' ? 'super_admin' : 'premium_user',
              subscription: {
                plan: 'Premium',
                status: 'active',
                expiresAt: '2029-12-31',
                price: 19
              },
              joinedAt: sbUser.created_at || new Date().toISOString()
            };
            setCurrentUser(mappedUser);
            if (mappedUser.role === 'super_admin') {
              setCurrentView('admin');
            } else {
              setCurrentView('dashboard');
            }
          }
        } catch (err) {
          console.error('Error fetching Supabase session:', err);
        }
      } else {
        const savedUser = localStorage.getItem('cardnest_current_user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setCurrentUser(parsedUser);
            if (parsedUser.role === 'super_admin') {
              setCurrentView('admin');
            } else {
              setCurrentView('dashboard');
            }
          } catch (e) {
            console.error('Error loading saved local user:', e);
          }
        }
      }
    }

    checkSession();
  }, []);

  // Sync Supabase cards on initialization
  useEffect(() => {
    async function loadCards() {
      if (!isSupabaseConfigured) return;
      
      setDbLoading(true);
      try {
        const fetched = await dbFetchCards();
        if (fetched && fetched.length > 0) {
          setCards(fetched);
        } else {
          // If database is empty, seed with initial mock data so the app has high-fidelity records on first launch
          console.log('Seeding Supabase database with default digital business cards...');
          for (const card of mockCards) {
            await dbSaveCard(card);
          }
          const seeded = await dbFetchCards();
          if (seeded && seeded.length > 0) {
            setCards(seeded);
          }
        }
        setDbError(null);
      } catch (err: any) {
        setDbError(err.message || 'Failed to sync with Supabase tables.');
      } finally {
        setDbLoading(false);
      }
    }
    
    loadCards();
  }, []);

  // Parse path on mount to allow deep-linking (e.g. /alexrivera)
  useEffect(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path) {
      // Find matching card in memory
      const matched = cards.find(c => c.slug.toLowerCase() === path.toLowerCase());
      if (matched) {
        setActiveCardSlug(matched.slug);
        setCurrentView('public');
      }
    }
  }, [cards]);

  // Handle real login authentication (Supabase or local storage fallback)
  const onRealLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        if (data.user) {
          const sbUser = data.user;
          const mappedUser: User = {
            id: sbUser.id,
            email: sbUser.email || '',
            fullName: sbUser.user_metadata?.fullName || sbUser.user_metadata?.full_name || 'New User',
            role: sbUser.email === 'admin@cardnest.com' ? 'super_admin' : 'premium_user',
            subscription: {
              plan: 'Premium',
              status: 'active',
              expiresAt: '2029-12-31',
              price: 19
            },
            joinedAt: sbUser.created_at || new Date().toISOString()
          };
          setCurrentUser(mappedUser);
          localStorage.setItem('cardnest_current_user', JSON.stringify(mappedUser));
          if (mappedUser.role === 'super_admin') {
            setCurrentView('admin');
          } else {
            setCurrentView('dashboard');
          }
          return { success: true };
        }
        return { success: false, error: 'User login session not found.' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed.' };
      }
    } else {
      // LocalStorage Mode
      const localUsersRaw = localStorage.getItem('cardnest_local_users');
      const users = localUsersRaw ? JSON.parse(localUsersRaw) : [];
      const matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (matched) {
        const { password: _, ...userWithoutPassword } = matched;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('cardnest_current_user', JSON.stringify(userWithoutPassword));
        if (matched.role === 'super_admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('dashboard');
        }
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password. Verify details and try again.' };
      }
    }
  };

  // Handle real registration (Supabase or local storage fallback)
  const onRealRegister = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullName: fullName,
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          const sbUser = data.user;
          const mappedUser: User = {
            id: sbUser.id,
            email: sbUser.email || '',
            fullName: fullName,
            role: sbUser.email === 'admin@cardnest.com' ? 'super_admin' : 'premium_user',
            subscription: {
              plan: 'Premium',
              status: 'active',
              expiresAt: '2029-12-31',
              price: 19
            },
            joinedAt: sbUser.created_at || new Date().toISOString()
          };
          setCurrentUser(mappedUser);
          localStorage.setItem('cardnest_current_user', JSON.stringify(mappedUser));
          setCurrentView('dashboard');
          return { success: true };
        }
        return { success: false, error: 'Registration succeeded, waiting for user session.' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed.' };
      }
    } else {
      // LocalStorage Mode
      const localUsersRaw = localStorage.getItem('cardnest_local_users');
      const users = localUsersRaw ? JSON.parse(localUsersRaw) : [];
      
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'This email is already registered.' };
      }
      
      // Determine if they match one of our seeded mock card user IDs to let them inherit the mock card data
      let userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      let avatarUrl = undefined;
      if (email.toLowerCase() === 'alex.rivera@designco.io') {
        userId = 'user-001';
        avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      } else if (email.toLowerCase() === 'dr.sarah.chen@medcare.org') {
        userId = 'user-002';
        avatarUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80';
      } else if (email.toLowerCase() === 'admin@cardnest.com') {
        userId = 'user-admin';
        avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
      }

      const newUser = {
        id: userId,
        email: email,
        password: password,
        fullName: fullName,
        role: email === 'admin@cardnest.com' ? 'super_admin' : 'premium_user',
        subscription: {
          plan: email === 'admin@cardnest.com' ? 'Enterprise' : 'Premium',
          status: 'active',
          expiresAt: email === 'admin@cardnest.com' ? '2099-12-31' : '2029-12-31',
          price: email === 'admin@cardnest.com' ? 0 : 19
        },
        avatarUrl,
        joinedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('cardnest_local_users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('cardnest_current_user', JSON.stringify(userWithoutPassword));
      setCurrentView('dashboard');
      return { success: true };
    }
  };

  // Logout routine
  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out of Supabase:', err);
      }
    }
    localStorage.removeItem('cardnest_current_user');
    setCurrentUser(null);
    setCurrentView('landing');
    setActiveCardId(null);
    setActiveCardSlug(null);
  };

  // Open card in visual builder
  const handleEditCard = (cardId: string) => {
    setActiveCardId(cardId);
    setCurrentView('builder');
  };

  // Direct viewport to public view
  const handleViewCard = (slug: string) => {
    setActiveCardSlug(slug);
    setCurrentView('public');
  };

  // Saving updated card from builder
  const handleSaveCardInBuilder = async (updatedCard: DigitalCard) => {
    // Optimistic state update
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    
    if (isSupabaseConfigured) {
      try {
        await dbSaveCard(updatedCard);
      } catch (err: any) {
        console.error('Failed to sync updated card to Supabase:', err);
        setDbError(`Save error: ${err.message || err}`);
      }
    }
  };

  // Add new card
  const handleAddCard = async (newCard: DigitalCard) => {
    setCards(prev => [newCard, ...prev]);
    
    if (isSupabaseConfigured) {
      try {
        await dbSaveCard(newCard);
      } catch (err: any) {
        console.error('Failed to sync new card to Supabase:', err);
        setDbError(`Creation error: ${err.message || err}`);
      }
    }
  };

  // Delete card
  const handleDeleteCard = async (cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    
    if (isSupabaseConfigured) {
      try {
        await dbDeleteCard(cardId);
      } catch (err: any) {
        console.error('Failed to delete card from Supabase:', err);
        setDbError(`Deletion error: ${err.message || err}`);
      }
    }
  };

  // Gather appropriate user cards
  const userCards = currentUser ? cards.filter(c => c.userId === currentUser.id) : [];
  
  // Focus card for previewing/building
  const activeBuilderCard = cards.find(c => c.id === activeCardId);
  const activePublicCard = cards.find(c => c.slug === activeCardSlug);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 1. Landing Webpage */}
      {currentView === 'landing' && (
        <LandingPage 
          onRealLogin={onRealLogin} 
          onRealRegister={onRealRegister} 
          onSelectCard={handleViewCard}
          isSupabaseConnected={isSupabaseConfigured}
        />
      )}

      {/* 2. User Workspace Panel */}
      {currentView === 'dashboard' && currentUser && (
        <UserDashboard 
          user={currentUser}
          cards={userCards}
          onLogout={handleLogout}
          onEditCard={handleEditCard}
          onViewCard={handleViewCard}
          onAddCard={handleAddCard}
          onDeleteCard={handleDeleteCard}
        />
      )}

      {/* 3. Platform Admin Control Hub */}
      {currentView === 'admin' && (
        <AdminDashboard 
          onLogout={handleLogout} 
        />
      )}

      {/* 4. Instant Card Builder */}
      {currentView === 'builder' && activeBuilderCard && (
        <CardBuilder 
          card={activeBuilderCard}
          onSave={handleSaveCardInBuilder}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {/* 5. Direct Public Business Card View */}
      {currentView === 'public' && activePublicCard && (
        <PublicCardView 
          card={activePublicCard}
          onBackToDashboard={() => {
            if (currentUser) {
              if (currentUser.role === 'super_admin') {
                setCurrentView('admin');
              } else {
                setCurrentView('dashboard');
              }
            } else {
              setCurrentView('landing');
            }
          }}
        />
      )}

    </div>
  );
}

