import React, { useState, useEffect } from 'react';
import { NewIntervention, View } from '../types.ts';
import { MACHINES_LIST, INTERVENANTS_LIST, MACHINE_TO_LENTILLE_MAP } from '../constants.ts';

interface AddViewProps {
  addIntervention: (intervention: NewIntervention) => void;
  setView: (view: View) => void;
}

const AddView: React.FC<AddViewProps> = ({ addIntervention, setView }) => {
  const [machine, setMachine] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [intervenant, setIntervenant] = useState('');
  const [type, setType] = useState<'Nettoyage' | 'Remplacement'>('Nettoyage');
  const [lentille, setLentille] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [compteurLaser, setCompteurLaser] = useState('');
  const [laserOn, setLaserOn] = useState('');

  useEffect(() => {
    setLentille(MACHINE_TO_LENTILLE_MAP[machine] || '');
  }, [machine]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machine || !intervenant) {
      alert('Veuillez sélectionner une machine et un intervenant.');
      return;
    }
    const newIntervention: NewIntervention = {
      machine,
      date: new Date(date).toISOString(),
      intervenant,
      type,
      lentille: lentille || 'N/A',
      compteurLaser: compteurLaser || undefined,
      laserOn: laserOn || undefined,
      commentaire: commentaire || undefined,
    };
    addIntervention(newIntervention);
    setView('list');
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Ajouter une nouvelle intervention</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="machine" className="block text-sm font-medium text-gray-700">Machine *</label>
            <select id="machine" value={machine} onChange={e => setMachine(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>Sélectionner une machine</option>
              {MACHINES_LIST.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="intervenant" className="block text-sm font-medium text-gray-700">Intervenant *</label>
            <select id="intervenant" value={intervenant} onChange={e => setIntervenant(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>Sélectionner un intervenant</option>
              {INTERVENANTS_LIST.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type d'intervention</label>
            <div className="mt-2 flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="type" value="Nettoyage" checked={type === 'Nettoyage'} onChange={() => setType('Nettoyage')} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                <span className="ml-2 text-gray-700">Nettoyage</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="type" value="Remplacement" checked={type === 'Remplacement'} onChange={() => setType('Remplacement')} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                <span className="ml-2 text-gray-700">Remplacement</span>
              </label>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="lentille" className="block text-sm font-medium text-gray-700">Lentille (automatique)</label>
            <input type="text" id="lentille" value={lentille} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm" readOnly />
          </div>
           <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="compteurLaser" className="block text-sm font-medium text-gray-700">Compteur Laser (Optionnel)</label>
                    <input type="text" id="compteurLaser" value={compteurLaser} onChange={e => setCompteurLaser(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="laserOn" className="block text-sm font-medium text-gray-700">Laser On (Optionnel)</label>
                    <input type="text" id="laserOn" value={laserOn} onChange={e => setLaserOn(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
           </div>
          <div className="sm:col-span-2">
            <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700">Commentaire (Optionnel)</label>
            <textarea id="commentaire" value={commentaire} onChange={e => setCommentaire(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setView('list')} className="bg-white text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50">
                Annuler
            </button>
            <button type="submit" className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
                Enregistrer
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddView;
