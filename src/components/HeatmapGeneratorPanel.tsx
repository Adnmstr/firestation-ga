import React from "react";
import { HeatmapGeneratorConfig } from "../heatmap/types";

type Props = {
  config: HeatmapGeneratorConfig;
  onConfigChange: (config: HeatmapGeneratorConfig) => void;
  onGenerate: () => void;
};

const HeatmapGeneratorPanel: React.FC<Props> = ({
  config,
  onConfigChange,
  onGenerate,
}) => {
  const updateField = (
    field: keyof HeatmapGeneratorConfig,
    value: number
  ) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="panel">
      <h2>Heatmap Generator</h2>

      <label>
        Grid Size
        <input
          type="number"
          min="5"
          max="50"
          value={config.gridSize}
          onChange={(e) => updateField("gridSize", Number(e.target.value))}
        />
      </label>

      <label>
        Population Centers
        <input
          type="number"
          min="1"
          value={config.centerCount}
          onChange={(e) => updateField("centerCount", Number(e.target.value))}
        />
      </label>

      <label>
        Minimum Center Strength
        <input
          type="number"
          min="1"
          value={config.minCenterStrength}
          onChange={(e) =>
            updateField("minCenterStrength", Number(e.target.value))
          }
        />
      </label>

      <label>
        Maximum Center Strength
        <input
          type="number"
          min="1"
          value={config.maxCenterStrength}
          onChange={(e) =>
            updateField("maxCenterStrength", Number(e.target.value))
          }
        />
      </label>

      <label>
        Spread
        <input
          type="number"
          min="0.5"
          step="0.5"
          value={config.spread}
          onChange={(e) => updateField("spread", Number(e.target.value))}
        />
      </label>

      <label>
        Noise Level
        <input
          type="number"
          min="0"
          step="1"
          value={config.noiseLevel}
          onChange={(e) => updateField("noiseLevel", Number(e.target.value))}
        />
      </label>

      <button onClick={onGenerate}>Generate Heatmap</button>
    </div>
  );
};

export default HeatmapGeneratorPanel;