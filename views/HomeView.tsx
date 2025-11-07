import React, { useMemo } from 'react';
import { Intervention } from '../types';

interface HomeViewProps {
  interventions: Intervention[];
}

const HomeView: React.FC<HomeViewProps> = ({ interventions }) => {

  const stats = useMemo(() => {
    // FIX: Explicitly type the accumulator 'acc' to ensure correct type inference for 'derniereParMachine'.
    const derniereParMachine = interventions.reduce((acc: Record<string, Intervention>, i) => {
        if (!acc[i.machine] || new Date(i.date) > new Date(acc[i.machine].date)) {
            acc[i.machine] = i;
        }
        return acc;
    }, {} as Record<string, Intervention>);
    
    const alertes = Object.values(derniereParMachine)
      .map(interv => ({
        machine: interv.machine,
        jours: Math.floor((new Date().getTime() - new Date(interv.date).getTime()) / (1000 * 60 * 60 * 24))
      }))
      .filter(a => a.jours > 30)
      .sort((a, b) => b.jours - a.jours);

    return {
      total: interventions.length,
      nettoyages: interventions.filter(i => i.type === 'Nettoyage').length,
      remplacements: interventions.filter(i => i.type === 'Remplacement').length,
      alertes
    };
  }, [interventions]);

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Suivi de Maintenance Lentilles</h1>
            <p className="text-slate-600 mt-2">Gérez, suivez et analysez l'historique des interventions de maintenance de vos lentilles laser.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                    <div className="text-sm font-light">Total Interventions</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
            </div>
            <div className="bg-emerald-500 text-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                    <div className="text-sm font-light">Nettoyages</div>
                    <div className="text-2xl font-bold">{stats.nettoyages}</div>
                </div>
            </div>
            <div className="bg-amber-500 text-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                    <div className="text-sm font-light">Remplacements</div>
                    <div className="text-2xl font-bold">{stats.remplacements}</div>
                </div>
            </div>
        </div>

        {stats.alertes.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md" role="alert">
                <h3 className="font-bold flex items-center">
                    <span className="text-xl mr-2">⚠️</span>
                    Machines nécessitant une maintenance
                </h3>
                <ul className="mt-2 list-disc list-inside">
                    {stats.alertes.map(a => (
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
