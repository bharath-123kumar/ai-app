import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Dynamic AI Platform',
  description: 'Production-ready config-driven platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main style={{ minHeight: '100vh' }}>
              {children}
            </main>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
