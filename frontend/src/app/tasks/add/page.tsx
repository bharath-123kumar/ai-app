'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';
import { DynamicRenderer } from '@/components/dynamic/Renderer';
import { useAuth } from '@/context/AuthContext';

export default function AddTaskPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const page = config.pages.find(p => p.route === '/tasks/add');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!page) return <div>Page not found</div>;
  if (!isAuthenticated) return null;

  return <DynamicRenderer components={page.components} />;
}
