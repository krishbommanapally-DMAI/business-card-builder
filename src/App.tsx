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
import { isSupabaseConfigured, dbFetchCards, dbSaveCard, dbDeleteCard } from './lib/supabase';

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

  // Handle mock login authentication
  const handleLogin = (role: 'free_user' | 'premium_user' | 'super_admin') => {
    const matchedUser = mockUsers.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      if (role === 'super_admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('dashboard');
      }
    }
  };

  // Logout routine
  const handleLogout = () => {
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
          onLogin={handleLogin} 
          onSelectCard={handleViewCard} 
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

