import React from 'react';
import { View } from '../types';
import { HomeIcon, ListIcon, PlusIcon, ChartBarIcon, BeakerIcon, CogIcon } from './Icons';

interface DesktopNavProps {
  view: View;
  setView: (view: View) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ view, setView }) => {
  const navItems = [
    { name: 'home', icon: HomeIcon, label: 'Accueil' },
    { name: 'list', icon: ListIcon, label: 'Historique' },
    { name: 'add', icon: PlusIcon, label: 'Ajouter' },
    { name: 'stats', icon: ChartBarIcon, label: 'Statistiques' },
    { name: 'analyse', icon: BeakerIcon, label: 'Analyse IA' },
    { name: 'dataTools', icon: CogIcon, label: 'Outils' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-800 text-white">
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-slate-700">
        Suivi Lentilles
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setView(item.name as View)}
            className={`flex items-center px-4 py-2 w-full text-left rounded-lg transition-colors duration-200 ${
              view === item.name
                ? 'bg-slate-700 text-white'
                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default DesktopNav;
