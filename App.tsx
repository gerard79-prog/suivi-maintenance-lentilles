import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { Intervention, NewIntervention, Stats, View } from './types';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DesktopNav from './components/DesktopNav';
import HomeView from './views/HomeView';
import ListView from './views/ListView';
import AddView from './views/AddView';
import StatsView from './views/StatsView';
import DataToolsView from './views/DataToolsView';
import AnalyseView from './views/AnalyseView';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setError("Le chargement des données prend trop de temps. Vérifiez les règles de sécurité de votre base de données Firestore. Elles doivent autoriser la lecture ('allow read: if true;').");
        setLoading(false);
      }
    }, 10000);

    const unsubscribe = onSnapshot(collection(db, 'interventions'), (snapshot) => {
      clearTimeout(timeout);
      const interventionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Intervention));
      interventionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setInterventions(interventionsData);
      setLoading(false);
      setError(null);
    }, (err) => {
      clearTimeout(timeout);
      console.error("Firebase read error:", err);
      setError("Erreur de connexion à la base de données. Vérifiez votre connexion et les règles de sécurité Firestore.");
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    }
  }, []);
  
  const addIntervention = async (intervention: NewIntervention) => {
    await addDoc(collection(db, 'interventions'), intervention);
  };

  const deleteIntervention = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?")) {
      await deleteDoc(doc(db, 'interventions', id));
    }
  };

  const handleDeleteAllInterventions = async () => {
    if (window.confirm("Êtes-vous VRAIMENT sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible.")) {
      const querySnapshot = await getDocs(collection(db, 'interventions'));
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
  };

  const handleImportInterventions = async (importedInterventions: NewIntervention[]) => {
    const batch = writeBatch(db);
    importedInterventions.forEach(intervention => {
      const docRef = doc(collection(db, 'interventions'));
      batch.set(docRef, intervention);
    });
    await batch.commit();
  };


  const renderView = () => {
    if (loading) return <div className="flex justify-center items-center h-full"><p className="text-gray-500">Chargement des données...</p></div>;
    if (error) return <div className="flex justify-center items-center h-full p-4"><p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p></div>;
    
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
        return <DataToolsView interventions={interventions} handleImport={handleImportInterventions} handleDeleteAll={handleDeleteAllInterventions} />;
      case 'analyse':
        return <AnalyseView interventions={interventions} />;
      default:
        return <HomeView interventions={interventions} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <DesktopNav view={view} setView={setView} />
      <div className="flex-1 flex flex-col">
        <Header view={view} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto pb-24 md:pb-6">
          {renderView()}
        </main>
        <BottomNav view={view} setView={setView} />
      </div>
    </div>
  );
};

export default App;
