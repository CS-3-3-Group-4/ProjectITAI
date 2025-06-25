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
