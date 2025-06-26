export interface PersonnelData {
  srr: number;
  health: number;
  log: number;
}
export interface BarangayData {
  id: string;
  name: string;
  waterLevel: number;
  personnel: PersonnelData;
  coordinates: { x: number; y: number };
}

export type Personnel = {
  srr: number;
  health: number;
  log: number;
};

export type SimulationResult = {
  pso: [Record<string, Personnel>, number, number];
  fa: [Record<string, Personnel>, number, number];
};
