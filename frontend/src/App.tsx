// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

// Page Imports
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LogoutSuccess from "./pages/LogoutSuccess";
import MedicalInfoForm from "./pages/MedicalInfoForm";
import Mobile from "./pages/Mobile";

// Layout Imports
// CORRECTED: The component that makes the choice is ResponsiveLayout
import { ResponsiveLayout } from "./components/layout/ResponseLayout";

import MedicalInfoForm from "./pages/MedicalInfoForm"
// Placeholder component for other pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="bg-background-secondary p-8 rounded-xl border border-border-primary">
    <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
    <p className="text-text-secondary mt-2">This is a placeholder page content.</p>
  </div>
);

function App() {
  useSmoothScroll();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout-success" element={<LogoutSuccess />} />

      <Route path="/mobile/scan" element={<Mobile />} />

      <Route element={<ResponsiveLayout />}>
        
        <Route path="/form" element={<MedicalInfoForm />} />
        
        <Route path="/dashboard" element={<Navigate to="/dashboard/basic" replace />} />
        <Route path="/dashboard/basic" element={<Dashboard />} />
        
        <Route path="/dashboard/health" element={<Navigate to="/dashboard/health/conditions" replace />} />
        <Route path="/dashboard/health/conditions" element={<PlaceholderPage title="Choroby przewlekłe" />} />
        <Route path="/dashboard/health/medications" element={<PlaceholderPage title="Przyjmowane leki" />} />
        <Route path="/dashboard/health/allergies" element={<PlaceholderPage title="Alergie" />} />
        
        <Route path="/dashboard/products" element={<Navigate to="/dashboard/products/nfc" replace />} />
        <Route path="/dashboard/products/nfc" element={<PlaceholderPage title="Opaska ratunkowa NFC" />} />
        
        <Route path="/dashboard/settings" element={<PlaceholderPage title="Ustawienia" />} />
      </Route>
    </Routes>
  );
}

export default App;