import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './app/AdminLayout';
import { ProtectedRoute } from './app/ProtectedRoute';
import { BacaanListPage } from './pages/bacaan/BacaanListPage';
import { BacaanDetailPage } from './pages/bacaan/BacaanDetailPage';
import { SettingsPage } from './pages/SettingsPage';

// Dashboard Placeholder
const DashboardPage = () => <div>Dashboard Content</div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bacaan" element={<BacaanListPage />} />
          <Route path="/bacaan/:id" element={<BacaanDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;