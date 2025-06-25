"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCcw, Play, Loader2, CheckCircle } from "lucide-react";
import type { BarangayData } from "../types";

interface ActionButtonsProps {
  barangays: BarangayData[];
  onReset: () => void;
  onSubmit: (data: BarangayData[]) => void;
  isSubmitting: boolean;
  simulationResult: string | null;
}

export function ActionButtons({
  barangays,
  onReset,
  onSubmit,
  isSubmitting,
  simulationResult,
}: ActionButtonsProps) {
  const handleSubmit = () => {
    onSubmit(barangays);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex gap-3">
            <Button
              onClick={onReset}
              variant="outline"
              disabled={isSubmitting}
              className="h-11 px-6 border-2 hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All Data
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>

          {isSubmitting && (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 px-3 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>
                Processing data and running analysis... This may take 10-20
                seconds
              </span>
            </div>
          )}
        </div>

        {simulationResult && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              {simulationResult}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
