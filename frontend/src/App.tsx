// App.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

// Page Imports
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LogoutSuccess from "./pages/LogoutSuccess";
import MedicalInfoForm from "./pages/MedicalInfoForm";
import Mobile from "./pages/Mobile";
import Settings from "./pages/Settings";

// === 1. Import the real health pages ===
import ChronicDiseases from "./pages/Chronic";
import Medications from "./pages/Medications";
import Allergies from "./pages/Allergies";

// Layout, Auth, and Data Provider Imports
import { ResponsiveLayout } from "./components/layout/ResponseLayout";
import { OnboardingLayout } from "./components/layout/OnboardingLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ProfileDataProvider } from "./context/ProfileDataContext"; // Import the data provider

// Wrapper that allows using ProfileDataProvider as a Route element
const ProfileDataWrapper = () => (
  <ProfileDataProvider>
    <Outlet />
  </ProfileDataProvider>
);

// Placeholder component (still useful for pages not yet built)
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
      {/* --- Group 1: Public Routes (No Layout or Protection) --- */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout-success" element={<LogoutSuccess />} />
      <Route path="/mobile/scan/:token" element={<Mobile />} />

      {/* --- Group 2: Protected Routes (Require Login) --- */}
      <Route element={<ProtectedRoute />}>
        {/* Use a Route whose element wraps children in ProfileDataProvider via Outlet */}
        <Route element={<ProfileDataWrapper />}>

          {/* Sub-Group A: The Onboarding Form Route */}
          <Route element={<OnboardingLayout />}>
            <Route path="/form" element={<MedicalInfoForm />} />
          </Route>

          {/* Sub-Group B: The Main Dashboard Routes */}
          <Route element={<ResponsiveLayout />}>
            <Route path="/dashboard" element={<Navigate to="/dashboard/basic" replace />} />
            <Route path="/dashboard/basic" element={<Dashboard />} />
            
            <Route path="/dashboard/health" element={<Navigate to="/dashboard/health/conditions" replace />} />
            
            {/* === 3. Replace placeholders with the real components === */}
            <Route path="/dashboard/health/conditions" element={<ChronicDiseases />} />
            <Route path="/dashboard/health/medications" element={<Medications />} />
            <Route path="/dashboard/health/allergies" element={<Allergies />} />
            
            <Route path="/dashboard/products" element={<Navigate to="/dashboard/products/nfc" replace />} />
            <Route path="/dashboard/products/nfc" element={<PlaceholderPage title="Opaska ratunkowa NFC" />} />
            
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  );
}

export default App;