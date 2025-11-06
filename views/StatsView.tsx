import React, { useMemo, useEffect, useRef } from 'react';
import { Intervention } from '../types.ts';
import Chart from 'chart.js/auto';

interface StatsViewProps {
  interventions: Intervention[];
}

const StatsView: React.FC<StatsViewProps> = ({ interventions }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const stats = useMemo(() => {
     const parMachine = interventions.reduce((acc, i) => {
      acc[i.machine] = (acc[i.machine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parIntervenant = interventions.reduce((acc, i) => {
      acc[i.intervenant] = (acc[i.intervenant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parLentille = interventions.reduce((acc, i) => {
      acc[i.lentille] = (acc[i.lentille] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: interventions.length,
      nettoyages: interventions.filter(i => i.type === 'Nettoyage').length,
      remplacements: interventions.filter(i => i.type === 'Remplacement').length,
      parMachine, parIntervenant, parLentille
    };
  }, [interventions]);

  useEffect(() => {
    if (chartRef.current) {
      const monthlyData = interventions.reduce((acc, i) => {
        const month = new Date(i.date).toISOString().slice(0, 7);
        if (!acc[month]) {
          acc[month] = { nettoyages: 0, remplacements: 0 };
        }
        if (i.type === 'Nettoyage') acc[month].nettoyages++;
        else acc[month].remplacements++;
        return acc;
      }, {} as Record<string, {nettoyages: number, remplacements: number}>);

      const sortedMonths = Object.keys(monthlyData).sort();
      const labels = sortedMonths.map(m => new Date(m + '-02').toLocaleDateString('fr-FR', {month: 'short', year: 'numeric'}));
      const nettoyagesData = sortedMonths.map(m => monthlyData[m].nettoyages);
      const remplacementsData = sortedMonths.map(m => monthlyData[m].remplacements);

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Nettoyages',
                data: nettoyagesData,
                borderColor: 'rgb(22, 163, 74)',
                backgroundColor: 'rgba(22, 163, 74, 0.5)',
                tension: 0.1
              },
              {
                label: 'Remplacements',
                data: remplacementsData,
                borderColor: 'rgb(234, 179, 8)',
                backgroundColor: 'rgba(234, 179, 8, 0.5)',
                tension: 0.1
              }
            ]
          }
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    }
  }, [interventions]);

  const renderStatList = (title: string, data: Record<string, number>) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
      <ul className="space-y-2">
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .map(([key, value]) => (
            <li key={key} className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">{key}</span>
              <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{value}</span>
            </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Évolution Mensuelle</h2>
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderStatList('Interventions par Machine', stats.parMachine)}
        {renderStatList('Interventions par Intervenant', stats.parIntervenant)}
        {renderStatList('Interventions par Lentille', stats.parLentille)}
      </div>
    </div>
  );
};

export default StatsView;
