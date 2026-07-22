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
 * Helper utility to safely parse and extract JSON object/array candidates or JSON strings.
 */
function parseJSONField<T>(fallback: T, ...candidates: any[]): T {
  for (const cand of candidates) {
    if (cand === undefined || cand === null) continue;
    if (typeof cand === 'string') {
      const trimmed = cand.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed !== undefined && parsed !== null) return parsed as T;
      } catch (e) {
        // Not a valid JSON string, continue
      }
    } else if (typeof cand === 'object' || Array.isArray(cand)) {
      return cand as T;
    }
  }
  return fallback;
}

/**
 * Maps a database row from Supabase to our DigitalCard TypeScript type.
 * Supports both standard modular columns (snake_case/camelCase) and fallback fields.
 */
export function mapRowToCard(row: any): DigitalCard {
  if (!row) return {} as DigitalCard;
  
  // Extract modular data with fallbacks
  let mods: Record<string, any> = parseJSONField<Record<string, any>>({}, row.modules);
  
  // Parse name & profile
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
    designation: mods.profile?.designation !== undefined ? mods.profile.designation : (row.job_title || ''),
    company: mods.profile?.company !== undefined ? mods.profile.company : (row.company || ''),
    tagline: mods.profile?.tagline !== undefined ? mods.profile.tagline : (row.bio || ''),
    about: mods.profile?.about !== undefined ? mods.profile.about : (row.bio || ''),
  };

  const status = row.is_published !== undefined 
    ? (row.is_published ? 'published' : 'draft') 
    : (row.status || 'published');

  let themeConfig = parseJSONField({}, mods.theme, row.theme_config, row.theme);
  let contactInfo = parseJSONField({}, mods.contact, row.contact_info, row.contact);
  let socialsData = parseJSONField([], mods.socialLinks, row.socials, row.social_links, row.socialLinks);

  let heroRaw: any = parseJSONField({}, mods.hero, row.hero_config, row.hero);

  const heroData = {
    enabled: true,
    type: 'gradient',
    height: 'medium',
    gradientStart: '#3B82F6',
    gradientEnd: '#1E3A8A',
    solidColor: '#0f172a',
    mediaUrl: '',
    ...heroRaw
  };

  let galleryRaw: any = parseJSONField([], mods.gallery, row.gallery);
  const galleryData = Array.isArray(galleryRaw) ? galleryRaw : [];

  return {
    id: row.id,
    userId: row.user_id || row.userId || 'user-001',
    slug: row.slug || '',
    templateId: row.template_id || row.templateId || 'corporate',
    status: status,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    
    // Modules with robust fallback parsing (both root columns and modules jsonb field)
    theme: themeConfig,
    hero: heroData,
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
    contact: contactInfo,
    socialLinks: socialsData,
    customButtons: parseJSONField([], mods.customButtons, row.custom_buttons, row.customButtons),
    about: parseJSONField({}, mods.about, row.about),
    services: parseJSONField([], mods.services, row.services),
    products: parseJSONField([], mods.products, row.products),
    gallery: galleryData,
    videos: parseJSONField([], mods.videos, row.videos),
    testimonials: parseJSONField([], mods.testimonials, row.testimonials),
    certificates: parseJSONField([], mods.certificates, row.certificates),
    skills: parseJSONField([], mods.skills, row.skills),
    education: parseJSONField([], mods.education, row.education),
    experience: parseJSONField([], mods.experience, row.experience),
    downloads: parseJSONField([], mods.downloads, row.downloads),
    businessHours: parseJSONField({}, mods.businessHours, row.business_hours, row.businessHours),
    qrCode: parseJSONField({}, row.qr_code_config, row.qr_code, row.qrCode, mods.qrCode),
    seo: parseJSONField({}, mods.seo, row.seo),
    analytics: parseJSONField({}, mods.analytics, row.analytics),
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
    
    // Top-level field candidates for database schemas with custom columns (auto-healed if DB lacks the column)
    hero_config: card.hero || {},
    hero: card.hero || {},
    gallery: card.gallery || [],
    about: card.about || {},
    services: card.services || [],
    products: card.products || [],
    videos: card.videos || [],
    testimonials: card.testimonials || [],
    certificates: card.certificates || [],
    skills: card.skills || [],
    education: card.education || [],
    experience: card.experience || [],
    downloads: card.downloads || [],
    custom_buttons: card.customButtons || [],
    business_hours: card.businessHours || {},
    seo: card.seo || {},
    analytics: card.analytics || {},

    // Always store all modular fields inside 'modules' JSONB as well
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
      socialLinks: card.socialLinks || [],
      contact: card.contact || {},
      theme: card.theme || {},
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
 * Converts a camelCase key to snake_case.
 */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Extracts a missing column name from a Postgres/PostgREST error message.
 */
function extractColumnNameFromError(message: string): string | null {
  if (!message) return null;
  
  // Could not find the 'hero_config' column of 'cards' in the schema cache
  let match = message.match(/Could\s+not\s+find\s+the\s+['"]([^'"]+)['"]\s+column/i);
  if (match) return match[1];

  // Could not find column "column_name" in table "cards"
  match = message.match(/Could\s+not\s+find\s+column\s+['"]([^'"]+)['"]/i);
  if (match) return match[1];

  // column "column_name" of relation "cards" does not exist
  match = message.match(/column\s+['"]([^'"]+)['"]\s+of\s+relation/i);
  if (match) return match[1];

  // column "column_name" does not exist
  match = message.match(/column\s+['"]?([a-zA-Z0-9_-]+)['"]?\s+does\s+not\s+exist/i);
  if (match) return match[1];

  // 'column_name' column in schema cache
  match = message.match(/['"]([^'"]+)['"]\s+column/i);
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
    // 1. Try matching slug first
    let { data, error } = await supabase
      .from('cards')
      .select('*')
      .ilike('slug', slug)
      .maybeSingle();
      
    // 2. Fallback: try matching by exact ID or converted deterministic UUID
    if (!data) {
      const dbCardId = isValidUUID(slug) ? slug : generateDeterministicUUID('card', slug);
      const { data: idData } = await supabase
        .from('cards')
        .select('*')
        .or(`id.eq.${slug},id.eq.${dbCardId}`)
        .maybeSingle();
      if (idData) data = idData;
    }

    if (error && !data) {
      console.error(`Supabase query error fetching card with slug ${slug}:`, error.message);
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
  const dbCardId = payload.id; // Guaranteed valid UUID
  const maxRetries = 35;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // 1. Primary method: Try upsert by ID
      const { error: upsertError } = await supabase
        .from('cards')
        .upsert(payload, { onConflict: 'id' });
        
      if (!upsertError) {
        return; // Upsert succeeded!
      }

      const errMsg = upsertError.message || '';

      // Auto-heal missing column errors
      const missingColumn = extractColumnNameFromError(errMsg);
      if (missingColumn || attempt > 1) {
        if (missingColumn) {
          const camelCol = toCamelCase(missingColumn);
          const snakeCol = toSnakeCase(missingColumn);
          console.warn(`[Auto-healing] Stripping non-existent column "${missingColumn}" / "${camelCol}" / "${snakeCol}" from payload and retrying...`);
          delete payload[missingColumn];
          delete payload[camelCol];
          delete payload[snakeCol];
        }
        
        // Strip all custom candidate columns at once if retrying to prevent 30+ sequential roundtrips
        const candidateCols = [
          'hero_config', 'hero', 'gallery', 'about', 'services', 'products',
          'videos', 'testimonials', 'certificates', 'skills', 'education',
          'experience', 'downloads', 'custom_buttons', 'business_hours', 'seo', 'analytics'
        ];
        candidateCols.forEach(col => {
          delete payload[col];
          delete payload[toCamelCase(col)];
        });
        
        continue;
      }

      // Handle duplicate slug conflicts by generating a unique suffix
      if (errMsg.includes('cards_slug_key') || (errMsg.includes('slug') && (errMsg.includes('duplicate') || errMsg.includes('unique')))) {
        payload.slug = `${payload.slug}-${Math.floor(Math.random() * 10000)}`;
        console.warn(`[Auto-healing] Duplicate slug detected. Adjusted slug to "${payload.slug}" and retrying...`);
        continue;
      }

      // 2. Fallback: Manual select -> update or insert
      const { data: existing } = await supabase
        .from('cards')
        .select('id')
        .eq('id', dbCardId)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('cards')
          .update(payload)
          .eq('id', dbCardId);

        if (!updateError) return;

        const col = extractColumnNameFromError(updateError.message);
        if (col) {
          delete payload[col];
          delete payload[toCamelCase(col)];
          delete payload[toSnakeCase(col)];
          continue;
        }
        throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('cards')
          .insert([payload]);

        if (!insertError) return;

        const col = extractColumnNameFromError(insertError.message);
        if (col) {
          delete payload[col];
          delete payload[toCamelCase(col)];
          delete payload[toSnakeCase(col)];
          continue;
        }

        // If insert failed because row actually exists, fallback to update
        if (insertError.code === '23505' || insertError.message.includes('duplicate key') || insertError.message.includes('already exists')) {
          const { error: fallbackUpdateError } = await supabase
            .from('cards')
            .update(payload)
            .eq('id', dbCardId);
          if (!fallbackUpdateError) return;
          throw fallbackUpdateError;
        }

        throw insertError;
      }
    } catch (err: any) {
      const errMsg = err.message || '';
      
      // Auto-heal on unrecognized column errors during search/select or thrown errors
      const missingColumn = extractColumnNameFromError(errMsg);
      if (missingColumn || attempt > 1) {
        if (missingColumn) {
          console.warn(`[Auto-healing] Stripping non-existent column "${missingColumn}" from payload and retrying...`);
          delete payload[missingColumn];
          delete payload[toCamelCase(missingColumn)];
          delete payload[toSnakeCase(missingColumn)];
        }
        
        const candidateCols = [
          'hero_config', 'hero', 'gallery', 'about', 'services', 'products',
          'videos', 'testimonials', 'certificates', 'skills', 'education',
          'experience', 'downloads', 'custom_buttons', 'business_hours', 'seo', 'analytics'
        ];
        candidateCols.forEach(col => {
          delete payload[col];
          delete payload[toCamelCase(col)];
        });
        
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

