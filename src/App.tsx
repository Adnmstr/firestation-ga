import React, { useState } from "react";
import "./App.css";
import GAControlPanel from "./components/GAControlPanel";
import HeatmapGeneratorPanel from "./components/HeatmapGeneratorPanel";
import HeatmapGrid from "./components/HeatmapGrid";
import ResultsPanel from "./components/ResultsPanel";
import { runGeneticAlgorithm } from "./ga/geneticAlgorithm";
import { GAConfig, GARunResult, Heatmap } from "./ga/types";
import { generateHeatmap } from "./heatmap/generator";
import { HeatmapGeneratorConfig } from "./heatmap/types";

const defaultHeatmapConfig: HeatmapGeneratorConfig = {
  gridSize: 12,
  centerCount: 3,
  minCenterStrength: 20,
  maxCenterStrength: 100,
  spread: 2.5,
  noiseLevel: 3,
};

const defaultGAConfig: GAConfig = {
  populationSize: 40,
  generations: 60,
  mutationRate: 0.1,
  crossoverRate: 0.8,
  stationCount: 3,
  tournamentSize: 3,
};

function App() {
  const initialMap = generateHeatmap(defaultHeatmapConfig);

  const [heatmapConfig, setHeatmapConfig] =
    useState<HeatmapGeneratorConfig>(defaultHeatmapConfig);
  const [gaConfig, setGAConfig] = useState<GAConfig>(defaultGAConfig);
  const [heatmap, setHeatmap] = useState<Heatmap>(initialMap.heatmap);
  const [result, setResult] = useState<GARunResult | null>(null);

  const handleGenerateHeatmap = () => {
    const generated = generateHeatmap(heatmapConfig);
    setHeatmap(generated.heatmap);
    setResult(null);
  };

  const handleRunGA = () => {
    const gaResult = runGeneticAlgorithm(heatmap, gaConfig);
    setResult(gaResult);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Fire Station Placement Genetic Algorithm</h1>
        <p>
          Generate a city heatmap, then optimize fire station placement using
          Euclidean distance.
        </p>
      </header>

      <main className="app-main">
        <div className="left-column">
          <HeatmapGeneratorPanel
            config={heatmapConfig}
            onConfigChange={setHeatmapConfig}
            onGenerate={handleGenerateHeatmap}
          />

          <GAControlPanel
            config={gaConfig}
            onConfigChange={setGAConfig}
            onRun={handleRunGA}
          />

          <ResultsPanel result={result} />
        </div>

        <div className="right-column">
          <div className="panel">
            <h2>Generated City Heatmap</h2>
            <HeatmapGrid
              heatmap={heatmap}
              stations={result?.bestIndividual.stations ?? []}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;