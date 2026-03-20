import React from "react";
import { GARunResult } from "../ga/types";

type ResultsPanelProps = {
  result: GARunResult | null;
};

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="panel">
        <h2>Results</h2>
        <p>No run completed yet.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Results</h2>
      <p>
        <strong>Best Fitness:</strong> {result.bestIndividual.fitness.toFixed(4)}
      </p>
      <p>
        <strong>Best Cost:</strong> {result.bestIndividual.cost.toFixed(4)}
      </p>

      <h3>Best Station Coordinates</h3>
      <ul>
        {result.bestIndividual.stations.map((station, index) => (
          <li key={`${station.x}-${station.y}-${index}`}>
            Station {index + 1}: ({station.x}, {station.y})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPanel;