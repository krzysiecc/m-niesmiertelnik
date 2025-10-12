// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
  FaUser, FaHeartbeat, FaBriefcaseMedical, FaPills,
  FaShoppingBag, FaCreditCard, FaCog, FaExclamationTriangle
} from 'react-icons/fa';

import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";

// This structure stays the same for rendering...
const menuItems = [
  { name: "DANE PODSTAWOWE", icon: <FaUser />, path: "/dashboard/basic" },
  { name: "DANE ZDROWOTNE", icon: <FaHeartbeat />, path: "/dashboard/health", subItems: [
    { name: "Choroby przewlekłe", icon: <FaBriefcaseMedical />, path: "/dashboard/health/conditions" },
    { name: "Przyjmowane leki", icon: <FaPills />, path: "/dashboard/health/medications" },
    { name: "Alergie", icon: <FaExclamationTriangle />, path: "/dashboard/health/allergies" },
  ]},
  { name: "PRODUKTY", icon: <FaShoppingBag />, path: "/dashboard/products", subItems: [
    { name: "Opaska NFC", icon: <FaCreditCard />, path: "/dashboard/products/nfc" },
  ]},
  { name: "USTAWIENIA", icon: <FaCog />, path: "/dashboard/settings" },
];

// ...But we EXPORT a flattened version for searching
const flattenedMenuItems = menuItems.flatMap(item =>
  item.subItems ? [item, ...item.subItems] : [item]
);

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}



// Add the default dashboard route
export const pathTitles = {
  "/dashboard/basic": "Mój Panel", // Changed from /dashboard to be more specific
  ...Object.fromEntries(flattenedMenuItems.map(item => [item.path, item.name]))
};

export const Sidebar = ({ isExpanded, onToggle }: SidebarProps) => {
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
          <div key={item.name}>
            <NavLink
              to={item.path}
              end={!item.subItems}
              className={({ isActive }) => 
                `${baseLinkClass} transition-[padding] duration-300 ${isExpanded ? 'px-4' : 'px-4'} ${
                  isActive 
                    ? activeLinkClass 
                    : "text-text-secondary hover:bg-background-tertiary"
                }`
              }

            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div className="overflow-hidden">
                <AnimatedText text={<span className="font-semibold">{item.name}</span>} />
              </div>
            </NavLink>

            
            {/* Sub-items with a smooth transition */}
            <div className={`transition-all duration-300 ease-in-out grid ${isExpanded && item.subItems ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                {item.subItems && (
                    <div className="mt-2 flex flex-col gap-2 pl-8 border-l-2 border-border-primary ml-6">
                        {item.subItems.map((sub) => (
                        <NavLink key={sub.name} to={sub.path} className={({ isActive }) => `${baseLinkClass} text-sm ${isActive ? activeLinkClass : "text-text-secondary"}`}>
                            <span className="text-lg flex-shrink-0">{sub.icon}</span>
                            <div className="overflow-hidden">
                                <AnimatedText text={<span>{sub.name}</span>}/>
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
                <AnimatedText text={<span className="font-semibold">Zwiń</span>} />
            </div>
          </button>
      </div>
    </aside>
  );
};