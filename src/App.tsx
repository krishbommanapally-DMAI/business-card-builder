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
import { isSupabaseConfigured, dbFetchCards, dbFetchCardBySlug, dbSaveCard, dbDeleteCard, supabase } from './lib/supabase';

export default function App() {
  // Navigation View State: 'landing' | 'dashboard' | 'admin' | 'builder' | 'public'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'admin' | 'builder' | 'public'>('landing');
  
  // Database States
  const [cards, setCards] = useState<DigitalCard[]>(() => {
    const localCardsRaw = localStorage.getItem('cardnest_local_cards');
    if (localCardsRaw) {
      try {
        const parsed = JSON.parse(localCardsRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing local cards:', e);
      }
    }
    return mockCards;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbLoading, setDbLoading] = useState<boolean>(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [publicCardError, setPublicCardError] = useState<string | null>(null);
  const [authWarning, setAuthWarning] = useState<string | null>(null);
  
  // Specific card focuses
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [activeCardSlug, setActiveCardSlug] = useState<string | null>(null);

  // Helper to parse deep link slug from URL path, query or hash
  const getSlugFromUrl = () => {
    // 1. Check query parameters first (e.g. ?card=krishna or ?slug=krishna)
    const params = new URLSearchParams(window.location.search);
    const querySlug = params.get('card') || params.get('slug') || params.get('u') || params.get('id');
    if (querySlug) return querySlug;

    // 2. Check hash (e.g. #/krishna or #krishna)
    const hash = window.location.hash;
    if (hash) {
      const hashSlug = hash.replace(/^#\/?/, '');
      if (hashSlug && !hashSlug.includes('=')) { // Ensure it's not a query-like hash
        return hashSlug;
      }
    }

    // 3. Fallback to pathname (e.g. /krishna)
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path && path !== 'index.html' && !path.includes('.') && !path.startsWith('api/')) {
      return path;
    }

    return null;
  };

  // Initialize default Admin user in localStorage if not exists (for seamless local sandbox auth)
  useEffect(() => {
    let usersList = [];
    const existing = localStorage.getItem('cardnest_local_users');
    if (existing) {
      try {
        usersList = JSON.parse(existing);
      } catch (e) {
        console.error('Error parsing cardnest_local_users:', e);
        usersList = [];
      }
    }
    
    if (!Array.isArray(usersList)) {
      usersList = [];
    }
    
    // Check if the required Admin user exists, or seed it
    const adminIndex = usersList.findIndex((u: any) => (u.email && u.email.toLowerCase() === 'admin@cardnest.com') || (u.username && u.username.toLowerCase() === 'admin'));
    const adminUser = {
      id: 'user-admin',
      email: 'admin@cardnest.com',
      username: 'Admin',
      password: 'Krish2611',
      fullName: 'Chief Admin',
      role: 'super_admin' as const,
      isVerified: true,
      subscription: {
        plan: 'Enterprise' as const,
        status: 'active' as const,
        expiresAt: '2099-12-31',
        price: 0
      },
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      joinedAt: '2026-01-01'
    };

    if (adminIndex >= 0) {
      usersList[adminIndex].password = 'Krish2611';
      usersList[adminIndex].email = 'admin@cardnest.com';
      usersList[adminIndex].username = 'Admin';
      usersList[adminIndex].role = 'super_admin';
      usersList[adminIndex].isVerified = true;
    } else {
      usersList.push(adminUser);
    }

    localStorage.setItem('cardnest_local_users', JSON.stringify(usersList));
  }, []);

  // Restore session on mount to keep users logged in across page refreshes
  useEffect(() => {
    async function checkSession() {
      // 1. First check if we have a locally saved user in localStorage
      const savedUser = localStorage.getItem('cardnest_current_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setCurrentUser(parsedUser);
          
          // Only redirect to admin/dashboard if we are NOT on a public deep-link page
          const targetSlug = getSlugFromUrl();
          if (!targetSlug) {
            if (parsedUser.role === 'super_admin') {
              setCurrentView('admin');
            } else {
              setCurrentView('dashboard');
            }
          }
          return; // Session successfully restored from local state
        } catch (e) {
          console.error('Error loading saved local user:', e);
        }
      }

      // 2. If Supabase is configured, check Supabase session as well
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
            localStorage.setItem('cardnest_current_user', JSON.stringify(mappedUser));
            
            // Only redirect to admin/dashboard if we are NOT on a public deep-link page
            const targetSlug = getSlugFromUrl();
            if (!targetSlug) {
              if (mappedUser.role === 'super_admin') {
                setCurrentView('admin');
              } else {
                setCurrentView('dashboard');
              }
            }
          }
        } catch (err) {
          console.error('Error fetching Supabase session:', err);
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
        // Retrieve current local cards from localStorage
        const localCardsRaw = localStorage.getItem('cardnest_local_cards');
        let localCards: DigitalCard[] = [];
        if (localCardsRaw) {
          try {
            localCards = JSON.parse(localCardsRaw);
          } catch (e) {
            console.error('Error parsing local cards:', e);
          }
        }

        const fetched = await dbFetchCards() || [];
        
        if (localCards.length > 0) {
          console.log(`Syncing/updating ${localCards.length} local cards in Supabase database...`);
          // Sync all local cards to database to ensure full schema alignment
          for (const card of localCards) {
            try {
              await dbSaveCard(card);
            } catch (saveErr) {
              console.error(`Auto-sync failed for card ${card.id}:`, saveErr);
            }
          }
          
          // Re-fetch clean populated data from Supabase
          const updatedFetched = await dbFetchCards();
          if (updatedFetched && updatedFetched.length > 0) {
            setCards(updatedFetched);
            localStorage.setItem('cardnest_local_cards', JSON.stringify(updatedFetched));
          }
        } else if (fetched.length > 0) {
          setCards(fetched);
          localStorage.setItem('cardnest_local_cards', JSON.stringify(fetched));
        } else {
          // If both database and local storage are empty, seed with default mock data if authenticated
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            console.log('Seeding Supabase database with default digital business cards...');
            for (const card of mockCards) {
              try {
                await dbSaveCard(card);
              } catch (saveErr) {
                console.error(`Auto-sync seed failed for card ${card.id}:`, saveErr);
              }
            }
            const seeded = await dbFetchCards();
            if (seeded && seeded.length > 0) {
              setCards(seeded);
              localStorage.setItem('cardnest_local_cards', JSON.stringify(seeded));
            }
          }
        }
        


        setDbError(null);
      } catch (err: any) {
        // Silently catch unauthenticated listing errors as guests might not have full select list access
        console.warn('Syncing/listing cards from Supabase failed or was restricted:', err.message);
      } finally {
        setDbLoading(false);
      }
    }
    
    loadCards();
  }, []);

  // Parse path, query, or hash on mount/URL change to allow robust deep-linking without 404 errors
  useEffect(() => {
    const targetSlug = getSlugFromUrl();
    if (targetSlug) {
      setActiveCardSlug(targetSlug);
      setCurrentView('public');
    }
  }, []); // Run on mount to catch deep linking before any user interaction

  // Fetch live target card from Supabase whenever activeCardSlug changes or on mount
  useEffect(() => {
    async function fetchPublicCard() {
      if (!activeCardSlug) return;
      
      setPublicCardError(null);
      
      if (!isSupabaseConfigured) {
        // If Supabase is not configured, we look in local storage cards
        const localFound = cards.find(c => c.slug.toLowerCase() === activeCardSlug.toLowerCase());
        if (!localFound) {
          setPublicCardError(
            `Database Connection Missing: Supabase is NOT configured in this environment.\n\n` +
            `Since the cloud database is disconnected, the app fell back to Local Sandbox mode. ` +
            `A guest user's local storage is empty, so card "${activeCardSlug}" could not be found.\n\n` +
            `💡 HOW TO FIX: You must add "VITE_SUPABASE_URL" and "VITE_SUPABASE_ANON_KEY" to your deployment environment variables (e.g., in your Vercel project settings or .env file) to connect your live Supabase database.`
          );
        }
        return;
      }
      
      try {
        const fetchedCard = await dbFetchCardBySlug(activeCardSlug);
        if (fetchedCard) {
          setCards(prev => {
            const filtered = prev.filter(c => c.id !== fetchedCard.id && c.slug.toLowerCase() !== fetchedCard.slug.toLowerCase());
            const updated = [fetchedCard, ...filtered];
            localStorage.setItem('cardnest_local_cards', JSON.stringify(updated));
            return updated;
          });
        } else {
          setPublicCardError(`Card not found. No digital business card with slug "${activeCardSlug}" was found in your Supabase "cards" table.`);
        }
      } catch (err: any) {
        console.error(`Failed to load target card "${activeCardSlug}" directly:`, err);
        setPublicCardError(err.message || String(err));
      }
    }
    
    fetchPublicCard();
  }, [activeCardSlug, isSupabaseConfigured]);

  // Synchronize browser address bar with the current application view / slug
  useEffect(() => {
    if (currentView === 'public' && activeCardSlug) {
      const targetPath = `/${activeCardSlug.toLowerCase()}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    } else {
      if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [currentView, activeCardSlug]);

  // Handle real login authentication (Supabase or local storage fallback)
  const onRealLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          return { success: false, error: error.message || JSON.stringify(error) };
        }
        
        if (data.user) {
          const sbUser = data.user;
          const mappedUser: User = {
            id: sbUser.id,
            email: sbUser.email || '',
            fullName: sbUser.user_metadata?.fullName || sbUser.user_metadata?.full_name || 'New User',
            role: (sbUser.email === 'admin@cardnest.com' || sbUser.user_metadata?.role === 'super_admin' || sbUser.user_metadata?.role === 'admin') ? 'super_admin' : 'premium_user',
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
        const errMsg = err && typeof err === 'object'
          ? (err.message || err.error_description || JSON.stringify(err))
          : String(err);
        return { success: false, error: errMsg || 'Login failed.' };
      }
    } else {
      // LocalStorage Mode
      let users = [];
      const localUsersRaw = localStorage.getItem('cardnest_local_users');
      if (localUsersRaw) {
        try {
          users = JSON.parse(localUsersRaw);
        } catch (e) {
          console.error('Error parsing cardnest_local_users:', e);
          users = [];
        }
      }
      
      const matched = users.find((u: any) => 
        ((u.email && u.email.toLowerCase() === email.toLowerCase()) || (u.username && u.username.toLowerCase() === email.toLowerCase())) && 
        u.password === password
      );
      
      if (matched) {
        // Block unverified users from logging in if they are not super admin
        if (matched.role !== 'super_admin' && matched.isVerified === false) {
          return { success: false, error: 'Your account registration is pending administrator approval. Please try again once approved.' };
        }
        
        // Also block suspended accounts
        if (matched.subscription?.status === 'suspended') {
          return { success: false, error: 'Your account has been suspended by an administrator. Please contact support.' };
        }

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
        return { success: false, error: 'Invalid email/username or password. Verify details and try again.' };
      }
    }
  };

  // Handle real registration (Supabase or local storage fallback)
  const onRealRegister = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string; pendingApproval?: boolean }> => {
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
        if (error) {
          return { success: false, error: error.message || JSON.stringify(error) };
        }
        
        if (data.user) {
          const sbUser = data.user;
          const mappedUser: User = {
            id: sbUser.id,
            email: sbUser.email || '',
            fullName: fullName,
            role: sbUser.email === 'admin@cardnest.com' ? 'super_admin' : 'premium_user',
            isVerified: true, // Auto-approve users when connected to a real Supabase database
            subscription: {
              plan: 'Premium',
              status: 'active',
              expiresAt: '2029-12-31',
              price: 19
            },
            joinedAt: sbUser.created_at || new Date().toISOString()
          };
          
          // Sync to local user directory so Admin Dashboard can view and approve
          let usersList = [];
          const localUsersRaw = localStorage.getItem('cardnest_local_users');
          if (localUsersRaw) {
            try {
              usersList = JSON.parse(localUsersRaw);
            } catch (e) {
              console.error(e);
            }
          }
          if (!Array.isArray(usersList)) {
            usersList = [];
          }
          
          if (!usersList.some((u: any) => u.email?.toLowerCase() === mappedUser.email.toLowerCase())) {
            usersList.push({
              id: mappedUser.id,
              email: mappedUser.email,
              password: password, // For administrative visual representation
              fullName: mappedUser.fullName,
              role: mappedUser.role,
              isVerified: mappedUser.isVerified,
              subscription: mappedUser.subscription,
              joinedAt: mappedUser.joinedAt
            });
            localStorage.setItem('cardnest_local_users', JSON.stringify(usersList));
          }
          
          if (mappedUser.isVerified) {
            setCurrentUser(mappedUser);
            localStorage.setItem('cardnest_current_user', JSON.stringify(mappedUser));
            setCurrentView('dashboard');
            return { success: true, pendingApproval: false };
          } else {
            return { success: true, pendingApproval: true };
          }
        }
        return { success: false, error: 'Registration succeeded, waiting for user session.' };
      } catch (err: any) {
        const errMsg = err && typeof err === 'object'
          ? (err.message || err.error_description || JSON.stringify(err))
          : String(err);
        return { success: false, error: errMsg || 'Registration failed.' };
      }
    } else {
      // LocalStorage Mode
      let users = [];
      const localUsersRaw = localStorage.getItem('cardnest_local_users');
      if (localUsersRaw) {
        try {
          users = JSON.parse(localUsersRaw);
        } catch (e) {
          console.error('Error parsing cardnest_local_users:', e);
          users = [];
        }
      }
      
      if (users.some((u: any) => (u.email && u.email.toLowerCase() === email.toLowerCase()) || (u.username && u.username.toLowerCase() === email.toLowerCase()))) {
        return { success: false, error: 'This email or username is already registered.' };
      }
      
      // Determine if they match one of our seeded mock card user IDs to let them inherit the mock card data
      let userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      let avatarUrl = undefined;
      let isVerified = false;
      if (email.toLowerCase() === 'alex.rivera@designco.io') {
        userId = 'user-001';
        avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
        isVerified = true;
      } else if (email.toLowerCase() === 'dr.sarah.chen@medcare.org') {
        userId = 'user-002';
        avatarUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80';
        isVerified = true;
      } else if (email.toLowerCase() === 'admin@cardnest.com' || email.toLowerCase() === 'admin') {
        userId = 'user-admin';
        avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
        isVerified = true;
      }

      const newUser = {
        id: userId,
        email: email,
        password: password,
        fullName: fullName,
        role: (email === 'admin@cardnest.com' || email.toLowerCase() === 'admin') ? 'super_admin' : 'premium_user',
        isVerified: isVerified,
        subscription: {
          plan: (email === 'admin@cardnest.com' || email.toLowerCase() === 'admin') ? 'Enterprise' : 'Premium',
          status: 'active',
          expiresAt: (email === 'admin@cardnest.com' || email.toLowerCase() === 'admin') ? '2099-12-31' : '2029-12-31',
          price: (email === 'admin@cardnest.com' || email.toLowerCase() === 'admin') ? 0 : 19
        },
        avatarUrl,
        joinedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('cardnest_local_users', JSON.stringify(users));
      
      if (isVerified) {
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('cardnest_current_user', JSON.stringify(userWithoutPassword));
        setCurrentView('dashboard');
        return { success: true, pendingApproval: false };
      } else {
        return { success: true, pendingApproval: true };
      }
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
    setCards(prev => {
      const updated = prev.map(c => c.id === updatedCard.id ? updatedCard : c);
      localStorage.setItem('cardnest_local_cards', JSON.stringify(updated));
      return updated;
    });
    
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
    setCards(prev => {
      const updated = [newCard, ...prev];
      localStorage.setItem('cardnest_local_cards', JSON.stringify(updated));
      return updated;
    });
    
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
    setCards(prev => {
      const updated = prev.filter(c => c.id !== cardId);
      localStorage.setItem('cardnest_local_cards', JSON.stringify(updated));
      return updated;
    });
    
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
  const activePublicCard = cards.find(c => c.slug.toLowerCase() === activeCardSlug?.toLowerCase());

  // Check if owner is verified
  let isActivePublicCardOwnerVerified = true;
  if (activePublicCard) {
    const localUsersRaw = localStorage.getItem('cardnest_local_users');
    const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : [];
    const cardOwner = localUsers.find((u: any) => u.id === activePublicCard.userId);
    if (cardOwner) {
      isActivePublicCardOwnerVerified = cardOwner.isVerified !== false;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {authWarning && (
        <div className="bg-amber-500 text-slate-950 px-4 py-3 text-center text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 relative z-50 border-b border-amber-600 shadow-sm">
          <div className="mx-auto flex items-center gap-2">
            <span>⚠️</span>
            <span>{authWarning}</span>
          </div>
          <button 
            onClick={() => setAuthWarning(null)} 
            className="text-slate-950/70 hover:text-slate-950 font-bold text-xs hover:bg-amber-600/20 px-2 py-1 rounded transition-colors uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      )}
      
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
      {currentView === 'public' && (
        <PublicCardView 
          card={activePublicCard}
          isLoading={dbLoading}
          isVerified={isActivePublicCardOwnerVerified}
          fetchError={publicCardError}
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

