import React from "react";

type Props = {
  bestFitnessHistory: number[];
  averageFitnessHistory: number[];
};

const toPoints = (
  values: number[],
  width: number,
  height: number,
  padding: number
) => {
  if (values.length === 0) {
    return "";
  }

  const range = Math.max(...values) - Math.min(...values) || 1;
  const xStep = (width - padding * 2) / (values.length - 1 || 1);

  return values
    .map((value, index) => {
      const x = padding + index * xStep;
      const normalized = (value - Math.min(...values)) / range;
      const y = height - padding - normalized * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
};

const FitnessGraph: React.FC<Props> = ({
  bestFitnessHistory,
  averageFitnessHistory,
}) => {
  const width = 640;
  const height = 260;
  const padding = 28;

  const hasData =
    bestFitnessHistory.length > 0 && averageFitnessHistory.length > 0;

  if (!hasData) {
    return (
      <div className="panel">
        <h3>GA Fitness Progress</h3>
        <p>No GA run yet.</p>
      </div>
    );
  }

  const allValues = [...bestFitnessHistory, ...averageFitnessHistory];
  const bestPoints = toPoints(bestFitnessHistory, width, height, padding);
  const avgPoints = toPoints(averageFitnessHistory, width, height, padding);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <div className="panel">
      <h3>GA Fitness Progress</h3>
      <p>
        Average Fitness (last):{" "}
        {averageFitnessHistory[averageFitnessHistory.length - 1].toFixed(6)}
      </p>

      <div className="fitness-chart">
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <rect x="0" y="0" width={width} height={height} fill="white" />

          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#9aa5b1"
            strokeWidth="1"
          />

          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#9aa5b1"
            strokeWidth="1"
          />

          <polyline
            fill="none"
            stroke="#0f62fe"
            strokeWidth="2"
            points={bestPoints}
          />
          <polyline
            fill="none"
            stroke="#2a9d8f"
            strokeWidth="2"
            points={avgPoints}
          />
        </svg>
      </div>

      <div className="fitness-key">
        <div className="fitness-key-item">
          <span className="fitness-key-swatch fitness-key-best" />
          <span>Best Fitness</span>
        </div>
        <div className="fitness-key-item">
          <span className="fitness-key-swatch fitness-key-average" />
          <span>Average Fitness</span>
        </div>
      </div>

      <div className="fitness-legend">
        <span>
          Best: min {minValue.toFixed(4)} max {maxValue.toFixed(4)}
        </span>
      </div>
    </div>
  );
};

export default FitnessGraph;
