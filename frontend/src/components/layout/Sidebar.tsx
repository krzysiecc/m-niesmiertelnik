
import { NavLink } from "react-router-dom";
import {
  FaUser, FaHeartbeat, FaBriefcaseMedical, FaPills,
  FaShoppingBag, FaCreditCard, FaCog
} from 'react-icons/fa';

// This structure stays the same for rendering...
const menuItems = [
  { name: "DANE PODSTAWOWE", icon: <FaUser />, path: "/dashboard/basic" },
  { name: "DANE ZDROWOTNE", icon: <FaHeartbeat />, path: "/dashboard/health", subItems: [
    { name: "Choroby przewlekłe", icon: <FaBriefcaseMedical />, path: "/dashboard/health/conditions" },
    { name: "Przyjmowane leki", icon: <FaPills />, path: "/dashboard/health/medications" },
  ]},
  { name: "PRODUKTY", icon: <FaShoppingBag />, path: "/dashboard/products", subItems: [
    { name: "Opaska ratunkowa NFC", icon: <FaCreditCard />, path: "/dashboard/products/nfc" },
  ]},
  { name: "USTAWIENIA", icon: <FaCog />, path: "/dashboard/settings" },
];

// ...But we EXPORT a flattened version for searching
const flattenedMenuItems = menuItems.flatMap(item => 
  item.subItems ? [item, ...item.subItems] : [item]
);

// Add the default dashboard route
export const pathTitles = {
  "/dashboard": "Mój Panel",
  ...Object.fromEntries(flattenedMenuItems.map(item => [item.path, item.name]))
};


export const Sidebar = () => {
  // ... rest of the component code is unchanged
  const baseLinkClass = "flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-background-tertiary transition-colors";
  const activeLinkClass = "bg-accent-primary text-text-inverted shadow-lg shadow-accent-primary/30"; // Made active state more prominent

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-background-secondary border-r border-border-primary p-4 flex flex-col">
      <div className="text-2xl font-bold font-roboto text-text-primary mb-10 px-2">
        DupApp
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <div key={item.name}>
            <NavLink
              to={item.path}
              end={!item.subItems}
              className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : "text-text-secondary"}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </NavLink>
            {item.subItems && (
              <div className="mt-2 flex flex-col gap-2 pl-8 border-l-2 border-border-primary ml-6">
                {item.subItems.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) => `${baseLinkClass} text-sm ${isActive ? activeLinkClass : "text-text-secondary"}`}
                  >
                    <span className="text-lg">{sub.icon}</span>
                    <span>{sub.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};