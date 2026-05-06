'use client';

import { config } from '@/lib/config';
import { DynamicRenderer } from '@/components/dynamic/Renderer';

export default function RegisterPage() {
  const page = config.pages.find(p => p.route === '/register');
  if (!page) return <div>Page not found</div>;
  return <DynamicRenderer components={page.components} />;
}
