export type InterventionType = 'Nettoyage' | 'Remplacement';

export interface Intervention {
  id: string;
  machine: string;
  date: string; // ISO string format
  intervenant: string;
  type: InterventionType;
  lentille: string;
  compteurLaser?: string;
  laserOn?: string;
  commentaire?: string;
}

export type NewIntervention = Omit<Intervention, 'id'>;

export interface Stats {
  total: number;
  nettoyages: number;
  remplacements: number;
  parMachine: Record<string, number>;
  parIntervenant: Record<string, number>;
  parLentille: Record<string, number>;
  derniereParMachine: Record<string, Intervention>;
}

export type View = 'home' | 'list' | 'add' | 'stats' | 'dataTools' | 'analyse';
