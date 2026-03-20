import { Heatmap } from "../ga/types";
import { PopulationCenter, HeatmapGeneratorConfig } from "./types";
import { randomFloat, randomInt } from "../utils/random";

function euclideanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

export function generatePopulationCenters(
  config: HeatmapGeneratorConfig
): PopulationCenter[] {
  const centers: PopulationCenter[] = [];

  for (let i = 0; i < config.centerCount; i++) {
    centers.push({
      x: randomInt(0, config.gridSize - 1),
      y: randomInt(0, config.gridSize - 1),
      strength:
        config.minCenterStrength +
        randomFloat() *
          (config.maxCenterStrength - config.minCenterStrength),
    });
  }

  return centers;
}

export function generateHeatmap(
  config: HeatmapGeneratorConfig
): { heatmap: Heatmap; centers: PopulationCenter[] } {
  const centers = generatePopulationCenters(config);
  const heatmap: Heatmap = [];

  for (let y = 0; y < config.gridSize; y++) {
    const row: number[] = [];

    for (let x = 0; x < config.gridSize; x++) {
      let value = 0;

      for (const center of centers) {
        const distance = euclideanDistance(x, y, center.x, center.y);
        const contribution =
          center.strength *
          Math.exp(-(distance * distance) / (2 * config.spread * config.spread));

        value += contribution;
      }

      const noise = (randomFloat() * 2 - 1) * config.noiseLevel;
      value += noise;

      row.push(Math.max(0, Math.round(value)));
    }

    heatmap.push(row);
  }

  return { heatmap, centers };
}