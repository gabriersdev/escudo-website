'use server';

import fs from 'fs';
import path from 'path';

export async function checkPageExists(routePath: string): Promise<boolean> {
  // Normalize the route path
  const normalizedPath = routePath.startsWith('/') ? routePath.slice(1) : routePath;
  
  // Base directory for Next.js app router
  const appDir = path.join(process.cwd(), 'app');
  
  // The path could be a direct page.tsx
  const directPagePath = path.join(appDir, normalizedPath, 'page.tsx');
  if (fs.existsSync(directPagePath)) {
    return true;
  }
  
  // If it's a dynamic route, it's harder to check because the folder is like `[slug]`.
  // But usually, breadcrumbs link to parent directories like `/topic` which would need a `app/topic/page.tsx`.
  // If we're just checking if a specific static route page exists (like /topic/page.tsx), the above is sufficient.
  
  return false;
}
