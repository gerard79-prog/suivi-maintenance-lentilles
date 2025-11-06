import React, { useState, useEffect } from 'react';
import { NewIntervention, View } from '../types';
import { MACHINES_LIST, INTERVENANTS_LIST, MACHINE_TO_LENTILLE_MAP } from '../constants';

interface AddViewProps {
  addIntervention: (intervention: NewIntervention) => Promise<void>;
  setView: (view: View) => void;
}

const AddView: React.FC<AddViewProps> = ({ addIntervention, setView }) => {
  const [intervention, setIntervention] = useState<NewIntervention>({
    machine: '',
    date: new Date().toISOString().split('T')[0],
    intervenant: '',
    type: 'Nettoyage',
    lentille: '',
    compteurLaser: '',
    laserOn: '',
    commentaire: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (intervention.machine && MACHINE_TO_LENTILLE_MAP[intervention.machine]) {
      setIntervention(i => ({ ...i, lentille: MACHINE_TO_LENTILLE_MAP[intervention.machine] }));
    } else {
      setIntervention(i => ({ ...i, lentille: '' }));
    }
  }, [intervention.machine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIntervention(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intervention.machine || !intervention.date || !intervention.intervenant) {
      setError('Les champs Machine, Date et Intervenant sont obligatoires.');
      return;
    }
    setError('');
    addIntervention(intervention);
  };

  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const inputClasses = "w-full p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const radioLabelClasses = "flex items-center space-x-2 text-sm text-slate-800";
  const radioInputClasses = "h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Ajouter une Intervention</h2>
      
      {error && <div className="p-3 text-center text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="machine" className={labelClasses}>Machine *</label>
          <select id="machine" name="machine" value={intervention.machine} onChange={handleChange} className={inputClasses} required>
            <option value="">Sélectionner une machine</option>
            {MACHINES_LIST.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="intervenant" className={labelClasses}>Intervenant *</label>
          <select id="intervenant" name="intervenant" value={intervention.intervenant} onChange={handleChange} className={inputClasses} required>
            <option value="">Sélectionner un intervenant</option>
            {INTERVENANTS_LIST.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="date" className={labelClasses}>Date de l'intervention *</label>
        <input type="date" id="date" name="date" value={intervention.date} onChange={handleChange} className={inputClasses} required />
      </div>

      <div>
        <label className={labelClasses}>Type d'intervention *</label>
        <div className="flex space-x-6 mt-2">
            <label className={radioLabelClasses}>
                <input type="radio" name="type" value="Nettoyage" checked={intervention.type === 'Nettoyage'} onChange={handleChange} className={radioInputClasses} />
                <span>Nettoyage</span>
            </label>
            <label className={radioLabelClasses}>
                <input type="radio" name="type" value="Remplacement" checked={intervention.type === 'Remplacement'} onChange={handleChange} className={radioInputClasses} />
                <span>Remplacement</span>
            </label>
        </div>
      </div>

       <div>
          <label htmlFor="lentille" className={labelClasses}>Lentille</label>
          <input type="text" id="lentille" name="lentille" value={intervention.lentille} onChange={handleChange} className={inputClasses} placeholder="Ex: Lenti035" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="compteurLaser" className={labelClasses}>Compteur Laser (h)</label>
          <input type="text" id="compteurLaser" name="compteurLaser" value={intervention.compteurLaser ?? ''} onChange={handleChange} className={inputClasses} placeholder="Optionnel" />
        </div>
        <div>
          <label htmlFor="laserOn" className={labelClasses}>Laser On (h)</label>
          <input type="text" id="laserOn" name="laserOn" value={intervention.laserOn ?? ''} onChange={handleChange} className={inputClasses} placeholder="Optionnel" />
        </div>
      </div>

      <div>
        <label htmlFor="commentaire" className={labelClasses}>Commentaire</label>
        <textarea id="commentaire" name="commentaire" value={intervention.commentaire ?? ''} onChange={handleChange} rows={3} className={inputClasses} placeholder="Ajouter un commentaire..."></textarea>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
        <button type="button" onClick={() => setView('list')} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">Annuler</button>
        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Enregistrer</button>
      </div>
    </form>
  );
};

export default AddView;
