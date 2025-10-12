
import { Routes, Route, Navigate } from "react-router-dom"; // Add Navigate
import { useSmoothScroll } from "./hooks/useSmoothScroll";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Mobile from "./components/mobile/MobileView";

import { BasicLayout } from "./components/layout/BasicLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LogoutSuccess from "./pages/LogoutSuccess";

import MedicalInfoForm from "./pages/MedicalInfoForm"
// Placeholder component for other pages
const PlaceholderPage = ({ title }) => (
  <div className="bg-background-secondary p-8 rounded-xl border border-border-primary">
    <h1 className="text-2xl font-bold text-text-primary">{ title }</h1>
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

      <Route path="/form" element={<MedicalInfoForm/>}/>
      <Route element={<BasicLayout />}>
        {/* Redirect /dashboard to the main dashboard view */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/basic" replace />} />
        <Route path="/dashboard/basic" element={<Dashboard />} />
        <Route path="/dashboard/health" element={<PlaceholderPage title="Dane Zdrowotne" />} />
        <Route path="/dashboard/health/conditions" element={<PlaceholderPage title="Choroby przewlekłe" />} />
        <Route path="/dashboard/health/medications" element={<PlaceholderPage title="Przyjmowane leki" />} />
        <Route path="/dashboard/health/allergies" element={<PlaceholderPage title="Alergie" />} />
        <Route path="/dashboard/products" element={<PlaceholderPage title="Produkty" />} />
        <Route path="/dashboard/products/nfc" element={<PlaceholderPage title="Opaska ratunkowa NFC" />} />
        <Route path="/dashboard/settings" element={<PlaceholderPage title="Ustawienia" />} />
        
      </Route>
      <Route path="/mobile/scan" element={<Mobile/>} />
    </Routes>
  );
}

export default App;