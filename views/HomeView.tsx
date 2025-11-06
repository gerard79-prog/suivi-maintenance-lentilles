import React, { useMemo } from 'react';
import { Intervention } from '../types';
import { ActivityIcon, CheckCircleIcon, WrenchIcon } from '../components/Icons';

interface HomeViewProps {
  interventions: Intervention[];
}

const HomeView: React.FC<HomeViewProps> = ({ interventions }) => {
  const stats = useMemo(() => {
    const derniereParMachine: Record<string, Intervention> = {};
    interventions.forEach(i => {
      if (!derniereParMachine[i.machine] || new Date(i.date) > new Date(derniereParMachine[i.machine].date)) {
        derniereParMachine[i.machine] = i;
      }
    });
    return {
      total: interventions.length,
      nettoyages: interventions.filter(i => i.type === 'Nettoyage').length,
      remplacements: interventions.filter(i => i.type === 'Remplacement').length,
      derniereParMachine,
    };
  }, [interventions]);

  const alertes = useMemo(() => {
    const now = new Date();
    return Object.values(stats.derniereParMachine)
      .map(interv => ({
        machine: interv.machine,
        jours: Math.floor((now.getTime() - new Date(interv.date).getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .filter(a => a.jours > 30)
      .sort((a, b) => b.jours - a.jours);
  }, [stats.derniereParMachine]);
  
  // FIX: Replaced `JSX.Element` with `React.ReactElement` to fix "Cannot find namespace 'JSX'" error.
  const StatCard = ({ title, value, icon, colorClass }: { title: string; value: number; icon: React.ReactElement; colorClass: string }) => (
    <div className={`${colorClass} text-white p-3 rounded-xl shadow-md flex justify-between items-center`}>
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-white/20 p-2 rounded-lg">
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Suivi de Maintenance Lentilles</h1>
        <p className="text-slate-500 mt-1">Gérez, suivez et analysez l'historique des interventions de maintenance de vos lentilles laser.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Interventions" value={stats.total} icon={<ActivityIcon />} colorClass="bg-blue-500" />
        <StatCard title="Nettoyages" value={stats.nettoyages} icon={<CheckCircleIcon />} colorClass="bg-green-500" />
        <StatCard title="Remplacements" value={stats.remplacements} icon={<WrenchIcon />} colorClass="bg-orange-500" />
      </div>

      {alertes.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg">
          <h3 className="font-bold flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            Machines nécessitant une maintenance
          </h3>
          <ul className="mt-2 list-disc list-inside text-sm">
            {alertes.map(a => (
              <li key={a.machine}>
                <strong>{a.machine}</strong> - Dernière intervention: il y a {a.jours} jours
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomeView;