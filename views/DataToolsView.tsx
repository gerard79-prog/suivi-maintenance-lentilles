import React, { useRef, useState } from 'react';
import { Intervention, NewIntervention } from '../types';
import { UploadIcon, DownloadIcon, TrashIcon } from '../components/Icons';

interface DataToolsViewProps {
  interventions: Intervention[];
  handleImport: (data: NewIntervention[]) => Promise<void>;
  handleDeleteAll: () => Promise<void>;
}

const DataToolsView: React.FC<DataToolsViewProps> = ({ interventions, handleImport, handleDeleteAll }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const exportToJson = () => {
    const dataStr = JSON.stringify(interventions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maintenance_export_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') throw new Error("Invalid file content");
        
        const data = JSON.parse(content) as NewIntervention[];
        
        if (!Array.isArray(data)) throw new Error("JSON file is not an array");

        if (window.confirm(`Vous allez importer ${data.length} interventions. Cette action est irréversible. Continuer ?`)) {
          await handleImport(data);
          alert("Importation réussie !");
        }
      } catch (error) {
        alert("Erreur lors de l'importation du fichier. Assurez-vous que le fichier JSON est valide.");
        console.error(error);
      } finally {
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteAll();
    } catch(e){
      console.error(e)
      alert("Une erreur est survenue lors de la suppression.")
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <input type="file" ref={fileInputRef} onChange={onFileSelect} accept=".json" className="hidden" />
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Exporter les données</h2>
        <p className="text-sm text-slate-600 mb-4">Sauvegardez toutes vos interventions dans un fichier JSON. Utile pour les backups ou le transfert de données.</p>
        <button onClick={exportToJson} className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700">
          <DownloadIcon className="h-5 w-5" />
          Exporter en JSON
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Importer les données</h2>
        <p className="text-sm text-slate-600 mb-4">Importez des interventions depuis un fichier JSON. Les nouvelles données seront ajoutées.</p>
        <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-emerald-700">
          <UploadIcon className="h-5 w-5" />
          Importer depuis JSON
        </button>
      </div>

      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">Zone de Danger</h2>
        <p className="text-sm text-red-700 mb-4">Supprimez définitivement toutes les données d'interventions de la base de données. Cette action est irréversible.</p>
        <button onClick={onDelete} disabled={isDeleting} className="inline-flex items-center gap-2 bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-400">
          <TrashIcon className="h-5 w-5" />
          {isDeleting ? 'Suppression en cours...' : 'Supprimer Toutes les Données'}
        </button>
      </div>
    </div>
  );
};

export default DataToolsView;
