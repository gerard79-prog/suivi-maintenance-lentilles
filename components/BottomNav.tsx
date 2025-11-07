import React from 'react';
import { View } from '../types';
import { HomeIcon, ListIcon, PlusIcon, ChartBarIcon, BeakerIcon, CogIcon } from './Icons';

interface BottomNavProps {
  view: View;
  setView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ view, setView }) => {
  const navItems = [
    { name: 'home', icon: HomeIcon, label: 'Accueil' },
    { name: 'list', icon: ListIcon, label: 'Liste' },
    { name: 'add', icon: PlusIcon, label: 'Ajouter' },
    { name: 'stats', icon: ChartBarIcon, label: 'Stats' },
    { name: 'analyse', icon: BeakerIcon, label: 'Analyse' },
    { name: 'dataTools', icon: CogIcon, label: 'Outils' },
  ];

  const NavButton: React.FC<{item: typeof navItems[0]}> = ({ item }) => {
    const isActive = view === item.name;
    if (item.name === 'add') {
      return (
         <button
            onClick={() => setView('add')}
            className="relative -top-4 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
            <PlusIcon className="h-6 w-6" />
        </button>
      )
    }
    return (
      <button
        onClick={() => setView(item.name as View)}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs ${
          isActive ? 'text-blue-500' : 'text-gray-400'
        }`}
      >
        <item.icon className="h-6 w-6 mb-1" />
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 grid grid-cols-6 md:hidden">
      {navItems.map(item => (
        <NavButton key={item.name} item={item} />
      ))}
    </nav>
  );
};

export default BottomNav;
