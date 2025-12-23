import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from './components/layout';
import { HomePage } from './pages/HomePage';
import { ReaderMenuPage } from './pages/reader/ReaderMenuPage';
import { ReaderContentPage } from './pages/reader/ReaderContentPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { SettingsModal } from './features/settings/components';
import { UpdatePrompt } from './components/UpdatePrompt';
import { useEffect, useState } from 'react';
import { apiClient } from './api/client';
import { LoadingPage } from './components/common';
import { Button } from './components/ui';
import { useLocalStorage } from './features/settings/hooks/useLocalStorage';

function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [themeMode] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  // Determine theme color based on current mode
  const themeColor = themeMode === 'dark' ? '#0f172a' : '#ffffff';

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await apiClient.get('/settings/maintenance');
        setIsMaintenance(response.data.maintenance_mode);
        setMaintenanceMessage(response.data.maintenance_message);
      } catch (error) {
        console.error('Failed to check maintenance status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenance();

    // Initialize theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (isLoading) {
    return <LoadingPage message="Memuat aplikasi..." />;
  }

  if (isMaintenance) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return (
    <>
      <Helmet>
        <title>Majmu' Manan</title>
        <meta name="theme-color" content={themeColor} />
        <meta name="description" content="Dari Juruladen BAM untuk keluarga BAM" />
        <meta name="keywords" content="Majmu' Manan, majmu' manan, majmu' bam, majmu manan, majmu bam, Asmul Husna, asmul husna, Doa Birrulwalidain, Qosidah Romadhon, doa birrulwalidain, qosidah romadhon" />
        <meta name="author" content="Juruladen BAM" />
      </Helmet>
      <Routes>
        <Route
          element={
            <PageLayout
              headerProps={{
                rightContent: (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-white/80 hover:text-white dark:text-slate-300"
                  >
                    ⚙️
                  </Button>
                ),
              }}
            />
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/bacaan/:slug" element={<ReaderMenuPage />} />
          <Route path="/bacaan/:slug/:sectionSlug" element={<ReaderContentPage />} />
        </Route>
      </Routes>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <UpdatePrompt />
    </>
  );
}

export default App;