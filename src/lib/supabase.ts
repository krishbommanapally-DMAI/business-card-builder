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
 * Checks if a string is a valid UUID format.
 */
export function isValidUUID(str: string): boolean {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Generates a stable, reproducible UUID from an input string.
 * This ensures mock string identifiers like "card-001" or "user-001" are converted
 * to valid UUIDs that pass PostgreSQL type validation constraints perfectly.
 */
export function generateDeterministicUUID(namespace: string, input: string): string {
  const combined = `${namespace}:${input || 'default'}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  let hex = '';
  for (let i = 0; i < 32; i++) {
    const val = Math.abs(Math.sin(hash + i) * 16777216) % 16;
    hex += Math.floor(val).toString(16);
  }
  
  const part1 = hex.substring(0, 8);
  const part2 = hex.substring(8, 12);
  const part3 = '4' + hex.substring(13, 16); // Version 4
  const part4 = ['8', '9', 'a', 'b'][Math.abs(hash) % 4] + hex.substring(17, 20); // Variant
  const part5 = hex.substring(20, 32);
  
  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

/**
 * Maps a database row from Supabase to our DigitalCard TypeScript type.
 * Supports both standard modular columns (snake_case/camelCase) and fallback fields.
 */
export function mapRowToCard(row: any): DigitalCard {
  if (!row) return {} as DigitalCard;
  
  // Extract modular data with fallbacks
  const mods = row.modules || {};
  
  // Parse name
  let firstName = '';
  let lastName = '';
  if (mods.profile?.firstName !== undefined) {
    firstName = mods.profile.firstName;
    lastName = mods.profile.lastName || '';
  } else if (row.full_name) {
    const parts = row.full_name.trim().split(/\s+/);
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }

  const profile = {
    prefix: mods.profile?.prefix || '',
    firstName: firstName,
    lastName: lastName,
    designation: row.job_title || mods.profile?.designation || '',
    company: row.company || mods.profile?.company || '',
    tagline: row.bio || mods.profile?.tagline || '',
    about: mods.profile?.about || row.bio || '',
  };

  const status = row.is_published !== undefined 
    ? (row.is_published ? 'published' : 'draft') 
    : (row.status || 'published');

  return {
    id: row.id,
    userId: row.user_id || row.userId || 'user-001',
    slug: row.slug || '',
    templateId: row.template_id || row.templateId || 'corporate',
    status: status,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    
    // Modules with robust fallback parsing (both root columns and modules jsonb field)
    theme: row.theme_config || row.theme || mods.theme || {},
    hero: mods.hero || row.hero || {},
    avatar: {
      url: row.avatar_url || '',
      borderWidth: 2,
      borderColor: '#ffffff',
      shadow: 'md',
      size: 'medium',
      position: 'center',
      zoom: 1,
      rotation: 0,
      ...mods.avatar,
      ...(row.avatar_url ? { url: row.avatar_url } : {})
    },
    companyLogo: {
      enabled: false,
      url: row.logo_url || '',
      position: 'inline',
      size: 'medium',
      rounded: true,
      shadow: true,
      ...mods.companyLogo,
      ...(row.logo_url ? { url: row.logo_url } : {})
    },
    profile: profile,
    contact: row.contact_info || row.contact || mods.contact || {},
    socialLinks: row.socials || row.social_links || row.socialLinks || mods.socialLinks || [],
    customButtons: mods.customButtons || row.custom_buttons || row.customButtons || [],
    about: mods.about || row.about || {},
    services: mods.services || row.services || [],
    products: mods.products || row.products || [],
    gallery: mods.gallery || row.gallery || [],
    videos: mods.videos || row.videos || [],
    testimonials: mods.testimonials || row.testimonials || [],
    certificates: mods.certificates || row.certificates || [],
    skills: mods.skills || row.skills || [],
    education: mods.education || row.education || [],
    experience: mods.experience || row.experience || [],
    downloads: mods.downloads || row.downloads || [],
    businessHours: mods.businessHours || row.business_hours || row.businessHours || {},
    qrCode: row.qr_code_config || row.qr_code || row.qrCode || mods.qrCode || {},
    seo: mods.seo || row.seo || {},
    analytics: mods.analytics || row.analytics || {},
  } as DigitalCard;
}

/**
 * Maps a DigitalCard TypeScript object to a format suitable for Supabase insertion/updates.
 * Generates only the standard snake_case keys to align with standard PostgreSQL schemas.
 */
export function mapCardToRow(card: DigitalCard): any {
  // Auto-heal non-UUID id and userId keys to valid, reproducible UUIDs
  const dbCardId = isValidUUID(card.id) ? card.id : generateDeterministicUUID('card', card.id);
  const dbUserId = isValidUUID(card.userId) ? card.userId : generateDeterministicUUID('user', card.userId);

  return {
    id: dbCardId,
    user_id: dbUserId,
    slug: card.slug,
    template_id: card.templateId,
    theme_config: card.theme,
    full_name: `${card.profile?.firstName || ''} ${card.profile?.lastName || ''}`.trim() || card.profile?.firstName || '',
    job_title: card.profile?.designation || '',
    company: card.profile?.company || '',
    bio: card.profile?.tagline || card.profile?.about || '',
    avatar_url: card.avatar?.url || '',
    logo_url: card.companyLogo?.url || '',
    contact_info: card.contact || {},
    socials: card.socialLinks || [],
    qr_code_config: card.qrCode || {},
    is_published: card.status === 'published',
    created_at: card.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    
    // Store remaining modular fields in the 'modules' column to prevent DB structure errors
    modules: {
      hero: card.hero || {},
      avatar: card.avatar || {},
      companyLogo: card.companyLogo || {},
      profile: card.profile || {},
      customButtons: card.customButtons || [],
      about: card.about || {},
      services: card.services || [],
      products: card.products || [],
      gallery: card.gallery || [],
      videos: card.videos || [],
      testimonials: card.testimonials || [],
      certificates: card.certificates || [],
      skills: card.skills || [],
      education: card.education || [],
      experience: card.experience || [],
      downloads: card.downloads || [],
      businessHours: card.businessHours || {},
      seo: card.seo || {},
      analytics: card.analytics || {},
    }
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
 * Fetches a single digital card by its slug from Supabase.
 */
export async function dbFetchCardBySlug(slug: string): Promise<DigitalCard | null> {
  if (!isSupabaseConfigured) return null;
  
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .ilike('slug', slug)
      .maybeSingle();
      
    if (error) {
      console.error(`Supabase query error fetching card with slug ${slug}:`, error.message);
      throw error;
    }
    
    return data ? mapRowToCard(data) : null;
  } catch (err) {
    console.error(`Failed to fetch card with slug ${slug} from Supabase:`, err);
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

