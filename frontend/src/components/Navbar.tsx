'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <nav className="navbar glass container" style={{ marginTop: '1.5rem', borderRadius: '1.5rem' }}>
      <Link href="/" style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', borderRadius: '8px' }}></div>
        <span>AI App</span>
      </Link>
      
      <div className="nav-links">
        <Link href="/" className="nav-link">Dashboard</Link>
        {isAuthenticated && <Link href="/tasks" className="nav-link">Tasks</Link>}
        {isAuthenticated && <Link href="/tasks/add" className="nav-link">Add Task</Link>}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '1rem' }}>
            <Globe size={16} color="var(--muted)" />
            <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ background: 'none', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
            >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="es">ES</option>
            </select>
        </div>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem' }}>
                <User size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user?.name}</span>
            </div>
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" className="btn btn-secondary">Login</Link>
            <Link href="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
