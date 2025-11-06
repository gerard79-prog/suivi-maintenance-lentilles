import React, { useMemo, useEffect, useRef } from 'react';
import { Intervention, Stats } from '../types';
import Chart from 'chart.js/auto';

interface StatsViewProps {
  interventions: Intervention[];
}

const StatsView: React.FC<StatsViewProps> = ({ interventions }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const stats: Stats = useMemo(() => {
    const calculatedStats: Stats = {
      total: interventions.length,
      nettoyages: 0,
      remplacements: 0,
      parMachine: {},
      parIntervenant: {},
      parLentille: {},
      derniereParMachine: {},
    };

    interventions.forEach(i => {
      if (i.type === 'Nettoyage') calculatedStats.nettoyages++;
      if (i.type === 'Remplacement') calculatedStats.remplacements++;
      
      calculatedStats.parMachine[i.machine] = (calculatedStats.parMachine[i.machine] || 0) + 1;
      calculatedStats.parIntervenant[i.intervenant] = (calculatedStats.parIntervenant[i.intervenant] || 0) + 1;
      if (i.lentille) {
        calculatedStats.parLentille[i.lentille] = (calculatedStats.parLentille[i.lentille] || 0) + 1;
      }
    });
    return calculatedStats;
  }, [interventions]);

  const monthlyData = useMemo(() => {
    const data: Record<string, { nettoyages: number, remplacements: number }> = {};
    const sortedInterventions = [...interventions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedInterventions.forEach(i => {
      const month = new Date(i.date).toISOString().slice(0, 7);
      if (!data[month]) {
        data[month] = { nettoyages: 0, remplacements: 0 };
      }
      if (i.type === 'Nettoyage') data[month].nettoyages++;
      if (i.type === 'Remplacement') data[month].remplacements++;
    });
    return data;
  }, [interventions]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Object.keys(monthlyData).map(m => new Date(m).toLocaleDateString('fr-FR', { year: '2-digit', month: 'short' })),
            datasets: [
              {
                label: 'Nettoyages',
                data: Object.values(monthlyData).map(d => d.nettoyages),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                tension: 0.1,
              },
              {
                label: 'Remplacements',
                data: Object.values(monthlyData).map(d => d.remplacements),
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.5)',
                tension: 0.1,
              },
            ],
          },
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyData]);

  const ListCard: React.FC<{ title: string; data: Record<string, number>; }> = ({ title, data }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-slate-700">{title}</h3>
      <ul className="space-y-2">
        {Object.entries(data).sort((a,b) => b[1] - a[1]).map(([key, value]) => (
          <li key={key} className="flex justify-between items-center text-slate-600 text-sm">
            <span>{key}</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Évolution Mensuelle</h2>
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ListCard title="Interventions par Machine" data={stats.parMachine} />
        <ListCard title="Interventions par Intervenant" data={stats.parIntervenant} />
        <ListCard title="Interventions par Lentille" data={stats.parLentille} />
      </div>
    </div>
  );
};

export default StatsView;
