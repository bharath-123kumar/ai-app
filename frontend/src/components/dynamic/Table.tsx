'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export const Table = ({ title, source }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/${source}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [source, token]);

  if (loading) return <div className="card">Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
      style={{ marginTop: '2rem', paddingBottom: '4rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{t(title)}</h2>
          <div className="badge">{data.length} Total Records</div>
      </div>
      
      <div className="table-container glass">
        <table className="table">
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).filter(k => k !== 'id').map(key => (
                <th key={key}>{key.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <motion.tr 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {Object.entries(row).filter(([k]) => k !== 'id').map(([key, val]: any) => (
                  <td key={key}>
                      <span style={{ 
                          color: key.includes('priority') ? (val === 'high' ? '#f43f5e' : (val === 'medium' ? '#fbbf24' : '#10b981')) : 'inherit',
                          fontWeight: key.includes('priority') ? '600' : '400'
                      }}>
                        {val}
                      </span>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>No data found in this table.</p>
                <button className="btn btn-secondary">Create First Entry</button>
            </div>
        )}
      </div>
    </motion.div>
  );
};
