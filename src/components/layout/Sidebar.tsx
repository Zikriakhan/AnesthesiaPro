import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, FileText, AlertTriangle, Activity, Clipboard, ClipboardCheck, PieChart, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  darkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, darkMode }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/patients', label: 'Patients', icon: <User size={24} /> },
    { path: '/anesthesia', label: 'Anesthesia', icon: <FileText size={24} /> },
    { path: '/dosage', label: 'Dosage Calculator', icon: <PieChart size={24} /> },
    { path: '/vitals', label: 'Vital Signs', icon: <Activity size={24} /> },
    { path: '/pre-checklist', label: 'Pre-Anesthesia', icon: <Clipboard size={24} /> },
    { path: '/post-monitoring', label: 'Post-Anesthesia', icon: <ClipboardCheck size={24} /> },
    { path: '/alerts', label: 'Alerts', icon: <AlertTriangle size={24} /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const sidebarClasses = isOpen 
    ? 'transform translate-x-0 transition-transform duration-300 ease-in-out' 
    : 'transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out';

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    
      <aside 
        className={`${sidebarClasses} fixed top-16 bottom-0 left-0 w-64 z-30 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}
      >
        <nav className="flex flex-col h-full justify-between p-4">
          <div>
            <p className={`text-xs uppercase font-semibold tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Main Menu
            </p>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? darkMode
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-50 text-blue-700'
                        : darkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="text-lg">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className={`text-xs uppercase font-semibold tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Account
            </p>
            <Link
              to="/logout"
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-red-500">
                <LogOut size={24} />
              </span>
              <span className="text-lg">Log Out</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;