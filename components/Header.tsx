import React from 'react';
import { View } from '../types.ts';

interface HeaderProps {
  view: View;
}

const viewTitles: Record<View, string> = {
  home: 'Accueil',
  list: 'Historique',
  add: 'Ajouter',
  stats: 'Statistiques',
  dataTools: 'Outils',
  analyse: 'Analyse IA',
}

const Header: React.FC<HeaderProps> = ({ view }) => {
  return (
    <header className="bg-slate-800 text-white p-4 text-center md:hidden">
      <h1 className="text-xl font-bold">{viewTitles[view]}</h1>
    </header>
  );
};

export default Header;
