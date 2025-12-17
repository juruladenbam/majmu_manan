import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './app/PublicLayout';
import { HomePage } from './pages/HomePage';
import { ReaderMenuPage } from './pages/reader/ReaderMenuPage';
import { ReaderContentPage } from './pages/reader/ReaderContentPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { useEffect, useState } from 'react';
import { apiClient } from './api/client';
import { Center, Spinner } from '@chakra-ui/react';

function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="green.500" />
      </Center>
    );
  }

  if (isMaintenance) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bacaan/:slug" element={<ReaderMenuPage />} />
        <Route path="/bacaan/:slug/:sectionSlug" element={<ReaderContentPage />} />
      </Route>
    </Routes>
  );
}

export default App;