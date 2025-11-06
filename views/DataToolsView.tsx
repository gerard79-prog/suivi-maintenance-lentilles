import React, { useRef, useState } from 'react';
import { Intervention, NewIntervention } from '../types';
import { DownloadIcon, UploadIcon, TrashIcon } from '../components/Icons';

interface DataToolsViewProps {
  interventions: Intervention[];
  handleImportInterventions: (interventions: NewIntervention[]) => Promise<void>;
  handleDeleteAllInterventions: () => Promise<void>;
}

const DataToolsView: React.FC<DataToolsViewProps> = ({ interventions, handleImportInterventions, handleDeleteAllInterventions }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const exportToJSON = () => {
    const dataToExport = interventions.map(({ id, ...rest }) => rest);
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sauvegarde_maintenance_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("Le fichier est invalide.");
            const data = JSON.parse(text) as NewIntervention[];
            if (!Array.isArray(data)) throw new Error("Le fichier JSON ne contient pas une liste d'interventions.");

            if (window.confirm(`Vous allez importer ${data.length} interventions. Voulez-vous continuer ?`)) {
                await handleImportInterventions(data);
                alert("Importation réussie !");
            }
        } catch (error) {
            alert(`Erreur lors de l'importation: ${error instanceof Error ? error.message : "Format de fichier incorrect."}`);
        } finally {
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    reader.readAsText(file);
  };
  
  const onDeleteAll = async () => {
      setIsDeleting(true);
      try {
          await handleDeleteAllInterventions();
      } catch (e) {
        // Error is handled in App.tsx, but we can add more specific UI feedback here if needed.
      } finally {
        setIsDeleting(false);
      }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept=".json" />

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-slate-700 mb-2">Exporter les Données</h2>
            <p className="text-sm text-slate-500 mb-4">Sauvegardez toutes vos interventions dans un fichier JSON. Utile pour les backups ou le transfert de données.</p>
            <button onClick={exportToJSON} className="w-full flex items-center justify-center bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-slate-400" disabled={interventions.length === 0}>
                <DownloadIcon />
                Exporter en JSON
            </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-slate-700 mb-2">Importer les Données</h2>
            <p className="text-sm text-slate-500 mb-4">Importez des interventions depuis un fichier JSON. Les nouvelles interventions seront ajoutées à la liste existante.</p>
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold">
                <UploadIcon />
                Importer depuis JSON
            </button>
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
            <h2 className="text-xl font-bold text-red-700 mb-2">Zone de Danger</h2>
            <p className="text-sm text-red-600 mb-4">Supprimez définitivement toutes les données d'interventions de la base de données. Cette action est irréversible.</p>
            <button onClick={onDeleteAll} className="w-full flex items-center justify-center bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 font-semibold disabled:bg-red-400" disabled={isDeleting}>
                <TrashIcon />
                {isDeleting ? 'Suppression en cours...' : 'Supprimer Toutes les Données'}
            </button>
        </div>
    </div>
  );
};

export default DataToolsView;
