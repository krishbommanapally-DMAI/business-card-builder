/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, DigitalCard, CardTheme, HeroSection, ProfileAvatar, CompanyLogo, ProfileInfo, ContactInfo, SocialLink, CustomButton, AboutSection, ServiceItem, ProductItem, GalleryItem, VideoItem, TestimonialItem, CertificateItem, SkillItem, EducationItem, ExperienceItem, DownloadItem, BusinessHours, QRCodeSettings, SEOSettings, AnalyticsCard } from '../types';

// Standard business hours template helper
export const defaultBusinessHours = (): BusinessHours => ({
  monday: { enabled: true, openTime: '09:00', closeTime: '17:00', is24Hours: false },
  tuesday: { enabled: true, openTime: '09:00', closeTime: '17:00', is24Hours: false },
  wednesday: { enabled: true, openTime: '09:00', closeTime: '17:00', is24Hours: false },
  thursday: { enabled: true, openTime: '09:00', closeTime: '17:00', is24Hours: false },
  friday: { enabled: true, openTime: '09:00', closeTime: '17:00', is24Hours: false },
  saturday: { enabled: false, openTime: '10:00', closeTime: '15:00', is24Hours: false },
  sunday: { enabled: false, openTime: '10:00', closeTime: '15:00', is24Hours: false },
});

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'alex.rivera@designco.io',
    fullName: 'Alex Rivera',
    role: 'premium_user',
    isVerified: true,
    subscription: {
      plan: 'Premium',
      status: 'active',
      expiresAt: '2027-01-20',
      price: 19
    },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-03-12'
  },
  {
    id: 'user-002',
    email: 'dr.sarah.chen@medcare.org',
    fullName: 'Dr. Sarah Chen',
    role: 'premium_user',
    isVerified: true,
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
    fullName: 'Chief Admin',
    role: 'super_admin',
    isVerified: true,
    subscription: {
      plan: 'Enterprise',
      status: 'active',
      expiresAt: '2099-12-31',
      price: 0
    },
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-01-01'
  },
  {
    id: 'user-free',
    email: 'marcus.vance@gmail.com',
    fullName: 'Marcus Vance',
    role: 'free_user',
    isVerified: true,
    subscription: {
      plan: 'Free',
      status: 'active',
      expiresAt: '2026-08-20',
      price: 0
    },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedAt: '2026-07-10'
  }
];

// Helper to generate dynamic, beautiful analytics for cards
const generateMockAnalytics = (viewsMult: number): AnalyticsCard => ({
  views: Math.round(1420 * viewsMult),
  visitors: Math.round(980 * viewsMult),
  qrScans: Math.round(310 * viewsMult),
  downloads: Math.round(180 * viewsMult),
  clicks: Math.round(620 * viewsMult),
  countries: [
    { name: 'United States', value: 45 },
    { name: 'United Kingdom', value: 18 },
    { name: 'Germany', value: 12 },
    { name: 'Singapore', value: 10 },
    { name: 'Canada', value: 8 },
    { name: 'Others', value: 7 }
  ],
  cities: [
    { name: 'San Francisco', value: 30 },
    { name: 'New York', value: 25 },
    { name: 'London', value: 18 },
    { name: 'Berlin', value: 12 },
    { name: 'Singapore', value: 10 },
    { name: 'Toronto', value: 5 }
  ],
  browsers: [
    { name: 'Safari', value: 48 },
    { name: 'Chrome', value: 38 },
    { name: 'Firefox', value: 8 },
    { name: 'Edge', value: 6 }
  ],
  devices: [
    { name: 'Mobile', value: 72 },
    { name: 'Desktop', value: 24 },
    { name: 'Tablet', value: 4 }
  ],
  operatingSystems: [
    { name: 'iOS', value: 52 },
    { name: 'Android', value: 21 },
    { name: 'macOS', value: 18 },
    { name: 'Windows', value: 9 }
  ],
  timeline: [
    { date: 'Jul 14', views: Math.round(120 * viewsMult), scans: Math.round(30 * viewsMult) },
    { date: 'Jul 15', views: Math.round(150 * viewsMult), scans: Math.round(25 * viewsMult) },
    { date: 'Jul 16', views: Math.round(135 * viewsMult), scans: Math.round(40 * viewsMult) },
    { date: 'Jul 17', views: Math.round(190 * viewsMult), scans: Math.round(55 * viewsMult) },
    { date: 'Jul 18', views: Math.round(210 * viewsMult), scans: Math.round(42 * viewsMult) },
    { date: 'Jul 19', views: Math.round(245 * viewsMult), scans: Math.round(60 * viewsMult) },
    { date: 'Jul 20', views: Math.round(280 * viewsMult), scans: Math.round(75 * viewsMult) }
  ]
});

// Standard premium Templates and Cards database
export const mockCards: DigitalCard[] = [
  // 1. Corporate / Executive Template (Alex Rivera)
  {
    id: 'card-corporate',
    userId: 'user-001',
    slug: 'alexrivera',
    templateId: 'corporate',
    status: 'published',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-07-15T15:30:00Z',
    theme: {
      id: 'theme-corporate',
      name: 'Corporate Navy',
      primaryColor: '#0F172A', // Slate 900
      secondaryColor: '#3B82F6', // Blue 500
      accentColor: '#10B981', // Emerald 500
      backgroundColor: '#F8FAFC', // Slate 50
      textColor: '#1E293B', // Slate 800
      fontFamily: 'Outfit',
      borderRadius: 'lg',
      cardStyle: 'elevated',
      buttonStyle: 'filled',
      iconStyle: 'circle',
      glassEffect: true,
      animations: 'smooth',
      darkMode: false
    },
    hero: {
      enabled: true,
      type: 'gradient',
      mediaUrl: '',
      posterUrl: '',
      gradientStart: '#1E3A8A',
      gradientEnd: '#0F172A',
      solidColor: '',
      loop: false,
      muted: true,
      autoplay: false,
      overlayColor: '#0F172A',
      overlayOpacity: 0.1,
      overlayBlur: 0,
      height: 'medium',
      textPosition: 'center',
      parallax: true
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      borderWidth: 4,
      borderColor: '#FFFFFF',
      shadow: 'lg',
      size: 'medium',
      position: 'center',
      zoom: 1,
      rotation: 0
    },
    companyLogo: {
      enabled: true,
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', // Premium design firm abstract logo
      position: 'inline',
      size: 'medium',
      rounded: true,
      shadow: true
    },
    profile: {
      prefix: 'Mr.',
      firstName: 'Alex',
      lastName: 'Rivera',
      designation: 'VP of Design & Product',
      company: 'DesignCo Global',
      tagline: 'Crafting the future of human-centered enterprise applications',
      about: 'Alex Rivera is a veteran design architect with over 15 years of industry experience. Leading cross-functional teams in creating intuitive digital systems, Alex has partnered with fortune 500 companies to pioneer modern UI standards.'
    },
    contact: {
      phone: '+1 (555) 019-2831',
      whatsapp: '+15550192831',
      email: 'alex.rivera@designco.io',
      sms: '+15550192831',
      website: 'https://designco.io',
      address: '500 Howard St, San Francisco, CA 94105',
      googleMapsUrl: 'https://maps.google.com'
    },
    socialLinks: [
      { id: 'sc-1', platform: 'linkedin', url: 'https://linkedin.com' },
      { id: 'sc-2', platform: 'twitter', url: 'https://twitter.com' },
      { id: 'sc-3', platform: 'instagram', url: 'https://instagram.com' },
      { id: 'sc-4', platform: 'github', url: 'https://github.com' }
    ],
    customButtons: [
      {
        id: 'btn-1',
        text: 'Schedule Q3 Strategy Consultation',
        url: 'https://calendly.com',
        icon: 'Calendar',
        backgroundColor: '#2563EB',
        textColor: '#FFFFFF',
        hoverAnimation: 'scale',
        borderRadius: 'lg',
        style: 'filled',
        visible: true
      }
    ],
    about: {
      enabled: true,
      title: 'Our Executive Vision',
      description: 'At DesignCo Global, we believe design is not just what it looks like; it is how it works. We operate at the intersection of business strategy, breakthrough engineering, and elegant digital aesthetics.',
      readMoreEnabled: true,
      readMoreText: 'Read full executive bio & publications'
    },
    services: [
      {
        id: 'srv-1',
        title: 'Enterprise Product Consulting',
        description: 'Comprehensive audit and design blueprinting to increase product engagement and reduce user friction.',
        icon: 'LayoutGrid'
      },
      {
        id: 'srv-2',
        title: 'Design System Architecture',
        description: 'Developing unified, production-ready design tokens and UI kits built on React and TailwindCSS.',
        icon: 'Component'
      }
    ],
    products: [
      {
        id: 'prd-1',
        title: 'Executive UX Masterclass',
        price: '$1,250',
        description: '1-on-1 virtual product strategy training and hands-on portfolio teardown.',
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&auto=format&fit=crop&q=80',
        whatsappOrder: true
      },
      {
        id: 'prd-2',
        title: 'Design Audit E-Book',
        price: '$49',
        description: 'The ultimate guide to running internal visual reviews for scaling engineering startups.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
        whatsappOrder: false
      }
    ],
    gallery: [
      { id: 'gal-1', type: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80', title: 'Main Headquarters' },
      { id: 'gal-2', type: 'image', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=80', title: 'Collaboration Zone' }
    ],
    videos: [
      { id: 'vid-1', type: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'DesignCo Keynote Video' }
    ],
    testimonials: [
      {
        id: 'tst-1',
        customerName: 'Marcus Vance',
        rating: 5,
        description: 'Working with Alex transformed our SaaS interface completely. Our conversion rate rose by 34% within the first month of shipping the redesigned components.',
        company: 'CloudFlow Tech'
      }
    ],
    certificates: [
      {
        id: 'crt-1',
        title: 'Certified Product Owner',
        issuedBy: 'Scrum Alliance',
        date: '2025-06-15',
        imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=300&auto=format&fit=crop&q=80'
      }
    ],
    skills: [
      { id: 'sk-1', name: 'Product Strategy & Vision', percentage: 95, color: '#3B82F6' },
      { id: 'sk-2', name: 'Design Systems Architecture', percentage: 90, color: '#10B981' },
      { id: 'sk-3', name: 'Interactive UI Prototyping', percentage: 85, color: '#F59E0B' }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'M.S. in Human-Computer Interaction',
        school: 'Georgia Institute of Technology',
        duration: '2012 - 2014',
        description: 'Focused research on scalable web layouts and responsive UI patterns.'
      }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'VP of Product Experience',
        company: 'DesignCo Global',
        duration: '2021 - Present',
        description: 'Supervising 25 designers, UI engineers, and technical researchers creating global SaaS tools.'
      }
    ],
    downloads: [
      {
        id: 'dl-1',
        title: 'DesignCo Q3 Enterprise Brochure',
        type: 'brochure',
        fileUrl: '#',
        fileSize: '4.2 MB'
      }
    ],
    businessHours: defaultBusinessHours(),
    qrCode: {
      enabled: true,
      color: '#0F172A',
      bgColor: '#FFFFFF',
      gradientEnabled: true,
      gradientColor: '#2563EB',
      frameStyle: 'sleek',
      frameText: 'SCAN MY CARD'
    },
    seo: {
      slug: 'alexrivera',
      metaTitle: 'Alex Rivera - VP of Design | CardNest',
      metaDescription: 'Digital interactive business card of Alex Rivera, leading UI/UX & Product Design at DesignCo.',
      keywords: 'product design, ui/ux, executive card, designco'
    },
    analytics: generateMockAnalytics(1)
  },

  // 2. Developer / Tech Minimalist Template (Sarah Chen)
  {
    id: 'card-developer',
    userId: 'user-002',
    slug: 'sarahchen',
    templateId: 'developer',
    status: 'published',
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-07-20T09:15:00Z',
    theme: {
      id: 'theme-developer',
      name: 'Cyberpunk Terminal',
      primaryColor: '#10B981', // Emerald/Green 500
      secondaryColor: '#14B8A6', // Teal 500
      accentColor: '#3B82F6', // Blue 500
      backgroundColor: '#030712', // Gray 950
      textColor: '#E5E7EB', // Gray 200
      fontFamily: 'JetBrains Mono',
      borderRadius: 'none', // Brutalist square
      cardStyle: 'bordered',
      buttonStyle: 'outline',
      iconStyle: 'square',
      glassEffect: false,
      animations: 'dynamic',
      darkMode: true
    },
    hero: {
      enabled: true,
      type: 'gradient',
      mediaUrl: '',
      posterUrl: '',
      gradientStart: '#022C22',
      gradientEnd: '#030712',
      solidColor: '',
      loop: false,
      muted: true,
      autoplay: false,
      overlayColor: '#000000',
      overlayOpacity: 0.3,
      overlayBlur: 2,
      height: 'small',
      textPosition: 'top',
      parallax: false
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      borderWidth: 2,
      borderColor: '#10B981',
      shadow: 'glow',
      size: 'medium',
      position: 'center',
      zoom: 1.1,
      rotation: 0
    },
    companyLogo: {
      enabled: false,
      url: '',
      position: 'inline',
      size: 'small',
      rounded: false,
      shadow: false
    },
    profile: {
      prefix: '',
      firstName: 'Dr. Sarah',
      lastName: 'Chen',
      designation: 'Staff AI Engineer',
      company: 'Synthetix Research',
      tagline: 'Compiling neural models & cloud-native inference pipelines.',
      about: 'Sarah Chen designs high-performance LLM deployment systems and custom AI agents. Previously research scientist at OpenAI and deep learning consultant, she lives in the shell and writes type-safe distributed infrastructure.'
    },
    contact: {
      phone: '+44 7911 123456',
      whatsapp: '+447911123456',
      email: 'schen@synthetix.ai',
      website: 'https://synthetix.ai',
      address: 'Tech City, Shoreditch, London EC1V',
      googleMapsUrl: 'https://maps.google.com'
    },
    socialLinks: [
      { id: 'sc-dev-1', platform: 'github', url: 'https://github.com' },
      { id: 'sc-dev-2', platform: 'linkedin', url: 'https://linkedin.com' },
      { id: 'sc-dev-3', platform: 'telegram', url: 'https://telegram.org' },
      { id: 'sc-dev-4', platform: 'twitter', url: 'https://twitter.com' }
    ],
    customButtons: [
      {
        id: 'btn-dev-1',
        text: 'View HuggingFace Space',
        url: 'https://huggingface.co',
        icon: 'Code2',
        backgroundColor: '#10B981',
        textColor: '#030712',
        hoverAnimation: 'glow',
        borderRadius: 'none',
        style: 'filled',
        visible: true
      }
    ],
    about: {
      enabled: true,
      title: '[0x01] RESEARCH INTERESTS',
      description: 'Distributed training, low-bit quantizations, serverless GPU routing, and Rust-based runtime safety patterns.',
      readMoreEnabled: false
    },
    services: [
      {
        id: 'srv-dev-1',
        title: 'Custom Model Tuning',
        description: 'Parameter-efficient fine-tuning (LoRA/QLoRA) optimized for specialized healthcare datasets.',
        icon: 'Cpu'
      },
      {
        id: 'srv-dev-2',
        title: 'Distributed Architecture',
        description: 'Setup and design of auto-scaling Kubernetes workloads with GPU-direct storage access.',
        icon: 'Server'
      }
    ],
    products: [
      {
        id: 'prd-dev-1',
        title: 'LLM Latency Optimizer Script',
        price: '$199',
        description: 'A pre-configured engine that reduces TTFT (Time to First Token) by up to 40% on vLLM setups.',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
        whatsappOrder: true
      }
    ],
    gallery: [],
    videos: [],
    testimonials: [
      {
        id: 'tst-dev-1',
        customerName: 'Aidan Kelly',
        rating: 5,
        description: 'Dr. Chen solved our model cold-start bottleneck in 3 days. Unbelievable precision and deep hardware knowledge.',
        company: 'NeuroScale Ltd'
      }
    ],
    certificates: [
      {
        id: 'crt-dev-1',
        title: 'Deep Learning Specialization',
        issuedBy: 'DeepLearning.AI',
        date: '2023-01-10',
        imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300&auto=format&fit=crop&q=80'
      }
    ],
    skills: [
      { id: 'sk-dev-1', name: 'PyTorch / GPU Kernels', percentage: 98, color: '#10B981' },
      { id: 'sk-dev-2', name: 'Rust & WebAssembly', percentage: 92, color: '#14B8A6' },
      { id: 'sk-dev-3', name: 'Kubernetes Workloads', percentage: 88, color: '#3B82F6' }
    ],
    education: [
      {
        id: 'edu-dev-1',
        degree: 'Ph.D. in Computer Science (Artificial Intelligence)',
        school: 'University of Cambridge',
        duration: '2108 - 2022',
        description: 'Thesis: Neural representation alignment inside large transformers.'
      }
    ],
    experience: [
      {
        id: 'exp-dev-1',
        role: 'Staff AI Engineer',
        company: 'Synthetix Research',
        duration: '2024 - Present',
        description: 'Leading model infrastructure division and multi-million parameter inference clusters.'
      }
    ],
    downloads: [
      {
        id: 'dl-dev-1',
        title: 'Inference Benchmarks Whitepaper',
        type: 'portfolio',
        fileUrl: '#',
        fileSize: '1.8 MB'
      }
    ],
    businessHours: defaultBusinessHours(),
    qrCode: {
      enabled: true,
      color: '#10B981',
      bgColor: '#030712',
      gradientEnabled: false,
      frameStyle: 'none'
    },
    seo: {
      slug: 'sarahchen',
      metaTitle: 'Dr. Sarah Chen | Staff AI Engineer | CardNest',
      metaDescription: 'AI research portfolio, custom models, and terminal contacts of Dr. Sarah Chen.',
      keywords: 'machine learning, AI staff engineer, Rust AI developer'
    },
    analytics: generateMockAnalytics(1.5)
  },

  // 3. Creative / Luxury Template (Elena Rostova - Photographer)
  {
    id: 'card-luxury',
    userId: 'user-001',
    slug: 'elenarostova',
    templateId: 'photographer',
    status: 'published',
    createdAt: '2026-04-10T11:00:00Z',
    updatedAt: '2026-07-18T10:30:00Z',
    theme: {
      id: 'theme-luxury',
      name: 'Luxury Champagne',
      primaryColor: '#78350F', // Warm Amber 900
      secondaryColor: '#D97706', // Amber 600
      accentColor: '#F59E0B', // Gold
      backgroundColor: '#FFFBEB', // Amber 50
      textColor: '#451A03', // Amber 950
      fontFamily: 'Playfair Display',
      borderRadius: 'full',
      cardStyle: 'glassmorphism',
      buttonStyle: 'filled',
      iconStyle: 'minimal',
      glassEffect: true,
      animations: 'smooth',
      darkMode: false
    },
    hero: {
      enabled: true,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80', // Beautiful photography background
      posterUrl: '',
      loop: false,
      muted: true,
      autoplay: false,
      overlayColor: '#000000',
      overlayOpacity: 0.25,
      overlayBlur: 1,
      height: 'large',
      textPosition: 'bottom',
      parallax: true
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      borderWidth: 3,
      borderColor: '#F59E0B',
      shadow: 'glow',
      size: 'large',
      position: 'center',
      zoom: 1,
      rotation: 0
    },
    companyLogo: {
      enabled: false,
      url: '',
      position: 'inline',
      size: 'small',
      rounded: false,
      shadow: false
    },
    profile: {
      prefix: '',
      firstName: 'Elena',
      lastName: 'Rostova',
      designation: 'Fine Art Editorial Photographer',
      company: 'Rostova Studio',
      tagline: 'Capturing silent stories and timeless golden light.',
      about: 'Elena Rostova travels between Paris and Milan capturing high-fashion editorials and quiet natural portraits. Her work has been featured twice in Vogue Italia and Harper\'s Bazaar.'
    },
    contact: {
      phone: '+33 6 1234 5678',
      whatsapp: '+33612345678',
      email: 'studio@elenarostova.com',
      website: 'https://elenarostova.com'
    },
    socialLinks: [
      { id: 'sc-lux-1', platform: 'instagram', url: 'https://instagram.com' },
      { id: 'sc-lux-2', platform: 'pinterest', url: 'https://pinterest.com' },
      { id: 'sc-lux-3', platform: 'threads', url: 'https://threads.net' }
    ],
    customButtons: [
      {
        id: 'btn-lux-1',
        text: 'Request Milan Bridal Catalog',
        url: '#',
        icon: 'BookOpen',
        backgroundColor: '#78350F',
        textColor: '#FFFBEB',
        hoverAnimation: 'scale',
        borderRadius: 'full',
        style: 'filled',
        visible: true
      }
    ],
    about: {
      enabled: true,
      title: 'AESTHETIC MANIFESTO',
      description: 'Photography is the art of pausing a breath, a touch of light, an unspoken secret, and locking it in an eternal crystalline frame.',
      readMoreEnabled: false
    },
    services: [
      {
        id: 'srv-lux-1',
        title: 'Editorial & Haute Couture',
        description: 'Complete high-fashion visual narratives including location sourcing, lighting design, and professional retouches.',
        icon: 'Sparkles'
      },
      {
        id: 'srv-lux-2',
        title: 'Destination Weddings',
        description: 'Comprehensive wedding visual journaling across Europe and the Amalfi Coast.',
        icon: 'Heart'
      }
    ],
    products: [],
    gallery: [
      { id: 'gal-lux-1', type: 'image', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80', title: 'Milan Runway' },
      { id: 'gal-lux-2', type: 'image', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80', title: 'Sunset Silhouette' },
      { id: 'gal-lux-3', type: 'image', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop&q=80', title: 'Golden Hour' }
    ],
    videos: [],
    testimonials: [
      {
        id: 'tst-lux-1',
        customerName: 'Sophia Loren',
        rating: 5,
        description: 'Elena is a poet with a lens. She made us feel completely at ease, capturing moments that felt entirely candid yet looked like fine oil paintings.',
        company: 'Vogue Milan'
      }
    ],
    certificates: [],
    skills: [
      { id: 'sk-lux-1', name: 'Natural Lighting Composition', percentage: 100, color: '#D97706' },
      { id: 'sk-lux-2', name: 'Medium Format Film Retouch', percentage: 95, color: '#78350F' }
    ],
    education: [],
    experience: [],
    downloads: [],
    businessHours: defaultBusinessHours(),
    qrCode: {
      enabled: true,
      color: '#78350F',
      bgColor: '#FFFBEB',
      gradientEnabled: true,
      gradientColor: '#D97706',
      frameStyle: 'accent',
      frameText: 'PORTFOLIO'
    },
    seo: {
      slug: 'elenarostova',
      metaTitle: 'Elena Rostova Fine Art Photography | CardNest',
      metaDescription: 'Editorial fashion and bridal destination photography by Paris-based Elena Rostova.',
      keywords: 'bridal photography, Milan editorial fashion, fine art film'
    },
    analytics: generateMockAnalytics(0.8)
  }
];

// SaaS Pricing Plans
export const subscriptionPlans = [
  {
    name: 'Free',
    price: '$0',
    billing: 'forever',
    description: 'Perfect for professionals just testing the digital waters.',
    features: [
      '1 Active Digital Business Card',
      'Choose from 3 Basic Themes',
      'Interactive Contact Buttons (Phone, WhatsApp, Email)',
      'Basic Social Links (up to 3)',
      'Dynamic QR Code Generation',
      '7-Day Client Views History',
      'Standard SSL & CardNest Domain (/alexrivera)'
    ],
    actionText: 'Get Started for Free',
    badge: 'Starter'
  },
  {
    name: 'Premium',
    price: '$19',
    billing: 'month',
    description: 'Engineered for scaling creators, consultants, and leaders.',
    features: [
      'Unlimited Active Business Cards',
      'All 15 Ready-to-Use Layouts & Custom Themes',
      'Full Hero Section Settings (Images + Autoplay Videos)',
      'Services & Products Modules (with direct WhatsApp order buttons)',
      'Unlimited Social & Custom Navigation Links',
      'Portfolio Sliders & Image/Video Gallery Lightboxes',
      'Client Testimonials, Certificates, and Timelines',
      'Advanced Custom Customizations (Fonts, Colors, Border Radius)',
      'Downloadable Assets (Resume, Portfolio, Broachures)',
      'Interactive Appointment Booking Calendar Slots',
      'Full Dynamic Analytics Suite (Cities, Devices, Countries, Clicks)',
      'Custom Domain Support (e.g. card.yourname.com)'
    ],
    actionText: 'Upgrade to Premium',
    badge: 'Most Popular',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$99',
    billing: 'month',
    description: 'Custom setups for firms, medical practices, and agencies.',
    features: [
      'Everything in Premium included',
      'Centralized Teams & Employees Admin Panel',
      'Sub-Accounts Management & Custom Hierarchy Roles',
      'Instant Template Bulk Sync (Edit once, deploy to 500 team members)',
      'Dedicated Customer Success & Graphic Design Consultation',
      'Priority Fast-Track SLA Server Response',
      'Custom Database Integrations (CRM syncing for captured leads)',
      'White-Labeled Builder UI & Domain'
    ],
    actionText: 'Contact Enterprise Sales',
    badge: 'Scale Team'
  }
];

// Admin metrics preseeded logs
export const mockAdminStats = {
  totalUsers: 1420,
  activePremiumUsers: 489,
  totalRevenue: 9812,
  averageOrderValue: 24.50,
  monthlyActiveCards: 2890,
  totalCardViews: 148200,
  storageMBUsed: 12040,
  totalSubscriptions: [
    { name: 'Jan', revenue: 4200, users: 210 },
    { name: 'Feb', revenue: 5400, users: 280 },
    { name: 'Mar', revenue: 6900, users: 340 },
    { name: 'Apr', revenue: 7800, users: 410 },
    { name: 'May', revenue: 8400, users: 450 },
    { name: 'Jun', revenue: 9812, users: 489 }
  ],
  recentActivities: [
    { id: 'act-1', type: 'signup', desc: 'Marcus Vance signed up for a Free account', date: '5 minutes ago' },
    { id: 'act-2', type: 'payment', desc: 'Dr. Sarah Chen upgraded to Premium plan ($19)', date: '3 hours ago' },
    { id: 'act-3', type: 'card_created', desc: 'Elena Rostova published card "elenarostova"', date: '1 day ago' },
    { id: 'act-4', type: 'payment', desc: 'DesignCo team processed monthly renewal ($99)', date: '2 days ago' },
    { id: 'act-5', type: 'support', desc: 'Super Admin updated Corporate Theme defaults', date: '3 days ago' }
  ],
  recentUsers: [
    { id: 'user-001', name: 'Alex Rivera', email: 'alex.rivera@designco.io', role: 'Premium User', cards: 2, status: 'Active' },
    { id: 'user-002', name: 'Dr. Sarah Chen', email: 'dr.sarah.chen@medcare.org', role: 'Premium User', cards: 1, status: 'Active' },
    { id: 'user-free', name: 'Marcus Vance', email: 'marcus.vance@gmail.com', role: 'Free User', cards: 0, status: 'Active' },
    { id: 'user-suspended', name: 'John Grisham', email: 'john@lawfirm.com', role: 'Free User', cards: 1, status: 'Suspended' }
  ]
};

// Help & FAQ preseeded topics
export const mockFAQs = [
  {
    question: 'How does a digital business card work?',
    answer: 'A digital business card is a premium, web-optimized profile that replaces traditional paper cards. You customize your page with contact details, social profiles, maps, and products. Anyone can view your card instantly by tapping your NFC tag or scanning your dynamic CardNest QR code — no application downloads required!'
  },
  {
    question: 'Can I link my own custom domain to my business card?',
    answer: 'Absolutely! Premium and Enterprise users can configure custom DNS records (CNAME) so their business card is served from their own branded domain, like card.yourname.com.'
  },
  {
    question: 'How do customers book appointments through my card?',
    answer: 'Inside the CardNest Builder, you can toggle the "Appointment Booking" section. You define your availability slots, and users can submit their names, emails, and booking notes directly from your card. You are notified instantly, and bookings are logged right in your dashboard!'
  },
  {
    question: 'Can I update my details after printing the QR code?',
    answer: 'Yes! The QR code points to your unique slug (e.g. cardnest.app/sarahchen). Since the URL remains constant, you can edit your phone numbers, resume, portfolios, and colors anytime. The printed QR code will always direct scanners to your latest live information.'
  },
  {
    question: 'Is my personal data secure?',
    answer: 'Security is our highest priority. All card transactions, contact requests, and files are encrypted using bank-grade SSL. We implement rigorous Row-Level Security policies on top of our relational database, ensuring your credentials and client appointments remain private.'
  }
];

// Helper to generate RFC-compliant UUID v4
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper to compile a blank/initial card for building
export const createInitialCard = (userId: string, slug: string): DigitalCard => ({
  id: generateUUID(),
  userId,
  slug,
  templateId: 'corporate',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  theme: {
    id: generateUUID(),
    name: 'Custom Slate',
    primaryColor: '#1E293B',
    secondaryColor: '#3B82F6',
    accentColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#0F172A',
    fontFamily: 'Inter',
    borderRadius: 'md',
    cardStyle: 'flat',
    buttonStyle: 'filled',
    iconStyle: 'circle',
    glassEffect: false,
    animations: 'subtle',
    darkMode: false
  },
  hero: {
    enabled: true,
    type: 'gradient',
    mediaUrl: '',
    gradientStart: '#1E293B',
    gradientEnd: '#475569',
    solidColor: '',
    loop: false,
    muted: true,
    autoplay: false,
    overlayColor: '#000000',
    overlayOpacity: 0.1,
    overlayBlur: 0,
    height: 'medium',
    textPosition: 'center',
    parallax: false
  },
  avatar: {
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadow: 'md',
    size: 'medium',
    position: 'center',
    zoom: 1,
    rotation: 0
  },
  companyLogo: {
    enabled: false,
    url: '',
    position: 'inline',
    size: 'small',
    rounded: true,
    shadow: true
  },
  profile: {
    prefix: '',
    firstName: 'New',
    lastName: 'User',
    designation: 'Professional Specialist',
    company: 'Innovate Solutions',
    tagline: 'Passionate about crafting elegant web interfaces.',
    about: 'I am a highly motivated specialist delivering excellence across collaborative technical pipelines.'
  },
  contact: {
    phone: '+1 (555) 123-4567',
    whatsapp: '+15551234567',
    email: 'newuser@innovate.com',
    website: 'https://innovate.com'
  },
  socialLinks: [
    { id: 'sl-1', platform: 'linkedin', url: 'https://linkedin.com' },
    { id: 'sl-2', platform: 'github', url: 'https://github.com' }
  ],
  customButtons: [],
  about: {
    enabled: false,
    title: 'My Background',
    description: 'Providing client-focused consulting and development support.',
    readMoreEnabled: false
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
  businessHours: defaultBusinessHours(),
  qrCode: {
    enabled: true,
    color: '#0F172A',
    bgColor: '#FFFFFF',
    gradientEnabled: false,
    frameStyle: 'none'
  },
  seo: {
    slug,
    metaTitle: 'My Digital Business Card',
    metaDescription: 'Interactive, modern digital business card crafted on CardNest.',
    keywords: 'business card, digital business card, contactless profile'
  },
  analytics: {
    views: 0,
    visitors: 0,
    qrScans: 0,
    downloads: 0,
    clicks: 0,
    countries: [],
    cities: [],
    browsers: [],
    devices: [],
    operatingSystems: [],
    timeline: []
  }
});
