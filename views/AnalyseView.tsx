import React, { useState } from 'react';
import { Intervention } from '../types';
import { GoogleGenAI } from '@google/genai';
import { AnalyseIcon, FileTextIcon } from '../components/Icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AnalyseViewProps {
  interventions: Intervention[];
}

const AnalyseView: React.FC<AnalyseViewProps> = ({ interventions }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useLocalStorage('geminiApiKey', '');
  const [inputApiKey, setInputApiKey] = useState('');

  const handleAnalyse = async () => {
    if (!apiKey) {
      setError("La clé d'API pour le service d'IA n'est pas configurée.");
      return;
    }
    if (interventions.length === 0) {
      setError("Il n'y a pas de données à analyser.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        Analysez les données JSON suivantes qui représentent des interventions de maintenance sur des machines de découpe laser.
        Fournissez des informations et des recommandations exploitables. Concentrez-vous sur :
        1. Les tendances des interventions (par exemple, des machines spécifiques nécessitant une attention plus fréquente, augmentation des nettoyages ou des remplacements).
        2. Les problèmes récurrents potentiels sur certaines machines ou avec certaines lentilles.
        3. Des recommandations pour la maintenance préventive basées sur les données.
        4. Une analyse de la durée de vie ou de la fréquence de remplacement des différents types de lentilles.
        
        Présentez votre analyse sous forme de points clairs et concis en utilisant le format Markdown.

        Voici les données :
        ${JSON.stringify(interventions, null, 2)}
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          systemInstruction: "En tant qu'expert en maintenance industrielle",
        }
      });

      const text = response.text;
      setAnalysis(text);

    } catch (err: any) {
      console.error("Erreur lors de l'analyse IA:", err);
      setError(`Une erreur est survenue lors de la communication avec l'IA. Veuillez réessayer. Détails: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (inputApiKey.trim()) {
      setApiKey(inputApiKey.trim());
      setInputApiKey('');
    }
  };

  const markdownToHtml = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(\n\s*\d+\.\s.*)+/g, (match) => `<ol class="list-decimal list-inside pl-4">${match.replace(/\n\s*\d+\.\s/g, (li) => `<li>${li.replace(/\d+\.\s/, '')}</li>`).replace(/\n/g, '')}</ol>`)
      .replace(/(\n\s*-\s.*)+/g, (match) => `<ul class="list-disc list-inside pl-4">${match.replace(/\n\s*-\s/g, (li) => `<li>${li.replace(/-\s/, '')}</li>`).replace(/\n/g, '')}</ul>`)
      .replace(/\n/g, '<br />');
  };

  if (!apiKey) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-slate-700 mb-2">Configuration de l'Analyse IA</h2>
        <p className="text-sm text-slate-500 mb-4">Pour utiliser cette fonctionnalité, veuillez entrer votre clé API Gemini. Vous pouvez en obtenir une gratuitement sur Google AI Studio.</p>
        <div className="flex space-x-2">
          <input
            type="password"
            value={inputApiKey}
            onChange={(e) => setInputApiKey(e.target.value)}
            placeholder="Entrez votre clé API Gemini"
            className="flex-grow p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button onClick={handleSaveApiKey} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
            Sauvegarder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Analyse par IA Gemini</h2>
                <p className="text-slate-500 mt-1">Obtenez des aperçus et des recommandations sur vos données de maintenance grâce à l'intelligence artificielle.</p>
            </div>
            <button onClick={() => setApiKey('')} className="text-xs text-slate-500 hover:text-indigo-600">
                Changer de clé API
            </button>
        </div>
        
        <div className="mt-4 bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600">
            Cliquez sur le bouton ci-dessous pour lancer une analyse de vos {interventions.length} interventions enregistrées. L'IA identifiera les tendances, les problèmes potentiels et vous fournira des recommandations pour optimiser votre maintenance.
          </p>
        </div>

        <button 
          onClick={handleAnalyse} 
          disabled={isLoading || interventions.length === 0}
          className="mt-4 w-full flex items-center justify-center bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyse en cours...' : 'Lancer l\'analyse'}
        </button>
        {interventions.length === 0 && <p className="text-center text-sm text-yellow-700 mt-2">Ajoutez des interventions pour pouvoir lancer l'analyse.</p>}
      </div>

      {isLoading && (
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-slate-600 animate-pulse">L'IA analyse vos données, veuillez patienter...</p>
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-100 border border-red-200 rounded-lg shadow-md">
          <p className="text-red-700"><strong className="font-bold">Erreur :</strong> {error}</p>
        </div>
      )}

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">Résultats de l'analyse</h3>
                <button onClick={() => window.print()} className="no-print flex items-center px-3 py-1.5 text-xs bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300">
                    <FileTextIcon className="w-4 h-4 mr-1.5" />
                    Exporter en PDF
                </button>
            </div>
          <div className="prose prose-slate max-w-none bg-slate-50 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: markdownToHtml(analysis) }}>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyseView;