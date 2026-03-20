import { Heatmap, GAConfig, GARunResult, Individual } from "./types";
import {
  getMaxStationsForMap,
  initializePopulation,
} from "./initialization";
import { evaluateIndividual } from "./fitness";
import { tournamentSelect } from "./selection";
import { crossoverStations } from "./crossover";
import { mutateStations } from "./mutation";
import { randomFloat } from "../utils/random";

export function runGeneticAlgorithm(
  heatmap: Heatmap,
  config: GAConfig
): GARunResult {
  const stationCount = getMaxStationsForMap(heatmap, config.stationCount);

  if (
    heatmap.length === 0 ||
    stationCount === 0 ||
    config.populationSize <= 0 ||
    config.generations < 0
  ) {
    return {
      bestIndividual: {
        stations: [],
        fitness: 0,
        cost: 0,
      },
      bestFitnessHistory: [],
      bestCostHistory: [],
    };
  }

  let population = initializePopulation(heatmap, {
    ...config,
    stationCount,
  });

  const bestFitnessHistory: number[] = [];
  const bestCostHistory: number[] = [];

  const clampTournamentSize = Math.max(
    1,
    Math.min(config.tournamentSize, population.length || 1)
  );
  const eliteCount = Math.max(1, Math.min(1, config.populationSize));

  const recordBest = () => {
    const best = population.reduce(
      (acc, current) => (current.fitness > acc.fitness ? current : acc),
      population[0]
    );

    bestFitnessHistory.push(best.fitness);
    bestCostHistory.push(best.cost);

    return best;
  };

  let bestOverall = recordBest();

  for (let generation = 0; generation < config.generations; generation++) {
    const nextPopulation: Individual[] = [];

    const sorted = [...population].sort((a, b) => b.fitness - a.fitness);
    const elites = sorted.slice(0, eliteCount);
    nextPopulation.push(...elites);

    while (nextPopulation.length < config.populationSize) {
      const parentA = tournamentSelect(population, clampTournamentSize);
      const parentB = tournamentSelect(population, clampTournamentSize);
      let childStations = parentA.stations;

      if (randomFloat() < config.crossoverRate) {
        childStations = crossoverStations(
          parentA.stations,
          parentB.stations,
          stationCount,
          heatmap
        );
      }

      const mutated = mutateStations(childStations, heatmap, config.mutationRate);
      const child = evaluateIndividual(mutated, heatmap);
      nextPopulation.push(child);
    }

    population = nextPopulation.slice(0, config.populationSize);
    bestOverall = recordBest();
  }

  const finalBest = population.reduce(
    (acc, current) => (current.fitness > acc.fitness ? current : acc),
    population[0]
  );

  if (finalBest.fitness > bestOverall.fitness) {
    bestOverall = finalBest;
  }

  return {
    bestIndividual: bestOverall,
    bestFitnessHistory,
    bestCostHistory,
  };
}
