import React from 'react';
import { LogOut, Shield, User } from 'lucide-react';
import { UserSession } from '../types';
import nativeLogo from '../assets/images/trc_logo_1780085219514.png';

interface HeaderProps {
  session: UserSession;
  onLogout: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Header({ session, onLogout, activeTab, setActiveTab }: HeaderProps) {
  const getRoleLabel = (role: string) => {
    if (role === 'ADMIN') return 'System Administrator';
    return 'Guest User';
  };

  return (
    <header className="bg-sky-600 shadow-md z-10 text-white select-none">
      
      {/* Top Banner Row */}
      <div className="h-16 flex items-center justify-between px-6">
        {/* Brand Group */}
        <div className="flex items-center space-x-3 text-white">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-inner overflow-hidden p-0.5 transform hover:scale-105 transition-transform duration-300">
            <img 
              src={nativeLogo} 
              alt="TRC Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight uppercase leading-none">
              The Right Choice <span className="text-sky-200 opacity-80 text-xs sm:text-sm font-normal ml-1">(TRC)</span>
            </h1>
            <p className="text-[9px] font-semibold text-sky-100 tracking-wider uppercase opacity-75 hidden sm:block mt-0.5">
              Corporate Stay Registration
            </p>
          </div>
        </div>

        {/* User Status / Logout Group */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-sky-100 font-medium uppercase tracking-wider">{getRoleLabel(session.role)}</span>
            <span className="text-white font-semibold text-xs sm:text-sm max-w-[120px] truncate">{session.username}</span>
          </div>
          
          <button
            id="btn-logout"
            onClick={onLogout}
            title="Log out of TRC"
            className="bg-sky-700 hover:bg-sky-800 text-white p-2 rounded-lg transition-colors flex items-center justify-center shadow-inner hover:shadow-md"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Embedded Secondary Header Navigation Tabs for Admin Panel */}
      {session.role === 'ADMIN' && setActiveTab && activeTab && (
        <div className="bg-sky-700 border-t border-sky-650 px-4">
          <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto select-none font-sans scrollbar-none">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'DASHBOARD'
                  ? 'border-white text-white font-extrabold bg-sky-650/40'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-sky-650/10'
              }`}
            >
              Registrations List
            </button>
            <button
              id="tab-register"
              onClick={() => setActiveTab('REGISTER')}
              className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'REGISTER'
                  ? 'border-white text-white font-extrabold bg-sky-650/40'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-sky-650/10'
              }`}
            >
              New Guest Form
            </button>
            <button
              id="tab-guide"
              onClick={() => setActiveTab('BUILD_GUIDE')}
              className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'BUILD_GUIDE'
                  ? 'border-white text-white font-extrabold bg-sky-650/40'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-sky-650/10'
              }`}
            >
              APK Build Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
