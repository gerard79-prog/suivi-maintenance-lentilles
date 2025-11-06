import React, { useState, useMemo } from 'react';
import { Intervention } from '../types';
import { MACHINES_LIST, INTERVENANTS_LIST } from '../constants';

interface ListViewProps {
  interventions: Intervention[];
  deleteIntervention: (id: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ interventions, deleteIntervention }) => {
  const [filters, setFilters] = useState({
    search: '',
    machine: '',
    intervenant: '',
    type: '',
    lentille: '',
    date: '',
  });

  const uniqueLentilles = useMemo(() => {
    const lentilles = interventions.map(i => i.lentille).filter(Boolean);
    return [...new Set(lentilles)].sort();
  }, [interventions]);

  const filteredInterventions = useMemo(() => {
    return interventions.filter(i => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = filters.search 
        ? Object.values(i).some(val => String(val).toLowerCase().includes(searchLower))
        : true;
      
      return matchesSearch &&
             (filters.machine ? i.machine === filters.machine : true) &&
             (filters.intervenant ? i.intervenant === filters.intervenant : true) &&
             (filters.type ? i.type === filters.type : true) &&
             (filters.lentille ? i.lentille === filters.lentille : true) &&
             (filters.date ? i.date.startsWith(filters.date) : true);
    });
  }, [interventions, filters]);
  
  const resetFilters = () => {
      setFilters({ search: '', machine: '', intervenant: '', type: '', lentille: '', date: '' });
  };

 const filterInputClasses = "w-full p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Filtres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" placeholder="Recherche générale..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className={filterInputClasses} />
          <select value={filters.machine} onChange={e => setFilters({...filters, machine: e.target.value})} className={filterInputClasses}>
            <option value="">Toutes les machines</option>
            {MACHINES_LIST.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filters.intervenant} onChange={e => setFilters({...filters, intervenant: e.target.value})} className={filterInputClasses}>
            <option value="">Tous les intervenants</option>
            {INTERVENANTS_LIST.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className={filterInputClasses}>
            <option value="">Tous les types</option>
            <option value="Nettoyage">Nettoyage</option>
            <option value="Remplacement">Remplacement</option>
          </select>
          <select value={filters.lentille} onChange={e => setFilters({...filters, lentille: e.target.value})} className={filterInputClasses}>
            <option value="">Toutes les lentilles</option>
            {uniqueLentilles.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <input type="date" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} className={filterInputClasses} />
        </div>
        <button onClick={resetFilters} className="mt-4 w-full bg-slate-200 text-slate-700 p-2 rounded-lg hover:bg-slate-300">
          Réinitialiser les filtres
        </button>
      </div>

      {filteredInterventions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredInterventions.map(interv => (
            <div key={interv.id} className="bg-white p-4 rounded-lg shadow-md relative">
              <button onClick={() => deleteIntervention(interv.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <h3 className="font-bold text-lg text-slate-800">{interv.machine}</h3>
              <p className="text-sm text-slate-500">{new Date(interv.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="mt-3 border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Intervenant:</span><span className="font-medium text-slate-700">{interv.intervenant}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Type:</span><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${interv.type === 'Nettoyage' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{interv.type}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Lentille:</span><span className="font-medium text-slate-700">{interv.lentille}</span></div>
                {interv.compteurLaser && <div className="flex justify-between"><span className="text-slate-500">Compteur Laser:</span><span className="font-medium text-slate-700">{interv.compteurLaser}h</span></div>}
                {interv.laserOn && <div className="flex justify-between"><span className="text-slate-500">Laser On:</span><span className="font-medium text-slate-700">{interv.laserOn}h</span></div>}
                {interv.commentaire && <div className="text-slate-600 mt-2 pt-2 border-t border-slate-200"><strong className="text-slate-500">Commentaire:</strong> {interv.commentaire}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md">
            <p className="text-slate-500">Aucune intervention ne correspond à vos filtres.</p>
        </div>
      )}
    </div>
  );
};

export default ListView;
