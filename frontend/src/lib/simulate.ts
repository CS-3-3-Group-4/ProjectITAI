import type { BarangayData } from "@/types";

export async function simulate(barangayData: BarangayData[]): Promise<string> {
  const delay = Math.random() * 10000 + 10000; // 10–20 sec
  console.log("Sending barangay data to simulation:", barangayData);

  await new Promise((resolve) => setTimeout(resolve, delay));

  const totalPersonnel = barangayData.reduce(
    (sum, b) => sum + b.personnel.srr + b.personnel.health + b.personnel.log,
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

  return mockResults[Math.floor(Math.random() * mockResults.length)];
}
