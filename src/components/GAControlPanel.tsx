import React from "react";
import { GAConfig } from "../ga/types";

type Props = {
  config: GAConfig;
  onConfigChange: (config: GAConfig) => void;
  onRun: () => void;
};

const GAControlPanel: React.FC<Props> = ({
  config,
  onConfigChange,
  onRun,
}) => {
  const updateField = (field: keyof GAConfig, value: number) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="panel">
      <h2>Genetic Algorithm</h2>

      <label>
        GA Population Size
        <input
          type="number"
          min="2"
          value={config.populationSize}
          onChange={(e) => updateField("populationSize", Number(e.target.value))}
        />
      </label>

      <label>
        Generations
        <input
          type="number"
          min="1"
          value={config.generations}
          onChange={(e) => updateField("generations", Number(e.target.value))}
        />
      </label>

      <label>
        Mutation Rate
        <input
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={config.mutationRate}
          onChange={(e) => updateField("mutationRate", Number(e.target.value))}
        />
      </label>

      <label>
        Crossover Rate
        <input
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={config.crossoverRate}
          onChange={(e) => updateField("crossoverRate", Number(e.target.value))}
        />
      </label>

      <label>
        Tournament Size
        <input
          type="number"
          min="2"
          value={config.tournamentSize}
          onChange={(e) => updateField("tournamentSize", Number(e.target.value))}
        />
      </label>

      <label>
        Number of Fire Stations
        <input
          type="number"
          min="1"
          value={config.stationCount}
          onChange={(e) => updateField("stationCount", Number(e.target.value))}
        />
      </label>

      <button onClick={onRun}>Run GA</button>
    </div>
  );
};

export default GAControlPanel;