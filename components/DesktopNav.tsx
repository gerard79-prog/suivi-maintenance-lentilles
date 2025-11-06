import React from 'react';
import { View } from '../types';
import { HomeIcon, ListIcon, PlusIcon, StatsIcon, SettingsIcon, AnalyseIcon } from './Icons';

interface DesktopNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ currentView, setView }) => {
  // FIX: Replaced `JSX.Element` with `React.ReactElement` to fix "Cannot find namespace 'JSX'" error.
  // FIX: Replaced React.cloneElement with direct prop passing to fix a TypeScript error.
  // Icons are now created with the specific className needed for this component.
  const navItems: { view: View; label: string; icon: React.ReactElement }[] = [
    { view: 'home', label: 'Accueil', icon: <HomeIcon className="w-5 h-5" /> },
    { view: 'list', label: 'Historique', icon: <ListIcon className="w-5 h-5" /> },
    { view: 'add', label: 'Ajouter', icon: <PlusIcon className="w-5 h-5" /> },
    { view: 'stats', label: 'Statistiques', icon: <StatsIcon className="w-5 h-5" /> },
    { view: 'analyse', label: 'Analyse', icon: <AnalyseIcon className="w-5 h-5" /> },
    { view: 'dataTools', label: 'Outils', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <nav className="hidden md:flex flex-col bg-slate-800 text-white w-64 p-4 space-y-2 min-h-screen fixed left-0 top-0">
      <div className="text-2xl font-bold mb-6 mt-2 text-center text-white">Suivi Lentilles</div>
      {navItems.map(({ view, label, icon }) => (
        <button
          key={view}
          onClick={() => setView(view)}
          className={`flex items-center space-x-3 p-3 rounded-lg text-left w-full transition-colors duration-200 ${
            currentView === view ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-300'
          }`}
          aria-label={label}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default DesktopNav;
