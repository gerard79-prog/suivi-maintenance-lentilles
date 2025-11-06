import React from 'react';
import { View } from '../types';
import { HomeIcon, ListIcon, PlusIcon, StatsIcon, SettingsIcon, AnalyseIcon } from './Icons';

interface HeaderProps {
  currentView: View;
}

const viewConfig: Record<View, { title: string; icon: React.ReactElement }> = {
  home: { title: 'Accueil', icon: <HomeIcon className="w-6 h-6" /> },
  list: { title: 'Liste des Interventions', icon: <ListIcon className="w-6 h-6" /> },
  add: { title: 'Ajouter une Intervention', icon: <PlusIcon className="w-6 h-6" /> },
  stats: { title: 'Statistiques', icon: <StatsIcon className="w-6 h-6" /> },
  dataTools: { title: 'Outils de Données', icon: <SettingsIcon className="w-6 h-6" /> },
  analyse: { title: 'Analyse IA', icon: <AnalyseIcon className="w-6 h-6" /> },
};

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const { title, icon } = viewConfig[currentView] || viewConfig.home;

  return (
    <header className="md:hidden bg-slate-800 p-4 shadow-md sticky top-0 z-10">
      <div className="flex items-center space-x-3 text-white">
        {icon}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
