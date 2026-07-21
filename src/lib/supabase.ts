import { createClient } from '@supabase/supabase-js';
import { DigitalCard } from '../types';

// Retrieve Supabase credentials safely bypassing strict ImportMeta type checks in dev environment
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

// Handle cases where environment variables are missing gracefully
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables are missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your settings to connect a real database.'
  );
}

// Create and export the Supabase client instance
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

/**
 * Maps a database row from Supabase to our DigitalCard TypeScript type.
 * Supports both standard modular columns (snake_case/camelCase) and fallback fields.
 */
export function mapRowToCard(row: any): DigitalCard {
  if (!row) return {} as DigitalCard;
  
  return {
    id: row.id,
    userId: row.user_id || row.userId || 'user-001',
    slug: row.slug || '',
    templateId: row.template_id || row.templateId || 'corporate',
    status: row.status || 'published',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    
    // Modules with robust fallback parsing
    theme: row.theme || row.data?.theme || {},
    hero: row.hero || row.data?.hero || {},
    avatar: row.avatar || row.data?.avatar || {},
    companyLogo: row.company_logo || row.companyLogo || row.data?.companyLogo || row.data?.company_logo || {},
    profile: row.profile || row.data?.profile || {},
    contact: row.contact || row.data?.contact || {},
    socialLinks: row.social_links || row.socialLinks || row.data?.socialLinks || row.data?.social_links || [],
    customButtons: row.custom_buttons || row.customButtons || row.data?.customButtons || row.data?.custom_buttons || [],
    about: row.about || row.data?.about || {},
    services: row.services || row.data?.services || [],
    products: row.products || row.data?.products || [],
    gallery: row.gallery || row.data?.gallery || [],
    videos: row.videos || row.data?.videos || [],
    testimonials: row.testimonials || row.data?.testimonials || [],
    certificates: row.certificates || row.data?.certificates || [],
    skills: row.skills || row.data?.skills || [],
    education: row.education || row.data?.education || [],
    experience: row.experience || row.data?.experience || [],
    downloads: row.downloads || row.data?.downloads || [],
    businessHours: row.business_hours || row.businessHours || row.data?.businessHours || row.data?.business_hours || {},
    qrCode: row.qr_code || row.qrCode || row.data?.qrCode || row.data?.qr_code || {},
    seo: row.seo || row.data?.seo || {},
    analytics: row.analytics || row.data?.analytics || {},
  } as DigitalCard;
}

/**
 * Maps a DigitalCard TypeScript object to a format suitable for Supabase insertion/updates.
 * Generates only the standard snake_case keys to align with standard PostgreSQL schemas.
 */
export function mapCardToRow(card: DigitalCard): any {
  return {
    id: card.id,
    user_id: card.userId,
    slug: card.slug,
    template_id: card.templateId,
    status: card.status,
    updated_at: new Date().toISOString(),
    
    // Modules
    theme: card.theme,
    hero: card.hero,
    avatar: card.avatar,
    company_logo: card.companyLogo,
    profile: card.profile,
    contact: card.contact,
    social_links: card.socialLinks,
    custom_buttons: card.customButtons,
    about: card.about,
    services: card.services,
    products: card.products,
    gallery: card.gallery,
    videos: card.videos,
    testimonials: card.testimonials,
    certificates: card.certificates,
    skills: card.skills,
    education: card.education,
    experience: card.experience,
    downloads: card.downloads,
    business_hours: card.businessHours,
    qr_code: card.qrCode,
    seo: card.seo,
    analytics: card.analytics,
  };
}

/**
 * Converts a snake_case key to camelCase.
 */
function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
}

/**
 * Extracts a missing column name from a Postgres/PostgREST error message.
 */
function extractColumnNameFromError(message: string): string | null {
  if (!message) return null;
  
  // Match: column "column_name" of relation "cards" does not exist
  let match = message.match(/column\s+"([^"]+)"\s+of\s+relation/i);
  if (match) return match[1];
  
  // Match: Could not find column "column_name" in table "cards"
  match = message.match(/Could\s+not\s+find\s+column\s+"([^"]+)"/i);
  if (match) return match[1];

  // Match: column "column_name" does not exist
  match = message.match(/column\s+"([^"]+)"\s+does\s+not\s+exist/i);
  if (match) return match[1];

  // Match without quotes: column column_name does not exist
  match = message.match(/column\s+([a-zA-Z0-9_-]+)\s+does\s+not\s+exist/i);
  if (match) return match[1];

  return null;
}

/**
 * Fetches all digital cards from Supabase, mapping them to standard structures.
 */
export async function dbFetchCards(): Promise<DigitalCard[]> {
  if (!isSupabaseConfigured) return [];
  
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Supabase query error fetching cards:', error.message);
      throw error;
    }
    
    return (data || []).map(mapRowToCard);
  } catch (err) {
    console.error('Failed to fetch cards from Supabase, falling back.', err);
    throw err;
  }
}

/**
 * Saves (inserts or updates) a digital card in Supabase.
 * Implements an auto-healing retry mechanism that filters out columns not present in the user's DB,
 * and handles common security or structural database blocks.
 */
export async function dbSaveCard(card: DigitalCard): Promise<void> {
  if (!isSupabaseConfigured) return;
  
  const payload = mapCardToRow(card);
  const maxRetries = 25;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Check if the card already exists
      const { data: existing, error: checkError } = await supabase
        .from('cards')
        .select('id')
        .eq('id', card.id)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existing) {
        // Perform Update
        const { error: updateError } = await supabase
          .from('cards')
          .update(payload)
          .eq('id', card.id);
          
        if (updateError) {
          const missingColumn = extractColumnNameFromError(updateError.message);
          if (missingColumn && (payload[missingColumn] !== undefined || payload[toCamelCase(missingColumn)] !== undefined)) {
            console.warn(`[Auto-healing] Removing column "${missingColumn}" from update payload and retrying...`);
            delete payload[missingColumn];
            delete payload[toCamelCase(missingColumn)];
            continue; // retry
          }
          throw updateError;
        }
      } else {
        // Perform Insert
        const { error: insertError } = await supabase
          .from('cards')
          .insert([payload]);
          
        if (insertError) {
          const missingColumn = extractColumnNameFromError(insertError.message);
          if (missingColumn && (payload[missingColumn] !== undefined || payload[toCamelCase(missingColumn)] !== undefined)) {
            console.warn(`[Auto-healing] Removing column "${missingColumn}" from insert payload and retrying...`);
            delete payload[missingColumn];
            delete payload[toCamelCase(missingColumn)];
            continue; // retry
          }
          throw insertError;
        }
      }
      
      // If we reach here, save was successful!
      break;
    } catch (err: any) {
      const errMsg = err.message || '';
      
      // Auto-heal on unrecognized column errors during search/select
      const missingColumn = extractColumnNameFromError(errMsg);
      if (missingColumn && (payload[missingColumn] !== undefined || payload[toCamelCase(missingColumn)] !== undefined)) {
        console.warn(`[Auto-healing] Removing column "${missingColumn}" from payload and retrying...`);
        delete payload[missingColumn];
        delete payload[toCamelCase(missingColumn)];
        continue;
      }
      
      // Provide custom guidance for Row Level Security (RLS) issues
      if (errMsg.toLowerCase().includes('row-level security') || errMsg.toLowerCase().includes('violates row-level security') || errMsg.toLowerCase().includes('policy')) {
        const rlsError = new Error(
          `Supabase Row Level Security (RLS) is blocking this save. Please run the following command in your Supabase SQL Editor to enable public insert/update: \n\nALTER TABLE cards DISABLE ROW LEVEL SECURITY;\n\nOr create a public permissive policy in your Supabase dashboard.`
        );
        console.error(rlsError.message);
        throw rlsError;
      }
      
      // Provide custom guidance for permission issues
      if (errMsg.toLowerCase().includes('permission denied') || errMsg.toLowerCase().includes('insufficient privilege')) {
        const permError = new Error(
          `Supabase permission denied. Please verify your Anon Key has permission to insert and update the cards table, or run: \n\nGRANT ALL ON TABLE cards TO anon, authenticated, postgres;`
        );
        console.error(permError.message);
        throw permError;
      }

      if (attempt === maxRetries - 1) {
        console.error('Failed to save card in Supabase after multiple auto-healing retries:', err);
        throw err;
      }
      
      throw err;
    }
  }
}

/**
 * Deletes a digital card from Supabase.
 */
export async function dbDeleteCard(cardId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  
  try {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', cardId);
      
    if (error) {
      if (error.message.toLowerCase().includes('policy') || error.message.toLowerCase().includes('row-level security')) {
        throw new Error(`Supabase Row Level Security (RLS) blocks deletion. Run 'ALTER TABLE cards DISABLE ROW LEVEL SECURITY;' in your SQL Editor to allow deletions.`);
      }
      throw error;
    }
  } catch (err) {
    console.error('Failed to delete card from Supabase:', err);
    throw err;
  }
}

