import React, { useState, useEffect } from 'react';
import { Intervention, NewIntervention, View } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

// Import views
import HomeView from './views/HomeView';
import ListView from './views/ListView';
import AddView from './views/AddView';
import StatsView from './views/StatsView';
import DataToolsView from './views/DataToolsView';
import AnalyseView from './views/AnalyseView';

// Import components
import DesktopNav from './components/DesktopNav';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

// FIX: This file had placeholder content, causing build errors. It has been replaced with the main application component.
function App() {
  const [interventions, setInterventions] = useLocalStorage<Intervention[]>('interventions', []);
  const [view, setView] = useLocalStorage<View>('currentView', 'home');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // This effect helps prevent hydration mismatches if this app were to be server-rendered.
    // It ensures that localStorage is only accessed on the client.
    setIsReady(true);
  }, []);

  const addIntervention = async (intervention: NewIntervention) => {
    const newIntervention: Intervention = {
      ...intervention,
      id: new Date().toISOString() + Math.random().toString(36).substring(2, 9),
    };
    // Add new intervention and re-sort by date
    const updatedInterventions = [newIntervention, ...interventions];
    updatedInterventions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setInterventions(updatedInterventions);
    setView('list'); 
  };
  
  const deleteIntervention = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      setInterventions(interventions.filter(i => i.id !== id));
    }
  };

  const handleImportInterventions = async (importedInterventions: NewIntervention[]) => {
    const newInterventions: Intervention[] = importedInterventions.map((i, index) => ({
      ...i,
      id: new Date().toISOString() + Math.random().toString(36).substring(2, 9) + index,
    }));
    const updatedInterventions = [...interventions, ...newInterventions];
    updatedInterventions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setInterventions(updatedInterventions);
  };

  const handleDeleteAllInterventions = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer TOUTES les interventions ? Cette action est irréversible.")) {
      setInterventions([]);
      alert("Toutes les interventions ont été supprimées.");
    }
  };


  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeView interventions={interventions} />;
      case 'list':
        return <ListView interventions={interventions} deleteIntervention={deleteIntervention} />;
      case 'add':
        return <AddView addIntervention={addIntervention} setView={setView} />;
      case 'stats':
        return <StatsView interventions={interventions} />;
      case 'dataTools':
        return <DataToolsView interventions={interventions} handleImportInterventions={handleImportInterventions} handleDeleteAllInterventions={handleDeleteAllInterventions} />;
      case 'analyse':
        return <AnalyseView interventions={interventions} />;
      default:
        return <HomeView interventions={interventions} />;
    }
  };

  if (!isReady) {
    return null; // Render nothing until client-side hydration is complete
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
      <DesktopNav currentView={view} setView={setView} />
      <div className="md:ml-64">
        <Header currentView={view} />
        <main className="p-4 sm:p-6 pb-24 md:pb-6">
          {renderView()}
        </main>
      </div>
      <BottomNav currentView={view} setView={setView} />
    </div>
  );
}

export default App;
