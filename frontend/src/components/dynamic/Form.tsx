'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const Form = ({ fields, submitLabel, action }: any) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { token, login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${action}`, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (action.includes('login')) {
        login(res.data.token, res.data.user);
        router.push('/tasks');
      } else if (action.includes('register')) {
        alert('Registered successfully! Please login.');
        router.push('/login');
      } else {
        alert('Saved successfully!');
        router.push('/');
      }
    } catch (err: any) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      onSubmit={handleSubmit} 
      className="card container" 
      style={{ maxWidth: '480px', margin: '4rem auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t(submitLabel)}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Please enter the details below to continue.</p>
      </div>

      {fields.map((field: string) => (
        <div key={field} className="input-group">
          <label className="input-label">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            className="input"
            type={field.includes('password') ? 'password' : 'text'}
            placeholder={`Enter your ${field}...`}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            required
          />
        </div>
      ))}

      <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
        {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                Processing...
            </div>
        ) : t(submitLabel)}
      </button>

      <style jsx>{`
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.form>
  );
};
