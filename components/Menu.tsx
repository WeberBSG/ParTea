
import React, { useState } from 'react';

interface MenuProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (view: 'feed' | 'search' | 'create') => void;
}

const Menu: React.FC<MenuProps> = ({ isLoggedIn, onLogin, onLogout, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        aria-label="Toggle menu"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 left-0 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {!isLoggedIn ? (
              <div className="flex flex-col">
                <button 
                  onClick={() => { onLogin(); setIsOpen(false); }}
                  className="flex items-center gap-3 px-4 py-4 text-sm hover:bg-slate-700 text-left transition-colors"
                >
                  <i className="fa-brands fa-google text-pink-500"></i>
                  Login with Google
                </button>
                <button 
                  onClick={() => { onLogin(); setIsOpen(false); }}
                  className="flex items-center gap-3 px-4 py-4 text-sm hover:bg-slate-700 text-left transition-colors border-t border-slate-700"
                >
                  <i className="fa-solid fa-user-plus text-purple-500"></i>
                  Register with Google
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <button 
                  className="flex items-center gap-3 px-4 py-4 text-sm hover:bg-slate-700 text-left transition-colors"
                  onClick={() => { onNavigate('create'); setIsOpen(false); }}
                >
                  <i className="fa-solid fa-plus text-pink-500"></i>
                  Post ParTea
                </button>
                <button 
                  className="flex items-center gap-3 px-4 py-4 text-sm hover:bg-slate-700 text-left transition-colors border-t border-slate-700"
                  onClick={() => { onNavigate('search'); setIsOpen(false); }}
                >
                  <i className="fa-solid fa-magnifying-glass text-purple-500"></i>
                  Search ParTeas
                </button>
                <button 
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="flex items-center gap-3 px-4 py-4 text-sm hover:bg-red-900/30 text-red-400 text-left transition-colors border-t border-slate-700"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
