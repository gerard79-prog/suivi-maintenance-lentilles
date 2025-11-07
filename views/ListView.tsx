import React, { useState, useMemo } from 'react';
import { Intervention } from '../types';
import { TrashIcon } from '../components/Icons';
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

  const lentillesUniques = useMemo(() => {
    const lentilles = interventions.map(i => i.lentille);
    return [...new Set(lentilles)].sort();
  }, [interventions]);

  const filteredInterventions = useMemo(() => {
    return interventions.filter(i => {
      const searchMatch = filters.search ? Object.values(i).some(val => 
        String(val).toLowerCase().includes(filters.search.toLowerCase())
      ) : true;
      
      return searchMatch &&
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

  return (
    <div className="space-y-4">
       <div className="bg-white p-4 rounded-lg shadow-md">
         <h2 className="text-xl font-bold text-slate-800 mb-4">Historique des Interventions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" placeholder="Recherche générale..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className="w-full p-2 border rounded-md" />
          <select value={filters.machine} onChange={e => setFilters({...filters, machine: e.target.value})} className="w-full p-2 border rounded-md">
            <option value="">Toutes les machines</option>
            {MACHINES_LIST.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filters.intervenant} onChange={e => setFilters({...filters, intervenant: e.target.value})} className="w-full p-2 border rounded-md">
            <option value="">Tous les intervenants</option>
            {INTERVENANTS_LIST.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="w-full p-2 border rounded-md">
            <option value="">Tous les types</option>
            <option value="Nettoyage">Nettoyage</option>
            <option value="Remplacement">Remplacement</option>
          </select>
          <select value={filters.lentille} onChange={e => setFilters({...filters, lentille: e.target.value})} className="w-full p-2 border rounded-md">
            <option value="">Toutes les lentilles</option>
            {lentillesUniques.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <input type="date" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} className="w-full p-2 border rounded-md" />
        </div>
        <button onClick={resetFilters} className="mt-4 w-full bg-slate-200 text-slate-800 p-2 rounded-md hover:bg-slate-300">Réinitialiser les filtres</button>
      </div>

      {filteredInterventions.map(inter => (
        <div key={inter.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-slate-800">{inter.machine}</h3>
              <p className="text-sm text-slate-500">{new Date(inter.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <button onClick={() => deleteIntervention(inter.id)} className="text-red-500 hover:text-red-700 p-1">
              <TrashIcon />
            </button>
          </div>
          <div className="mt-3 border-t pt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span className="text-slate-500">Intervenant:</span> <strong className="text-slate-700">{inter.intervenant}</strong></div>
            <div><span className="text-slate-500">Type:</span> <span className={`font-semibold px-2 py-1 rounded-full text-xs ${inter.type === 'Remplacement' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{inter.type}</span></div>
            <div className="col-span-2"><span className="text-slate-500">Lentille:</span> <strong className="text-slate-700">{inter.lentille}</strong></div>
            {inter.compteurLaser && <div><span className="text-slate-500">Cpt. Laser:</span> <strong className="text-slate-700">{inter.compteurLaser}</strong></div>}
            {inter.laserOn && <div><span className="text-slate-500">Laser On:</span> <strong className="text-slate-700">{inter.laserOn}</strong></div>}
            {inter.commentaire && <div className="col-span-2 mt-2"><p className="text-slate-600 text-xs bg-slate-50 p-2 rounded-md">{inter.commentaire}</p></div>}
          </div>
        </div>
      ))}
      {filteredInterventions.length === 0 && <p className="text-center text-slate-500 mt-4">Aucune intervention ne correspond à vos filtres.</p>}
    </div>
  );
};

export default ListView;
