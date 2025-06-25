import type React from "react";

import { useState, useEffect } from "react";
import type { BarangayData, PersonnelData } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Droplets, Shield, Heart, Truck, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BarangayDialogProps {
  barangay: BarangayData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: { waterLevel: number; personnel: PersonnelData }) => void;
}

export function BarangayDialog({
  barangay,
  isOpen,
  onClose,
  onUpdate,
}: BarangayDialogProps) {
  const [waterLevel, setWaterLevel] = useState("");
  const [personnel, setPersonnel] = useState<PersonnelData>({
    srr: 0,
    health: 0,
    log: 0,
  });

  useEffect(() => {
    if (barangay) {
      setWaterLevel(barangay.waterLevel.toString());
      setPersonnel(barangay.personnel);
    }
  }, [barangay]);

  const handlePersonnelChange = (type: keyof PersonnelData, value: string) => {
    setPersonnel((prev) => ({
      ...prev,
      [type]: Number.parseInt(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const waterLevelNum = Number.parseFloat(waterLevel) || 0;

    onUpdate({
      waterLevel: waterLevelNum,
      personnel,
    });
  };

  if (!barangay) return null;

  const personnelTypes = [
    {
      key: "srr" as keyof PersonnelData,
      label: "SRR",
      icon: Shield,
      color: "text-red-500",
      description: "Search, Rescue and Retrieval (AFP)",
    },
    {
      key: "health" as keyof PersonnelData,
      label: "HEALTH",
      icon: Heart,
      color: "text-green-500",
      description: "Medical and Public Health Services, Water-Sanitation",
    },
    {
      key: "log" as keyof PersonnelData,
      label: "LOG",
      icon: Truck,
      color: "text-blue-500",
      description: "Warehousing, Transportation, & Services (OCD)",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl max-h-[90vh] font-outfit overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {barangay.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="waterLevel"
              className="text-sm font-medium flex items-center gap-2 text-slate-700"
            >
              <Droplets className="w-4 h-4 text-blue-500" />
              Water Level (meters)
            </Label>
            <Input
              id="waterLevel"
              type="number"
              step="0.01"
              min="0"
              value={waterLevel}
              onChange={(e) => setWaterLevel(e.target.value)}
              placeholder="0.0"
              className="h-11 border-2 focus:border-blue-400 transition-colors"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-medium text-slate-700">
              Emergency Personnel
            </Label>
            <TooltipProvider>
              <div className="grid grid-cols-1 gap-4">
                {personnelTypes.map((type) => (
                  <div key={type.key} className="space-y-2">
                    <Label
                      htmlFor={type.key}
                      className="text-xs font-medium flex items-center gap-2 text-slate-600"
                    >
                      <type.icon className={`w-3 h-3 ${type.color}`} />
                      <span>{type.label}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm text-center">
                            {type.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id={type.key}
                      type="number"
                      min="0"
                      value={personnel[type.key]}
                      onChange={(e) =>
                        handlePersonnelChange(type.key, e.target.value)
                      }
                      placeholder="0"
                      className="h-10 text-sm border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
