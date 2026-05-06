'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const Hero = ({ title, subtitle }: any) => {
  const { t } = useLanguage();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="hero"
    >
      <div className="container">
          <div className="badge" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>v2.0 is now live</div>
          <h1>{t(title)}</h1>
          <p>{t(subtitle)}</p>
          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/tasks" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>View My Tasks</Link>
              <button className="btn btn-secondary" style={{ padding: '1rem 2.5rem' }}>Documentation</button>
          </div>
      </div>
    </motion.section>
  );
};
