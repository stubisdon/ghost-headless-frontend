// Ghost Content API client
// 
// IMPORTANT: Get your Content API key from:
// Ghost Admin → Settings → Integrations → Create Custom Integration
// Copy the "Content API Key" (not the Admin API Key)

const API_URL = process.env.GHOST_API_URL || 'https://catsky.club/ghost/api/content';
const API_KEY = process.env.GHOST_CONTENT_API_KEY || 'your-api-key';

// Note: API calls must be made from server-side code (Next.js API routes, Node.js, etc.)
// Direct browser calls will fail due to CORS restrictions

export async function getPosts() {
  const url = `${API_URL}/posts/?key=${API_KEY}&include=tags,authors&limit=all`;
  const response = await fetch(url);
  const data = await response.json();
  return data.posts || [];
}

export async function getPost(slug) {
  const url = `${API_URL}/posts/slug/${slug}/?key=${API_KEY}&include=tags,authors`;
  const response = await fetch(url);
  const data = await response.json();
  return data.posts?.[0] || null;
}

export async function getSiteSettings() {
  const url = `${API_URL}/settings/?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.settings || {};
}

export async function getAuthors() {
  const url = `${API_URL}/authors/?key=${API_KEY}&limit=all`;
  const response = await fetch(url);
  const data = await response.json();
  return data.authors || [];
}

export async function getTags() {
  const url = `${API_URL}/tags/?key=${API_KEY}&limit=all`;
  const response = await fetch(url);
  const data = await response.json();
  return data.tags || [];
}






