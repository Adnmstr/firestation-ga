import { Coordinate, Heatmap } from "./types";
import { randomFloat, randomInt } from "../utils/random";
import { coordinateKey, getGridHeight, getGridWidth } from "./grid";

export function mutateStations(
  stations: Coordinate[],
  heatmap: Heatmap,
  mutationRate: number
): Coordinate[] {
  const width = getGridWidth(heatmap);
  const height = getGridHeight(heatmap);

  if (width <= 0 || height <= 0 || stations.length === 0 || mutationRate <= 0) {
    return stations.map((station) => ({ ...station }));
  }

  const mutated = stations.map((station) => ({ ...station }));
  const used = new Set<string>(mutated.map((station) => coordinateKey(station)));

  for (let i = 0; i < mutated.length; i++) {
    if (randomFloat() >= mutationRate) {
      continue;
    }

    const original = mutated[i];
    used.delete(coordinateKey(original));

    if (used.size >= width * height - 1) {
      const randomX = randomInt(0, width - 1);
      const randomY = randomInt(0, height - 1);
      const replacement = { x: randomX, y: randomY };

      mutated[i] = replacement;
      used.add(coordinateKey(replacement));
      continue;
    }

    let replacement = original;
    let placed = false;

    for (let attempts = 0; attempts < 32; attempts++) {
      const candidate = {
        x: randomInt(0, width - 1),
        y: randomInt(0, height - 1),
      };
      const key = coordinateKey(candidate);

      if (!used.has(key)) {
        replacement = candidate;
        used.add(key);
        placed = true;
        break;
      }
    }

    if (!placed) {
      // Deterministic fallback path when random retries fail.
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const candidate = { x, y };
          const key = coordinateKey(candidate);

          if (!used.has(key)) {
            replacement = candidate;
            used.add(key);
            placed = true;
            break;
          }
        }

        if (placed) {
          break;
        }
      }
    }

    if (!placed) {
      // As a final fallback, keep original to avoid duplicates and stay valid.
      replacement = original;
      used.add(coordinateKey(replacement));
    }

    mutated[i] = replacement;
  }

  return mutated;
}
