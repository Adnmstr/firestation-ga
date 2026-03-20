import { Coordinate, Heatmap, GAConfig, Individual } from "./types";
import { randomInt } from "../utils/random";
import { evaluateIndividual } from "./fitness";
import { getGridHeight, getGridWidth, coordinateKey } from "./grid";

export function getMaxStationsForMap(
  heatmap: Heatmap,
  requestedCount: number
): number {
  const width = getGridWidth(heatmap);
  const height = getGridHeight(heatmap);

  return Math.max(0, Math.min(requestedCount, width * height));
}

export function initializePopulation(
  heatmap: Heatmap,
  config: GAConfig
): Individual[] {
  const stationCount = getMaxStationsForMap(heatmap, config.stationCount);

  if (
    stationCount === 0 ||
    config.populationSize <= 0 ||
    getGridWidth(heatmap) === 0 ||
    getGridHeight(heatmap) === 0
  ) {
    return [];
  }

  return Array.from({ length: config.populationSize }, () =>
    createRandomIndividual(heatmap, stationCount)
  );
}

export function createRandomIndividual(
  heatmap: Heatmap,
  stationCount: number
): Individual {
  const coordinates = generateUniqueCoordinates(heatmap, stationCount);
  return evaluateIndividual(coordinates, heatmap);
}

function generateUniqueCoordinates(
  heatmap: Heatmap,
  stationCount: number
): Coordinate[] {
  const width = getGridWidth(heatmap);
  const height = getGridHeight(heatmap);
  const coordinates: Coordinate[] = [];
  const used = new Set<string>();
  const maxTries = Math.max(1, width * height) * 3;

  if (width === 0 || height === 0) {
    return coordinates;
  }

  const safeCount = Math.min(stationCount, width * height);

  for (let i = 0; i < safeCount; i++) {
    let attempts = 0;
    let station: Coordinate | null = null;

    while (attempts < maxTries && station === null) {
      const candidate = {
        x: randomInt(0, width - 1),
        y: randomInt(0, height - 1),
      };
      const key = coordinateKey(candidate);

      if (!used.has(key)) {
        used.add(key);
        station = candidate;
      }

      attempts++;
    }

    if (!station) {
      // If random sampling fails, fill remaining by deterministic scan.
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const candidate = { x, y };
          const key = coordinateKey(candidate);

          if (!used.has(key)) {
            used.add(key);
            station = candidate;
            break;
          }
        }

        if (station) {
          break;
        }
      }
    }

    if (station) {
      coordinates.push(station);
    }
  }

  return coordinates;
}
