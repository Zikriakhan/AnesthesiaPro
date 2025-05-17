import React, { useState } from 'react';
import { Menu, X, Sun, Moon, User, FileText, AlertTriangle, Activity, Clipboard, ClipboardCheck } from 'lucide-react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`fixed top-0 left-0 right-0 z-30 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-200`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} mr-2`}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} className={darkMode ? 'text-white' : 'text-gray-800'} /> : <Menu size={24} className={darkMode ? 'text-white' : 'text-gray-800'} />}
            </button>
            <h1 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              AnesthesiaPro
            </h1>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full mr-2 ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button 
              className={`p-2 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              aria-label="User profile"
            >
              <User size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="pt-16 flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} darkMode={darkMode} />
        
        <main className={`flex-1 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'ml-0'} p-4 md:p-6`}>
          <div className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;