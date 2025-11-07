import React, { useState } from 'react';
import { Intervention } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FileTextIcon } from '../components/Icons';

interface AnalyseViewProps {
  interventions: Intervention[];
}

const AnalyseView: React.FC<AnalyseViewProps> = ({ interventions }) => {
  const [apiKey, setApiKey] = useLocalStorage<string>('geminiApiKey', '');
  const [tempApiKey, setTempApiKey] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyse = async () => {
    if (!apiKey) {
      setError("Veuillez configurer votre clé d'API Gemini avant de lancer une analyse.");
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const dataSummary = JSON.stringify(interventions);
      
      const prompt = `
        Analyse les données de maintenance suivantes au format JSON: ${dataSummary}.
        Agis en tant qu'expert en maintenance industrielle. Fournis un résumé des points clés, 
        identifie les machines nécessitant le plus d'attention, détecte les tendances 
        et propose des recommandations concrètes pour optimiser la maintenance.
        Structure ta réponse en Markdown.
      `;
      
      // Utilisation correcte de l'API Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setAnalysis(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Format de réponse inattendu de l'API");
      }

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Une erreur est survenue lors de la communication avec l'API Gemini. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      setTempApiKey('');
    }
  };

  const markdownToHtml = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {!apiKey ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Configurer l'Analyse IA</h2>
          <p className="text-sm text-slate-600 mb-4">
            Pour utiliser cette fonctionnalité, veuillez fournir votre clé d'API Google Gemini.
            Votre clé sera sauvegardée localement sur votre navigateur.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Collez votre clé API ici"
              className="flex-grow p-2 border rounded-md"
            />
            <button
              onClick={handleSaveApiKey}
              className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Analyse par IA (Gemini)</h2>
            <button onClick={() => setApiKey('')} className="text-xs text-slate-500 hover:text-slate-700">Changer de clé API</button>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Cliquez sur le bouton pour lancer une analyse intelligente de vos données.
            L'IA identifiera les tendances et vous fournira des recommandations.
          </p>
          <button
            onClick={handleAnalyse}
            disabled={loading}
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyse en cours...' : "Lancer l'analyse"}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
      )}

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-md no-print-section">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">Résultats de l'analyse</h3>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                <FileTextIcon />
                Exporter en PDF
            </button>
          </div>
          <div
            className="prose max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(analysis) }}
          />
        </div>
      )}
    </div>
  );
};

export default AnalyseView;
