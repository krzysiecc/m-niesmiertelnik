// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUser, FaHeartbeat, FaBriefcaseMedical, FaPills,
  FaShoppingBag, FaCreditCard, FaCog, FaExclamationTriangle
} from 'react-icons/fa';

import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";

// Menu structure. `labelKey` is an i18n key resolved at render time.
const menuItems = [
  { labelKey: "nav.basicData", icon: <FaUser />, path: "/dashboard/basic" },
  { labelKey: "nav.healthData", icon: <FaHeartbeat />, path: "/dashboard/health", subItems: [
    { labelKey: "nav.chronicDiseases", icon: <FaBriefcaseMedical />, path: "/dashboard/health/conditions" },
    { labelKey: "nav.medications", icon: <FaPills />, path: "/dashboard/health/medications" },
    { labelKey: "nav.allergies", icon: <FaExclamationTriangle />, path: "/dashboard/health/allergies" },
  ]},
  { labelKey: "nav.products", icon: <FaShoppingBag />, path: "/dashboard/products", subItems: [
    { labelKey: "nav.nfcBand", icon: <FaCreditCard />, path: "/dashboard/products/nfc" },
  ]},
  { labelKey: "nav.settings", icon: <FaCog />, path: "/dashboard/settings" },
];

// Flattened version used for path -> title lookups.
const flattenedMenuItems = menuItems.flatMap(item =>
  item.subItems ? [item, ...item.subItems] : [item]
);

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

// Maps a route path to an i18n key (consumed by the Header to show the page title).
// eslint-disable-next-line react-refresh/only-export-components
export const pathTitles: Record<string, string> = {
  "/dashboard/basic": "nav.myPanel",
  ...Object.fromEntries(flattenedMenuItems.map(item => [item.path, item.labelKey])),
};

export const Sidebar = ({ isExpanded, onToggle }: SidebarProps) => {
  const { t } = useTranslation();
  const baseLinkClass = "flex items-center px-4 py-3 rounded-lg transition-colors";
  const activeLinkClass = "bg-accent-primary text-on-accent hover:bg-accent-primary-hover shadow-lg shadow-accent-primary/30";

  const AnimatedText = ({ text }: { text: React.ReactNode }) => (
    <span className={`px-4 whitespace-nowrap transition-transform duration-300 ${isExpanded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
      {text}
    </span>
  );

  return (
    // The width of the aside is now dynamic and animates smoothly
    <aside className={`fixed top-0 left-0 h-screen flex flex-col bg-background-primary border-r border-border-primary transition-all duration-300 ease-in-out ${isExpanded ? 'w-72' : 'w-21'}`}>

      <div className={`flex items-center p-6 mb-6 ${!isExpanded && 'justify-center'}`}>
        <img src="/logo.png" alt="Logo" className={`flex-shrink-0 ${isExpanded ? 'h-10' : 'h-8'}`} />
        <div className="overflow-hidden">
            <AnimatedText text={
                <span className="text-2xl font-bold text-text-primary">
                    <span className="text-accent-primary">m</span>Nieśmiertelnik
                </span>
            }/>
        </div>
      </div>

      {/* Main navigation links */}
      <nav className="flex-1 flex flex-col gap-2 px-4">
        {menuItems.map((item) => (
          <div key={item.path}>
            <NavLink
              to={item.path}
              end={!item.subItems}
              className={({ isActive }) =>
                `${baseLinkClass} transition-[padding] duration-300 px-4 ${
                  isActive
                    ? activeLinkClass
                    : "text-text-secondary hover:bg-background-tertiary"
                }`
              }

            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div className="overflow-hidden">
                <AnimatedText text={<span className="font-semibold">{t(item.labelKey)}</span>} />
              </div>
            </NavLink>


            {/* Sub-items with a smooth transition */}
            <div className={`transition-all duration-300 ease-in-out grid ${isExpanded && item.subItems ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                {item.subItems && (
                    <div className="mt-2 flex flex-col gap-2 pl-8 border-l-2 border-border-primary ml-6">
                        {item.subItems.map((sub) => (
                        <NavLink key={sub.path} to={sub.path} className={({ isActive }) => `${baseLinkClass} text-sm ${isActive ? activeLinkClass : "text-text-secondary"}`}>
                            <span className="text-lg flex-shrink-0">{sub.icon}</span>
                            <div className="overflow-hidden">
                                <AnimatedText text={<span>{t(sub.labelKey)}</span>}/>
                            </div>
                        </NavLink>
                        ))}
                    </div>
                )}
                </div>
            </div>
          </div>
        ))}
      </nav>

      {/* Toggle button at the bottom */}
      <div className="p-4 mt-auto border-t border-border-primary">
          <button
            onClick={onToggle}
            className={`${baseLinkClass} w-full ${!isExpanded && 'justify-center'} text-text-secondary`}
          >
            <span className="text-xl flex-shrink-0">{isExpanded ? <LuChevronsLeft /> : <LuChevronsRight />}</span>
            <div className="overflow-hidden">
                <AnimatedText text={<span className="font-semibold">{t('nav.collapse')}</span>} />
            </div>
          </button>
      </div>
    </aside>
  );
};
