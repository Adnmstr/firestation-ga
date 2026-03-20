import { Coordinate, Heatmap, Individual } from "./types";

export function euclideanDistance(a: Coordinate, b: Coordinate): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function computeWeightedCost(
  stations: Coordinate[],
  heatmap: Heatmap
): number {
  let totalWeightedDistance = 0;
  let totalPopulation = 0;

  for (let y = 0; y < heatmap.length; y++) {
    for (let x = 0; x < heatmap[y].length; x++) {
      const population = heatmap[y][x];

      if (population <= 0) {
        continue;
      }

      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const station of stations) {
        const distance = euclideanDistance({ x, y }, station);
        if (distance < nearestDistance) {
          nearestDistance = distance;
        }
      }

      totalWeightedDistance += population * nearestDistance;
      totalPopulation += population;
    }
  }

  if (totalPopulation === 0) {
    return 0;
  }

  return totalWeightedDistance / totalPopulation;
}

export function computeFitness(cost: number): number {
  return 1 / (1 + cost);
}

export function evaluateIndividual(
  stations: Coordinate[],
  heatmap: Heatmap
): Individual {
  const cost = computeWeightedCost(stations, heatmap);
  const fitness = computeFitness(cost);

  return {
    stations,
    fitness,
    cost,
  };
}