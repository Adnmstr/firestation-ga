import { Coordinate, Heatmap } from "./types";
import { randomFloat, randomInt } from "../utils/random";
import { coordinateKey, getGridHeight, getGridWidth } from "./grid";

export function crossoverStations(
  parentA: Coordinate[],
  parentB: Coordinate[],
  stationCount: number,
  heatmap: Heatmap
): Coordinate[] {
  const width = getGridWidth(heatmap);
  const height = getGridHeight(heatmap);

  if (width <= 0 || height <= 0 || stationCount <= 0) {
    return [];
  }

  const safeCount = Math.min(stationCount, width * height);
  const child: Coordinate[] = [];
  const used = new Set<string>();

  const addIfUnique = (station: Coordinate): boolean => {
    const key = coordinateKey(station);

    if (used.has(key)) {
      return false;
    }

    used.add(key);
    child.push(station);
    return true;
  };

  for (let i = 0; i < safeCount; i++) {
    const fromA = randomFloat() < 0.5;
    const source = fromA
      ? parentA[i % parentA.length]
      : parentB[i % parentB.length];

    if (source) {
      addIfUnique(source);
    }

    if (child.length >= safeCount) {
      break;
    }
  }

  // Fill with any remaining parent genes first, then random coordinates as needed.
  for (const station of [...parentA, ...parentB]) {
    if (child.length >= safeCount) {
      break;
    }

    addIfUnique(station);
  }

  if (child.length < safeCount) {
    while (child.length < safeCount) {
      const randomStation = {
        x: randomInt(0, width - 1),
        y: randomInt(0, height - 1),
      };

      addIfUnique(randomStation);
    }
  }

  return child;
}
