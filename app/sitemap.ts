import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// We must use standard supabase-js client for sitemap since it executes isolated in build/edge often without auth cookies.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://digitalheros.app'; // Placeholder domain

  // Get dynamic charities
  const { data: charities } = await supabase.from('charities').select('id, updated_at');
  
  const charityUrls = (charities || []).map((charity) => ({
    url: `${baseUrl}/charities/${charity.id}`,
    lastModified: charity.updated_at ? new Date(charity.updated_at) : new Date(),
    changeFrequency: 'weekly' as any,
    priority: 0.8,
  }));

  const routes = [
    '',
    '/how-it-works',
    '/charities',
    '/login',
    '/signup',
    '/subscribe',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as any,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...routes, ...charityUrls];
}
