// Ghost Content API client
// 
// IMPORTANT: Get your Content API key from:
// Ghost Admin → Settings → Integrations → Create Custom Integration
// Copy the "Content API Key" (not the Admin API Key)

const API_URL = process.env.GHOST_API_URL || 'https://catsky.club/ghost/api/content';
const API_KEY = process.env.GHOST_CONTENT_API_KEY || '';

// Note: API calls must be made from server-side code (Next.js API routes, Node.js, etc.)
// Direct browser calls will fail due to CORS restrictions

export interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  featured: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt: string | null;
  codeinjection_head: string | null;
  codeinjection_foot: string | null;
  custom_template: string | null;
  canonical_url: string | null;
  authors: GhostAuthor[];
  tags: GhostTag[];
  primary_author: GhostAuthor;
  primary_tag: GhostTag | null;
  url: string;
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  cover_image: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  facebook: string | null;
  twitter: string | null;
  url: string;
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  feature_image: string | null;
  visibility: string;
  url: string;
}

export interface GhostSettings {
  title: string;
  description: string;
  logo: string | null;
  icon: string | null;
  accent_color: string;
  cover_image: string | null;
  facebook: string | null;
  twitter: string | null;
  lang: string;
  timezone: string;
  navigation: Array<{ label: string; url: string }>;
  secondary_navigation: Array<{ label: string; url: string }>;
  url: string;
}

export async function getPosts(limit: number = 15): Promise<GhostPost[]> {
  const url = `${API_URL}/posts/?key=${API_KEY}&include=tags,authors&limit=${limit}&order=published_at DESC`;
  const response = await fetch(url);
  const data = await response.json();
  return data.posts || [];
}

export async function getPost(slug: string): Promise<GhostPost | null> {
  const url = `${API_URL}/posts/slug/${slug}/?key=${API_KEY}&include=tags,authors`;
  const response = await fetch(url);
  const data = await response.json();
  return data.posts?.[0] || null;
}

export async function getSiteSettings(): Promise<GhostSettings> {
  const url = `${API_URL}/settings/?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.settings;
}

export async function getAuthors(): Promise<GhostAuthor[]> {
  const url = `${API_URL}/authors/?key=${API_KEY}&limit=all`;
  const response = await fetch(url);
  const data = await response.json();
  return data.authors || [];
}

export async function getTags(): Promise<GhostTag[]> {
  const url = `${API_URL}/tags/?key=${API_KEY}&limit=all`;
  const response = await fetch(url);
  const data = await response.json();
  return data.tags || [];
}

