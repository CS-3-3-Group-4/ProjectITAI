import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RotateCcw,
  Play,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import type { BarangayData, SimulationResult, Personnel } from "../types";
import { initialBarangays } from "@/barangays";
import { useMutation } from "@/hooks/useMutation";

interface ActionButtonsProps {
  barangays: BarangayData[];
  setBarangays: (data: BarangayData[]) => void;
}

export function ActionButtons({ barangays, setBarangays }: ActionButtonsProps) {
  const {
    mutate: runSimulation,
    data: simulationResult,
    loading: isSubmitting,
    error,
    reset,
  } = useMutation(simulate);

  const handleReset = () => {
    setBarangays(initialBarangays);
    reset();
  };

  const handleSubmit = async () => {
    try {
      await runSimulation(barangays);
    } catch {
      console.error("Simulation failed.");
    }
  };

  async function simulate(
    barangays: BarangayData[]
  ): Promise<SimulationResult> {
    // Strip frontend-only `coordinates` field
    const payload = barangays.map(({ id, name, waterLevel, personnel }) => ({
      id,
      name,
      waterLevel,
      personnel,
    }));

    const res = await fetch("http://localhost:8000/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      const message = Array.isArray(err.detail)
        ? err.detail[0].msg
        : err.detail || "Something went wrong";
      throw new Error(message);
    }

    const data = await res.json();
    console.log(data.message.pso);
    return data.message as SimulationResult;
  }

  // Helper component to render simulation results
  const SimulationResultCard = ({
    title,
    emoji,
    result,
  }: {
    title: string;
    emoji: string;
    result: [Record<string, Personnel>, number, number] | undefined;
  }) => {
    if (!result || !Array.isArray(result) || result.length !== 3) {
      return (
        <div className="mb-6">
          <p className="font-semibold text-base mb-3">
            {emoji} {title}:
          </p>
          <div className="bg-white border border-green-200 rounded-lg px-4 py-3 text-sm text-gray-500">
            No results available
          </div>
        </div>
      );
    }

    const [barangayMap, fitness, time] = result;

    return (
      <div className="mb-6">
        <p className="font-semibold text-base mb-3">
          {emoji} {title}:
        </p>
        <SimulationEntry
          barangayMap={barangayMap}
          fitness={fitness}
          time={time}
        />
      </div>
    );
  };

  // Helper component for individual simulation entries
  const SimulationEntry = ({
    barangayMap,
    fitness,
    time,
  }: {
    barangayMap: Record<string, Personnel>;
    fitness: number;
    time: number;
  }) => {
    const barangayEntries = Object.entries(barangayMap);

    return (
      <div className="bg-white border border-green-200 rounded-lg px-4 py-3 shadow-sm mb-4">
        {barangayEntries.length === 0 ? (
          <div className="text-sm text-gray-500 mb-2">
            No barangay data available
          </div>
        ) : (
          barangayEntries.map(([name, personnel]) => (
            <BarangayPersonnelInfo
              key={name}
              name={name}
              personnel={personnel}
            />
          ))
        )}
        <div className="text-sm mt-3 pt-2 border-t border-green-100">
          <span className="font-medium">Fitness Score:</span>{" "}
          {fitness.toFixed(3)} |<span className="font-medium ml-2">Time:</span>{" "}
          {time.toFixed(3)}s
        </div>
      </div>
    );
  };

  // Helper component for barangay personnel information
  const BarangayPersonnelInfo = ({
    name,
    personnel,
  }: {
    name: string;
    personnel: Personnel | null;
  }) => {
    const personnelSafe = personnel ?? {
      srr: "N/A",
      health: "N/A",
      log: "N/A",
    };

    return (
      <div className="mb-2">
        <p className="font-medium text-sm text-gray-800">Barangay: {name}</p>
        <p className="text-sm text-gray-600">
          Personnel →
          <span className="ml-1">
            SRR: <strong>{personnelSafe.srr}</strong>, Health:{" "}
            <strong>{personnelSafe.health}</strong>, Log:{" "}
            <strong>{personnelSafe.log}</strong>
          </span>
        </p>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex gap-3">
            <Button
              onClick={handleReset}
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
              <div className="flex items-center justify-center w-full gap-2">
                <SimulationResultCard
                  title="PSO Results"
                  emoji="📘"
                  result={simulationResult.pso}
                />
                <SimulationResultCard
                  title="FA Results"
                  emoji="📗"
                  result={simulationResult.fa}
                />
              </div>
            </AlertDescription>
          </Alert>
        )}

        {Boolean(error) && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              {error instanceof Error
                ? error.message
                : "Simulation failed. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
