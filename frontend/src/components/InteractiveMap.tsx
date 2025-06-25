import type { BarangayData } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import mandaluyongMap from "@/assets/Mandaluyong Barangay Map.png";
import { Users, Droplets } from "lucide-react";

interface InteractiveMapProps {
  barangays: BarangayData[];
  onBarangayClick: (barangay: BarangayData) => void;
}

export function InteractiveMap({
  barangays,
  onBarangayClick,
}: InteractiveMapProps) {
  const getTotalPersonnel = (personnel: BarangayData["personnel"]) => {
    return personnel.srr + personnel.health + personnel.log;
  };

  const getWaterLevelColor = (waterLevel: number) => {
    if (waterLevel > 2) return "bg-red-500 shadow-red-200";
    if (waterLevel > 1) return "bg-amber-500 shadow-amber-200";
    if (waterLevel > 0) return "bg-blue-500 shadow-blue-200";
    return "bg-gray-300 shadow-gray-200";
  };

  const hasWaterData = (waterLevel: number) => waterLevel > 0;
  const hasPersonnelData = (personnel: BarangayData["personnel"]) =>
    getTotalPersonnel(personnel) > 0;

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h2 className="text-xl font-semibold">Interactive Map</h2>
        <p className="text-blue-100 text-sm mt-1">
          Click markers to update barangay data
        </p>
      </div>

      <div className="p-4">
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden border-2 border-slate-200">
          <img
            src={mandaluyongMap}
            alt="Map"
            className="w-full h-auto max-h-[625px] object-contain"
          />
          {barangays.map((barangay) => (
            <button
              key={barangay.id}
              onClick={() => onBarangayClick(barangay)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 hover:z-50"
              style={{
                left: `${(barangay.coordinates.x / 600) * 100}%`,
                top: `${(barangay.coordinates.y / 900) * 100}%`,
              }}
            >
              <div className="relative">
                {/* Main marker */}
                <div
                  className={`w-5 h-5 rounded-full border-3 border-white shadow-lg transition-all duration-300 group-hover:scale-150 group-hover:shadow-xl ${getWaterLevelColor(
                    barangay.waterLevel
                  )}`}
                />

                {/* Status indicators */}
                <div className="absolute -top-1 -right-0.25 flex items-center justify-between gap-1">
                  {/* Water level indicator */}
                  {hasWaterData(barangay.waterLevel) && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full border border-white shadow-sm">
                      <Droplets className="w-1 h-1 text-white opacity-0" />
                    </div>
                  )}

                  {/* Personnel indicator */}
                  {hasPersonnelData(barangay.personnel) && (
                    <div className="w-2 h-2 bg-green-600 rounded-full border border-white shadow-sm">
                      <Users className="w-1 h-1 text-white opacity-0" />
                    </div>
                  )}
                </div>

                {/* Hover tooltip */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 scale-95 group-hover:scale-100 pointer-events-none">
                  <Badge
                    variant="secondary"
                    className="text-xs whitespace-nowrap bg-white/95 backdrop-blur-sm shadow-xl border-2 border-white/50 px-3 py-1 font-medium"
                  >
                    <div className="text-center">
                      <div className="font-semibold">{barangay.name}</div>
                      <div className="text-xs text-slate-600 mt-1">
                        Water: {barangay.waterLevel}m | Personnel:{" "}
                        {getTotalPersonnel(barangay.personnel)}
                      </div>

                      <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-2">
                        {hasWaterData(barangay.waterLevel) && (
                          <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            Water Set
                          </span>
                        )}
                        {hasPersonnelData(barangay.personnel) && (
                          <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                            Personnel Set
                          </span>
                        )}
                      </div>
                    </div>
                  </Badge>

                  {/* Arrow pointing to marker */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/95 border-l border-t border-white/50 rotate-45"></div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {/* Water level legend */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Water Level
            </h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full shadow-sm"></div>
                <span className="text-slate-600">No Water (0m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600">Low (0-1m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600">Medium (1-2m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-slate-600">High (2m+)</span>
              </div>
            </div>
          </div>

          {/* Status indicators legend */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Data Status Indicators
            </h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                <span className="text-slate-600">Water Level Set</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full shadow-sm"></div>
                <span className="text-slate-600">Personnel Assigned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
