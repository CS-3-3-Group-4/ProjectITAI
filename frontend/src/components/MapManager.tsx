import { useState } from "react";
import type { BarangayData, PersonnelData } from "../types";
import { InteractiveMap } from "./InteractiveMap";
import { BarangayDialog } from "./BarangayDialog";
import { DataSummary } from "./DataSummary";
import { ActionButtons } from "./ActionButtons";
import { initialBarangays } from "@/barangays";

export function MapManager() {
  const [barangays, setBarangays] = useState<BarangayData[]>(initialBarangays);
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <div className="space-y-8">
      <ActionButtons barangays={barangays} setBarangays={setBarangays} />

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
