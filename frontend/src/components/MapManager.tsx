import { useState } from "react";
import type { BarangayData, PersonnelData } from "../types";
import { InteractiveMap } from "./InteractiveMap";
import { BarangayDialog } from "./BarangayDialog";
import { DataSummary } from "./DataSummary";
import { ActionButtons } from "./ActionButtons";

const initialBarangays: BarangayData[] = [
  {
    id: "1",
    name: "Addition Hills",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 280, y: 425 },
  },
  {
    id: "2",
    name: "Bagong Silang",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 215, y: 280 },
  },
  {
    id: "3",
    name: "Barangka Drive",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 290, y: 750 },
  },
  {
    id: "4",
    name: "Barangka Ibaba",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 300, y: 810 },
  },
  {
    id: "5",
    name: "Barangka Ilaya",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 390, y: 785 },
  },
  {
    id: "6",
    name: "Barangka Itaas",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 335, y: 780 },
  },
  {
    id: "7",
    name: "Buayang Bato",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 173, y: 327 },
  },
  {
    id: "8",
    name: "Burol",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 440, y: 800 },
  },
  {
    id: "9",
    name: "Daang Bakal",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 180, y: 240 },
  },
  {
    id: "10",
    name: "Hagdang Bato Itaas",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 210, y: 360 },
  },
  {
    id: "11",
    name: "Hagdang Bato Libis",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 250, y: 340 },
  },
  {
    id: "12",
    name: "Harapin Ang Bukas",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 180, y: 300 },
  },
  {
    id: "13",
    name: "Highway Hills",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 450, y: 600 },
  },
  {
    id: "14",
    name: "Hulo",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 220, y: 765 },
  },
  {
    id: "15",
    name: "Mabini-J. Rizal",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 105, y: 440 },
  },
  {
    id: "16",
    name: "Malamig",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 350, y: 650 },
  },
  {
    id: "17",
    name: "Mauway",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 350, y: 500 },
  },
  {
    id: "18",
    name: "Namayan",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 90, y: 575 },
  },
  {
    id: "19",
    name: "New Zañiga",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 190, y: 475 },
  },
  {
    id: "20",
    name: "Old Zañiga",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 140, y: 480 },
  },
  {
    id: "21",
    name: "Pag-Asa",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 145, y: 325 },
  },
  {
    id: "22",
    name: "Plainview",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 250, y: 640 },
  },
  {
    id: "23",
    name: "Pleasant Hills",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 330, y: 370 },
  },
  {
    id: "24",
    name: "Poblacion",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 162, y: 400 },
  },
  {
    id: "25",
    name: "San Jose",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 198, y: 525 },
  },
  {
    id: "26",
    name: "Vergara",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 140, y: 640 },
  },
  {
    id: "27",
    name: "Wack-Wack Greenhills",
    waterLevel: 0,
    personnel: { srr: 0, health: 0, log: 0 },
    coordinates: { x: 450, y: 300 },
  },
];

export function MapManager() {
  const [barangays, setBarangays] = useState<BarangayData[]>(initialBarangays);
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const handleBarangayClick = (barangay: BarangayData) => {
    setSelectedBarangay(barangay);
    setIsDialogOpen(true);
  };

  const handleUpdateBarangay = (updatedData: {
    waterLevel: number;
    personnel: PersonnelData;
  }) => {
    if (!selectedBarangay) return;

    setBarangays((prev) =>
      prev.map((b) =>
        b.id === selectedBarangay.id ? { ...b, ...updatedData } : b
      )
    );
    setIsDialogOpen(false);
    setSelectedBarangay(null);
  };

  const handleReset = () => {
    setBarangays(initialBarangays);
    setSimulationResult(null);
  };

  const handleSubmit = async (barangayData: BarangayData[]) => {
    setIsSubmitting(true);
    setSimulationResult(null);

    try {
      // Mock API call with random delay between 10-20 seconds
      const delay = Math.random() * 10000 + 10000; // 10-20 seconds

      // Log the data being sent (you can replace this with actual API call)
      console.log("Sending barangay data to simulation:", barangayData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Mock simulation result based on actual data
      const totalPersonnel = barangayData.reduce(
        (sum, b) =>
          sum + b.personnel.srr + b.personnel.health + b.personnel.log,
        0
      );
      const criticalAreas = barangayData.filter((b) => b.waterLevel > 2).length;
      const avgWaterLevel =
        barangayData.reduce((sum, b) => sum + b.waterLevel, 0) /
        barangayData.length;

      const mockResults = [
        `Simulation completed! ${totalPersonnel} personnel deployed across ${barangayData.length} barangays.`,
        `Risk assessment: ${criticalAreas} high water areas identified requiring immediate attention.`,
        `Average water level: ${avgWaterLevel.toFixed(
          1
        )}m. Resource optimization: ${Math.floor(
          Math.random() * 20 + 75
        )}% efficiency achieved.`,
        `Estimated emergency response time: ${Math.floor(
          Math.random() * 10 + 8
        )}-${Math.floor(Math.random() * 8 + 15)} minutes.`,
        `Weather forecast impact: ${Math.floor(
          Math.random() * 5 + 1
        )} barangays may experience flooding in next 24 hours.`,
      ];

      const randomResult =
        mockResults[Math.floor(Math.random() * mockResults.length)];
      setSimulationResult(randomResult);
    } catch (error) {
      console.error("Simulation error:", error);
      setSimulationResult("Simulation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <ActionButtons
        barangays={barangays}
        onReset={handleReset}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        simulationResult={simulationResult}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <InteractiveMap
            barangays={barangays}
            onBarangayClick={handleBarangayClick}
          />
        </div>
        <div className="xl:col-span-1">
          <DataSummary barangays={barangays} />
        </div>
      </div>

      <BarangayDialog
        barangay={selectedBarangay}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpdate={handleUpdateBarangay}
      />
    </div>
  );
}
