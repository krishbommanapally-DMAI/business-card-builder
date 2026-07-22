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
  }
];

function readServerCards(): any[] {
  try {
    if (fs.existsSync(cardsFilePath)) {
      const data = fs.readFileSync(cardsFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
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
  const card = cards.find(
    c => (c.slug && c.slug.toLowerCase() === slug) || (c.id && c.id.toLowerCase() === slug)
  );

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
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
