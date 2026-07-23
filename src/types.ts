/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'premium_user' | 'free_user' | 'visitor';
  isVerified?: boolean;
  subscription: {
    plan: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
    status: 'active' | 'suspended' | 'expired';
    expiresAt: string;
    price: number;
  };
  avatarUrl?: string;
  joinedAt: string;
}

export interface CardTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: 'Inter' | 'Outfit' | 'JetBrains Mono' | 'Playfair Display';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  cardStyle: 'flat' | 'elevated' | 'glassmorphism' | 'bordered';
  buttonStyle: 'filled' | 'outline' | 'pill' | 'shadow';
  iconStyle: 'minimal' | 'circle' | 'square' | 'accent';
  glassEffect: boolean;
  animations: 'subtle' | 'smooth' | 'dynamic' | 'none';
  darkMode: boolean;
}

export interface HeroSection {
  enabled: boolean;
  type: 'image' | 'video' | 'gradient' | 'solid' | 'none';
  mediaUrl: string; // URL for image or video
  posterUrl?: string;
  gradientStart?: string;
  gradientEnd?: string;
  solidColor?: string;
  loop: boolean;
  muted: boolean;
  autoplay: boolean;
  overlayColor: string;
  overlayOpacity: number; // 0 to 1
  overlayBlur: number; // in px
  height: 'small' | 'medium' | 'large' | 'full';
  textPosition: 'top' | 'center' | 'bottom';
  parallax: boolean;
}

export interface ProfileAvatar {
  url: string;
  borderWidth: number;
  borderColor: string;
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'glow';
  size: 'small' | 'medium' | 'large';
  position: 'left' | 'center' | 'right';
  zoom: number;
  rotation: number;
}

export interface CompanyLogo {
  enabled: boolean;
  url: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  size: 'small' | 'medium' | 'large';
  rounded: boolean;
  shadow: boolean;
}

export interface ProfileInfo {
  prefix?: string;
  firstName: string;
  lastName: string;
  designation: string;
  company: string;
  tagline: string;
  about: string;
  avatarUrl?: string;
}

export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  email?: string;
  sms?: string;
  website?: string;
  address?: string;
  googleMapsUrl?: string;
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'twitter' | 'github' | 'telegram' | 'threads' | 'pinterest' | 'tiktok' | 'discord' | 'snapchat' | 'custom';
  url: string;
  label?: string;
  icon?: string;
}

export interface CustomButton {
  id: string;
  text: string;
  url: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  hoverAnimation: 'scale' | 'glow' | 'bounce' | 'none';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  style: 'filled' | 'outline';
  visible: boolean;
}

export interface AboutSection {
  enabled: boolean;
  title: string;
  description: string;
  readMoreEnabled: boolean;
  readMoreText?: string;
  backgroundColor?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl?: string;
  whatsappOrder: boolean;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
}

export interface VideoItem {
  id: string;
  type: 'youtube' | 'vimeo' | 'mp4';
  url: string;
  title?: string;
}

export interface TestimonialItem {
  id: string;
  customerName: string;
  customerImage?: string;
  rating: number; // 1-5
  description: string;
  company?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuedBy: string;
  date: string;
  imageUrl?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  percentage: number; // 0-100
  color?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  duration: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  description?: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  type: 'resume' | 'portfolio' | 'brochure' | 'price_list' | 'custom';
  fileUrl: string;
  fileSize?: string;
}

export interface BusinessDay {
  enabled: boolean;
  openTime: string;
  closeTime: string;
  is24Hours: boolean;
}

export interface BusinessHours {
  monday: BusinessDay;
  tuesday: BusinessDay;
  wednesday: BusinessDay;
  thursday: BusinessDay;
  friday: BusinessDay;
  saturday: BusinessDay;
  sunday: BusinessDay;
}

export interface AppointmentSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  cardId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export interface QRCodeSettings {
  enabled: boolean;
  color: string;
  bgColor: string;
  logoUrl?: string;
  gradientEnabled: boolean;
  gradientColor?: string;
  frameStyle: 'none' | 'sleek' | 'rounded' | 'accent';
  frameText?: string;
  foregroundColor?: string;
  backgroundColor?: string;
  includeLogo?: boolean;
}

export interface SEOSettings {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl?: string;
}

export interface AnalyticsCard {
  views: number;
  visitors: number;
  qrScans: number;
  downloads: number;
  clicks: number;
  countries: { name: string; value: number }[];
  cities: { name: string; value: number }[];
  browsers: { name: string; value: number }[];
  devices: { name: string; value: number }[];
  operatingSystems: { name: string; value: number }[];
  timeline: { date: string; views: number; scans: number }[];
}

export interface DigitalCard {
  id: string;
  userId: string;
  slug: string;
  templateId: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  
  // Modules
  theme: CardTheme;
  hero: HeroSection;
  avatar: ProfileAvatar;
  companyLogo: CompanyLogo;
  profile: ProfileInfo;
  contact: ContactInfo;
  socialLinks: SocialLink[];
  customButtons: CustomButton[];
  about: AboutSection;
  services: ServiceItem[];
  products: ProductItem[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  testimonials: TestimonialItem[];
  certificates: CertificateItem[];
  skills: SkillItem[];
  education: EducationItem[];
  experience: ExperienceItem[];
  downloads: DownloadItem[];
  businessHours: BusinessHours;
  qrCode: QRCodeSettings;
  seo: SEOSettings;
  analytics: AnalyticsCard;
}

export interface CMSLandingSettings {
  heroTitle: string;
  heroSubtitle: string;
  features: { icon: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  testimonials: { author: string; role: string; quote: string; avatar: string }[];
}
