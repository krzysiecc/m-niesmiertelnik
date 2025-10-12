
import { FaPhoneAlt, FaUsers } from 'react-icons/fa';
import { FaUsersLine } from "react-icons/fa6";

export const ActionButtons = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-background-primary to-transparent p-4">
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {/* A placeholder button for notifying contacts */}
        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-highlight hover:bg-highlight/80 text-on-accent rounded-xl text-center font-bold transition-colors">
          <FaUsersLine size={24} />
          <span className="text-sm">POWIADOM ICE</span>
        </button>
        
        {/* A semantic link for calling 112 */}
        <a 
          href="tel:112"
          className="flex items-center justify-center gap-3 p-4 bg-accent-primary hover:bg-accent-primary-hover text-on-accent rounded-xl text-center font-extrabold text-2xl transition-colors"
        >
          <FaPhoneAlt size={24} />
          <span>112</span>
        </a>
      </div>
    </div>
  );
};