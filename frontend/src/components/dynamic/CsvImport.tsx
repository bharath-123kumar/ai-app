'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CsvImport = ({ targetTable }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`/api/${targetTable}/import`, formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
      });
      alert('Import successful!');
      setFile(null);
      router.push('/tasks');
    } catch (err) {
      alert('Import failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
        <div className="card glass" style={{ borderStyle: 'dashed', borderWidth: '2px', textAlign: 'center', padding: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Upload size={32} color="var(--primary)" />
            </div>
            <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>File Import for {targetTable}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Drag and drop your CSV or PDF files here, or click to browse.</p>
                <input 
                    type="file" 
                    accept=".csv,.pdf" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="input"
                    style={{ maxWidth: '300px', margin: '0 auto' }}
                />
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '2rem', padding: '1rem 3rem' }} 
            disabled={!file || uploading}
            onClick={handleUpload}
          >
            {uploading ? 'Importing...' : 'Upload & Process'}
          </button>
        </div>
    </div>
  );
};
