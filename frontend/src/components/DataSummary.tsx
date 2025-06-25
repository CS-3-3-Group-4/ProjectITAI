import type { BarangayData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Heart,
  Shield,
  Truck,
} from "lucide-react";

interface DataSummaryProps {
  barangays: BarangayData[];
}

export function DataSummary({ barangays }: DataSummaryProps) {
  const getTotalPersonnel = (personnel: BarangayData["personnel"]) => {
    return personnel.srr + personnel.health + personnel.log;
  };

  const totalPersonnel = barangays.reduce(
    (sum, b) => sum + getTotalPersonnel(b.personnel),
    0
  );
  const totalSRR = barangays.reduce((sum, b) => sum + b.personnel.srr, 0);
  const totalHealth = barangays.reduce((sum, b) => sum + b.personnel.health, 0);
  const totalLog = barangays.reduce((sum, b) => sum + b.personnel.log, 0);
  const avgWaterLevel =
    barangays.reduce((sum, b) => sum + b.waterLevel, 0) / barangays.length;
  const criticalBarangays = barangays.filter((b) => b.waterLevel > 2);

  const getStatusBadge = (waterLevel: number) => {
    if (waterLevel > 2) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          High Water
        </Badge>
      );
    }
    if (waterLevel > 1) {
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
          Medium Water
        </Badge>
      );
    }
    if (waterLevel > 0) {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          Low Water
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
        No Water
      </Badge>
    );
  };

  const statCards = [
    {
      title: "Total Personnel",
      value: totalPersonnel,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Avg Water Level",
      value: `${avgWaterLevel.toFixed(2)}m`,
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "High Water Areas",
      value: criticalBarangays.length,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const personnelBreakdown = [
    { label: "SRR", value: totalSRR, icon: Shield, color: "text-red-500" },
    {
      label: "HEALTH",
      value: totalHealth,
      icon: Heart,
      color: "text-green-500",
    },
    { label: "LOG", value: totalLog, icon: Truck, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-800">Personnel Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {personnelBreakdown.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <div>
                  <p className="text-xs text-slate-600">{item.label}</p>
                  <p className="font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Barangay Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {barangays.map((barangay) => (
                <div
                  key={barangay.id}
                  className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex gap-1 items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900 px-0.5">
                      {barangay.name}
                    </h4>
                    {getStatusBadge(barangay.waterLevel)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Droplets className="w-3 h-3" />
                      <span>{barangay.waterLevel}m water level</span>
                    </div>
                    <div className="grid grid-rows-3 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Shield className="w-3 h-3 text-red-500" />
                        <span>{barangay.personnel.srr} SRR</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Heart className="w-3 h-3 text-green-500" />
                        <span>{barangay.personnel.health} HEALTH</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Truck className="w-3 h-3 text-blue-500" />
                        <span>{barangay.personnel.log} LOG</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
