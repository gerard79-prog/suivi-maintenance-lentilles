import React from 'react';
import { View } from '../types';
import { HomeIcon, ListIcon, PlusIcon, StatsIcon, SettingsIcon, AnalyseIcon } from './Icons';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  // FIX: Replaced `JSX.Element` with `React.ReactElement` to fix "Cannot find namespace 'JSX'" error.
  const navItems: { view: View; label: string; icon: React.ReactElement }[] = [
    { view: 'home', label: 'Accueil', icon: <HomeIcon /> },
    { view: 'list', label: 'Liste', icon: <ListIcon /> },
    { view: 'add', label: 'Ajouter', icon: <PlusIcon /> },
    { view: 'stats', label: 'Stats', icon: <StatsIcon /> },
    { view: 'analyse', label: 'Analyse', icon: <AnalyseIcon /> },
    { view: 'dataTools', label: 'Outils', icon: <SettingsIcon /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 text-white flex justify-around p-1 shadow-inner z-20">
      {navItems.map(({ view, label, icon }) => {
        if (view === 'add') {
            return (
                 <button
                    key={view}
                    onClick={() => setView(view)}
                    className="relative -top-4 bg-indigo-600 text-white rounded-full p-4 shadow-lg"
                    aria-label={label}
                >
                    <PlusIcon />
                </button>
            )
        }
        return (
            <button
            key={view}
            onClick={() => setView(view)}
            className={`flex flex-col items-center justify-center text-xs w-16 h-14 rounded-md transition-colors ${
                currentView === view ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
            }`}
            aria-label={label}
            >
            {icon}
            <span className="mt-1">{label}</span>
            </button>
        )
      })}
    </nav>
  );
};

export default BottomNav;