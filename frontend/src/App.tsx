import { MapManager } from "@/components/MapManager";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 font-outfit">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8 border-b border-slate-200 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                  Emergency Response Dashboard
                </h1>
                <p className="text-slate-500">
                  PSO Emergency Response Personnel Allocation
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">
                  System Active
                </span>
              </div>
            </div>
          </div>
          <MapManager />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
