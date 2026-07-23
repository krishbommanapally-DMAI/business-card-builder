import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure persistent data directory exists
const dataDir = path.join(process.cwd(), 'data');
const cardsFilePath = path.join(dataDir, 'cards.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial default seed cards if server storage is fresh
const defaultCards = [
  {
    id: 'card-001',
    userId: 'user-001',
    slug: 'alexrivera',
    templateId: 'modern_executive',
    status: 'published',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
    profile: {
      firstName: 'Alex',
      lastName: 'Rivera',
      designation: 'Principal Product Architect',
      company: 'DesignCo Studio',
      tagline: 'Crafting spatial interfaces & design systems for tomorrow.',
      about: 'Passionate design engineering lead with 10+ years of experience launching web & mobile products. Specializing in high-performance digital experiences and accessible design systems.'
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      shape: 'rounded-2xl',
      border: true
    },
    companyLogo: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'
    },
    hero: {
      enabled: true,
      type: 'gradient',
      gradientStart: '#4f46e5',
      gradientEnd: '#9333ea'
    },
    theme: {
      template: 'modern_executive',
      primaryColor: '#4f46e5',
      secondaryColor: '#0f172a',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      fontFamily: 'Inter',
      borderRadius: '1rem',
      cardStyle: 'glass',
      customCss: ''
    },
    contact: {
      email: 'alex.rivera@designco.io',
      phone: '+1 (555) 234-5678',
      whatsapp: '+1 (555) 234-5678',
      website: 'https://designco.io',
      location: 'San Francisco, CA',
      addressMapUrl: 'https://maps.google.com'
    },
    socialLinks: [
      { id: 'sc-1', platform: 'linkedin', url: 'https://linkedin.com/in/alexrivera' },
      { id: 'sc-2', platform: 'github', url: 'https://github.com/alexrivera' },
      { id: 'sc-3', platform: 'twitter', url: 'https://twitter.com/alexrivera' },
      { id: 'sc-4', platform: 'instagram', url: 'https://instagram.com/alexrivera' }
    ],
    customButtons: [
      { id: 'cb-1', label: 'Book 1:1 Strategy Call', url: 'https://calendly.com', icon: 'Calendar', variant: 'primary' },
      { id: 'cb-2', label: 'Download Design System Spec', url: 'https://designco.io/spec.pdf', icon: 'Download', variant: 'outline' }
    ],
    about: {
      enabled: true,
      title: 'About Me',
      content: 'Passionate design engineering lead with 10+ years of experience launching web & mobile products.'
    },
    services: [
      { id: 'srv-1', title: 'Product Architecture', description: 'End-to-end UX/UI and frontend system architecture for scaling SaaS apps.', icon: 'Layout' },
      { id: 'srv-2', title: 'Design System Engineering', description: 'Multi-platform component libraries with Tailwind CSS & React.', icon: 'Palette' }
    ],
    products: [
      { id: 'prd-1', title: 'Pro UI Design Kit 2026', price: '$49', description: 'Over 200+ responsive Figma components and React tokens.', whatsappOrder: true }
    ],
    gallery: [
      { id: 'gal-1', type: 'image', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80', title: 'Modern Studio Workspace' },
      { id: 'gal-2', type: 'image', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80', title: 'Product Team Design Sprint' }
    ],
    videos: [],
    testimonials: [
      { id: 't-1', name: 'Elena Rostova', title: 'VP of Product @ TechScale', quote: 'Alex completely transformed our product design language. Highly recommended!', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', rating: 5 }
    ],
    certificates: [],
    skills: [
      { id: 'sk-1', name: 'React / Next.js', percentage: 95, color: '#4f46e5' },
      { id: 'sk-2', name: 'UI / UX Design Systems', percentage: 90, color: '#9333ea' },
      { id: 'sk-3', name: 'TypeScript & Node.js', percentage: 88, color: '#0284c7' }
    ],
    education: [],
    experience: [],
    downloads: [],
    businessHours: {
      enabled: true,
      hours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '16:00', closed: false },
        saturday: { open: '10:00', close: '14:00', closed: true },
        sunday: { open: '10:00', close: '14:00', closed: true }
      }
    },
    qrCode: {
      foregroundColor: '#0f172a',
      backgroundColor: '#ffffff',
      includeLogo: true,
      style: 'dots'
    },
    seo: {
      metaTitle: 'Alex Rivera - Principal Product Architect | Digital Card',
      metaDescription: 'Digital business card for Alex Rivera, Principal Product Architect at DesignCo Studio.',
      keywords: 'Product Architecture, UI/UX, Design Systems, React'
    },
    analytics: {
      views: 1240,
      uniqueVisitors: 890,
      clicks: 342,
      qrScans: 156,
      downloads: 88
    }
  },
  {
    id: 'card-murali',
    userId: 'user-murali',
    slug: 'murali',
    templateId: 'modern_executive',
    status: 'published',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
    profile: {
      firstName: 'Murali',
      lastName: 'Mohan',
      designation: 'Computer Operator Pediatric Block',
      company: 'MGM',
      tagline: 'Healthcare IT & Operations Specialist.',
      about: 'Managing pediatric block IT systems and patient administration at MGM.'
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      shape: 'rounded-full',
      border: true
    },
    companyLogo: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'
    },
    hero: {
      enabled: true,
      type: 'gradient',
      gradientStart: '#2563eb',
      gradientEnd: '#1e40af'
    },
    theme: {
      template: 'modern_executive',
      primaryColor: '#2563eb',
      secondaryColor: '#0f172a',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      fontFamily: 'Inter',
      borderRadius: '1rem',
      cardStyle: 'glass',
      customCss: ''
    },
    contact: {
      email: 'murali.mohan@mgm.org',
      phone: '+91 98765 43210',
      whatsapp: '+919876543210',
      website: 'https://mgm.org',
      location: 'MGM Hospital, Pediatric Block'
    },
    socialLinks: [],
    customButtons: [],
    about: {
      enabled: true,
      title: 'About Me',
      content: 'Managing pediatric block IT systems and patient administration at MGM.'
    },
    services: [],
    products: [],
    gallery: [],
    videos: [],
    testimonials: [],
    certificates: [],
    skills: [],
    education: [],
    experience: [],
    downloads: [],
    businessHours: { enabled: true, hours: {} },
    qrCode: { foregroundColor: '#0f172a', backgroundColor: '#ffffff', includeLogo: true, style: 'dots' },
    seo: {
      metaTitle: 'Murali Mohan - Computer Operator Pediatric Block | MGM',
      metaDescription: 'Digital Business Card for Murali Mohan, Computer Operator Pediatric Block at MGM.',
      keywords: 'Murali Mohan, MGM, Pediatric Block'
    },
    analytics: { views: 520, uniqueVisitors: 380, clicks: 190, qrScans: 85, downloads: 42 }
  }
];

function readServerCards(): any[] {
  try {
    if (fs.existsSync(cardsFilePath)) {
      const data = fs.readFileSync(cardsFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let updated = false;
        for (const defCard of defaultCards) {
          const exists = parsed.some(c => (c.slug && c.slug.toLowerCase() === defCard.slug.toLowerCase()) || c.id === defCard.id);
          if (!exists) {
            parsed.push(defCard);
            updated = true;
          }
        }
        if (updated) {
          writeServerCards(parsed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading cards.json from server storage:', err);
  }
  // Initialize file if empty or missing
  writeServerCards(defaultCards);
  return defaultCards;
}

function writeServerCards(cards: any[]): void {
  try {
    fs.writeFileSync(cardsFilePath, JSON.stringify(cards, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing cards.json to server storage:', err);
  }
}

// Helper to extract card slug from URL query or path
function extractSlugFromReq(req: express.Request): string | null {
  let slug = (req.query.card || req.query.slug || req.query.u || req.query.id || '').toString().toLowerCase().trim();
  if (slug) return slug;

  const cleanPath = req.path.replace(/^\/+|\/+$/g, '');
  if (!cleanPath) return null;

  const parts = cleanPath.split('/');
  if (parts.length === 0) return null;

  const reserved = ['dashboard', 'admin', 'builder', 'login', 'landing', 'signup', 'register', 'api', 'assets', 'favicon.ico'];
  
  if (['card', 'c', 'u', 'p', 'profile'].includes(parts[0].toLowerCase()) && parts[1]) {
    return parts[1].toLowerCase().trim();
  }

  if (!reserved.includes(parts[0].toLowerCase())) {
    return parts[0].toLowerCase().trim();
  }

  return null;
}

// Helper to find card by slug or ID or full name match
function findCardBySlug(cards: any[], slug: string | null): any | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().replace(/\s+/g, '');
  return cards.find(
    c => (c.slug && c.slug.toLowerCase().replace(/\s+/g, '') === cleanSlug) ||
         (c.id && c.id.toLowerCase() === cleanSlug) ||
         (c.profile && `${c.profile.firstName || ''}${c.profile.lastName || ''}`.toLowerCase().replace(/\s+/g, '') === cleanSlug)
  ) || null;
}

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET all cards
app.get('/api/cards', (_req, res) => {
  const cards = readServerCards();
  res.json({ success: true, cards });
});

// GET single card by slug or id
app.get('/api/cards/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const cards = readServerCards();
  const card = findCardBySlug(cards, slug);

  if (card) {
    res.json({ success: true, card });
  } else {
    res.status(404).json({ success: false, error: `Card with slug/id "${req.params.slug}" not found` });
  }
});

// POST save / update card
app.post('/api/cards', (req, res) => {
  const cardPayload = req.body.card || req.body;
  if (!cardPayload || !cardPayload.id || !cardPayload.slug) {
    return res.status(400).json({ success: false, error: 'Invalid card payload. "id" and "slug" are required.' });
  }

  const cards = readServerCards();
  const existingIndex = cards.findIndex(
    c => c.id === cardPayload.id || (c.slug && c.slug.toLowerCase() === cardPayload.slug.toLowerCase())
  );

  cardPayload.updatedAt = new Date().toISOString();

  if (existingIndex >= 0) {
    cards[existingIndex] = { ...cards[existingIndex], ...cardPayload };
  } else {
    cards.unshift(cardPayload);
  }

  writeServerCards(cards);
  res.json({ success: true, card: cardPayload });
});

// DELETE card by ID
app.delete('/api/cards/:id', (req, res) => {
  const id = req.params.id;
  let cards = readServerCards();
  cards = cards.filter(c => c.id !== id);
  writeServerCards(cards);
  res.json({ success: true, id });
});

async function startServer() {
  // Vite middleware integration for development mode
  if (process.env.NODE_ENV !== 'production') {
    const viteServer = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Intercept all HTML page requests in dev mode to inject dynamic Open Graph & social preview meta tags
    app.use(async (req, res, next) => {
      const isApiOrAsset = req.path.startsWith('/api') || 
                           req.path.startsWith('/assets') || 
                           req.path.startsWith('/@') || 
                           (req.path.includes('.') && !req.path.endsWith('.html'));

      if (!isApiOrAsset) {
        const host = req.headers.host || `localhost:${PORT}`;
        const rawProtocol = (req.headers['x-forwarded-proto'] as string) || 'https';
        const protocol = rawProtocol.split(',')[0].trim();
        const fullUrl = `${protocol}://${host}${req.originalUrl}`;

        const slug = extractSlugFromReq(req);
        const cards = readServerCards();
        const card = findCardBySlug(cards, slug);

        try {
          const indexFilePath = path.join(process.cwd(), 'index.html');
          if (fs.existsSync(indexFilePath)) {
            const rawHtml = fs.readFileSync(indexFilePath, 'utf-8');
            const templateHtml = await viteServer.transformIndexHtml(req.originalUrl, rawHtml);
            const injectedHtml = injectMetaTags(templateHtml, card, fullUrl, protocol, host);
            return res.status(200).set({ 'Content-Type': 'text/html' }).send(injectedHtml);
          }
        } catch (err) {
          console.error('Error handling meta tags in dev mode:', err);
        }
      }

      next();
    });

    app.use(viteServer.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      const host = req.headers.host || `localhost:${PORT}`;
      const rawProtocol = (req.headers['x-forwarded-proto'] as string) || 'https';
      const protocol = rawProtocol.split(',')[0].trim();
      const fullUrl = `${protocol}://${host}${req.originalUrl}`;

      const slug = extractSlugFromReq(req);
      const cards = readServerCards();
      const card = findCardBySlug(cards, slug);

      const distIndexPath = path.join(distPath, 'index.html');
      let templateHtml = '';
      if (fs.existsSync(distIndexPath)) {
        templateHtml = fs.readFileSync(distIndexPath, 'utf-8');
      } else {
        const rootIndexPath = path.join(process.cwd(), 'index.html');
        if (fs.existsSync(rootIndexPath)) {
          templateHtml = fs.readFileSync(rootIndexPath, 'utf-8');
        }
      }

      if (templateHtml) {
        const injectedHtml = injectMetaTags(templateHtml, card, fullUrl, protocol, host);
        return res.status(200).set({ 'Content-Type': 'text/html' }).send(injectedHtml);
      }

      res.sendFile(distIndexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Dynamic Open Graph Image Generator Endpoint
app.get('/api/og-image', (req, res) => {
  const slug = (req.query.slug || req.query.id || '').toString().toLowerCase();
  const cards = readServerCards();
  const card = findCardBySlug(cards, slug) || cards[0];

  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';

  let avatarUrl = extractCardAvatarUrl(card);
  if (avatarUrl && avatarUrl.startsWith('/')) {
    avatarUrl = `${protocol}://${host}${avatarUrl}`;
  }

  // If a profile photo URL is available, 302 redirect directly so WhatsApp / Facebook / Twitter scrapers receive a 200 image/jpeg
  if (avatarUrl && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://'))) {
    return res.redirect(302, avatarUrl);
  }

  const firstName = card?.profile?.firstName || '';
  const lastName = card?.profile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Digital Business Card';
  const designation = card?.profile?.designation || '';
  const company = card?.profile?.company || '';
  const primaryColor = card?.theme?.primaryColor || '#4f46e5';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e1b4b" />
        </linearGradient>
        <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <clipPath id="avatarClip">
          <circle cx="280" cy="315" r="120" />
        </clipPath>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="40" result="blur" />
        </filter>
      </defs>

      <!-- Outer Background -->
      <rect width="1200" height="630" fill="url(#bg)" />

      <!-- Ambient Glow Behind Avatar -->
      <circle cx="280" cy="315" r="170" fill="${escapeHtml(primaryColor)}" opacity="0.35" filter="url(#glow)" />

      <!-- Main Profile Card Container -->
      <rect x="90" y="115" width="1020" height="400" rx="48" fill="url(#cardBg)" stroke="#334155" stroke-width="3" filter="url(#shadow)" />

      <!-- Circular Avatar Frame (Left Side) -->
      <circle cx="280" cy="315" r="128" fill="${escapeHtml(primaryColor)}" opacity="0.8" />
      <circle cx="280" cy="315" r="122" fill="#0f172a" />
      ${
        avatarUrl
          ? `<image href="${escapeHtml(avatarUrl)}" x="160" y="195" width="240" height="240" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)" />`
          : `<text x="280" y="338" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="bold" fill="#a5b4fc" text-anchor="middle">${escapeHtml(firstName[0] || 'D')}${escapeHtml(lastName[0] || 'C')}</text>`
      }

      <!-- Profile Details Stack (Right Side) -->
      <text x="450" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
        ${escapeHtml(fullName)}
      </text>

      <text x="450" y="332" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="600" fill="#a5b4fc">
        ${escapeHtml(designation || 'Digital Business Card')}
      </text>

      <text x="450" y="385" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600" fill="#38bdf8">
        ${escapeHtml(company)}
      </text>

      <rect x="820" y="442" width="250" height="42" rx="14" fill="#020617" opacity="0.85" stroke="#1e293b" stroke-width="1.5" />
      <text x="945" y="468" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#94a3b8" text-anchor="middle">
        CardNest Digital Card
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(svg);
});

function extractCardAvatarUrl(card: any): string | null {
  if (!card) return null;

  if (typeof card.avatar === 'string' && card.avatar.trim()) {
    return card.avatar.trim();
  }
  if (card.avatar && typeof card.avatar === 'object' && typeof card.avatar.url === 'string' && card.avatar.url.trim()) {
    return card.avatar.url.trim();
  }

  if (card.profile && typeof card.profile.avatarUrl === 'string' && card.profile.avatarUrl.trim()) {
    return card.profile.avatarUrl.trim();
  }

  if (typeof card.companyLogo === 'string' && card.companyLogo.trim()) {
    return card.companyLogo.trim();
  }
  if (card.companyLogo && typeof card.companyLogo === 'object' && typeof card.companyLogo.url === 'string' && card.companyLogo.url.trim()) {
    return card.companyLogo.url.trim();
  }

  if (Array.isArray(card.gallery) && card.gallery.length > 0 && card.gallery[0]?.url) {
    if (typeof card.gallery[0].url === 'string' && card.gallery[0].url.trim()) {
      return card.gallery[0].url.trim();
    }
  }

  return null;
}

function injectMetaTags(html: string, card: any | null, fullUrl: string, protocol: string, host: string): string {
  const defaultTitle = 'Digital Business Cards - CardNest';
  const defaultDesc = 'Create and share interactive digital business cards with instant profile previews, QR codes, and contact saving.';
  const defaultImg = `${protocol}://${host}/api/og-image`;

  let titleStr = defaultTitle;
  let descStr = defaultDesc;
  let imageUrl = defaultImg;

  if (card) {
    const firstName = card.profile?.firstName || '';
    const lastName = card.profile?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Digital Business Card';
    const designation = card.profile?.designation || '';
    const company = card.profile?.company || '';

    titleStr = card.seo?.metaTitle || (designation ? `${fullName} - ${designation}` : fullName);
    if (company && !titleStr.includes(company)) {
      titleStr += ` | ${company}`;
    }

    descStr = card.seo?.metaDescription || card.profile?.tagline || card.profile?.about || `Digital Business Card for ${fullName}. Save contact details & view profile.`;

    const cardAvatar = extractCardAvatarUrl(card);
    if (cardAvatar && (cardAvatar.startsWith('http://') || cardAvatar.startsWith('https://'))) {
      imageUrl = cardAvatar;
    } else {
      imageUrl = `${protocol}://${host}/api/og-image?slug=${encodeURIComponent(card.slug || card.id)}&v=${card.updatedAt ? new Date(card.updatedAt).getTime() : Date.now()}`;
    }
  }

  if (imageUrl.startsWith('/')) {
    imageUrl = `${protocol}://${host}${imageUrl}`;
  } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    imageUrl = `${protocol}://${host}/${imageUrl}`;
  }

  let secureImageUrl = imageUrl;
  if (imageUrl.startsWith('http://')) {
    secureImageUrl = imageUrl.replace('http://', 'https://');
  }

  const metaTags = `
    <!-- Dynamic Social Sharing Metadata -->
    <title>${escapeHtml(titleStr)}</title>
    <meta name="title" content="${escapeHtml(titleStr)}" />
    <meta name="description" content="${escapeHtml(descStr)}" />

    <!-- Open Graph / WhatsApp / iMessage / Facebook / LinkedIn / Slack -->
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${escapeHtml(fullUrl)}" />
    <meta property="og:title" content="${escapeHtml(titleStr)}" />
    <meta property="og:description" content="${escapeHtml(descStr)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(secureImageUrl)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="600" />
    <meta property="og:image:alt" content="${escapeHtml(titleStr)}" />
    <meta property="og:site_name" content="CardNest Digital Cards" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(fullUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(titleStr)}" />
    <meta name="twitter:description" content="${escapeHtml(descStr)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(titleStr)}" />
  `;

  let cleanHtml = html
    .replace(/<title>.*?<\/title>/gi, '')
    .replace(/<meta\s+(name|property)=["'](og:|twitter:|description|title)[^>]*>/gi, '');

  return cleanHtml.replace('</head>', `${metaTags}\n</head>`);
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

startServer();
