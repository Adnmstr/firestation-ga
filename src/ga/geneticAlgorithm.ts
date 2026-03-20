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

function generationStats(population: Individual[]): {
  best: Individual;
  averageFitness: number;
} {
  let best = population[0];
  let totalFitness = 0;

  for (const individual of population) {
    totalFitness += individual.fitness;
    if (individual.fitness > best.fitness) {
      best = individual;
    }
  }

  return {
    best,
    averageFitness: totalFitness / population.length,
  };
}

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
      averageFitnessHistory: [],
      bestCostHistory: [],
    };
  }

  let population = initializePopulation(heatmap, {
    ...config,
    stationCount,
  });

  if (population.length === 0) {
    return {
      bestIndividual: {
        stations: [],
        fitness: 0,
        cost: 0,
      },
      bestFitnessHistory: [],
      averageFitnessHistory: [],
      bestCostHistory: [],
    };
  }

  const bestFitnessHistory: number[] = [];
  const averageFitnessHistory: number[] = [];
  const bestCostHistory: number[] = [];

  const tournamentSize = Math.max(1, Math.min(config.tournamentSize, population.length));
  const eliteCount = Math.max(1, Math.min(1, config.populationSize));

  const recordGeneration = () => {
    const { best, averageFitness } = generationStats(population);
    bestFitnessHistory.push(best.fitness);
    averageFitnessHistory.push(averageFitness);
    bestCostHistory.push(best.cost);
    return best;
  };

  let bestOverall = recordGeneration();

  for (let generation = 0; generation < config.generations; generation++) {
    const nextPopulation: Individual[] = [];

    const sorted = [...population].sort((a, b) => b.fitness - a.fitness);
    const elites = sorted.slice(0, eliteCount);
    nextPopulation.push(...elites);

    while (nextPopulation.length < config.populationSize) {
      const parentA = tournamentSelect(population, tournamentSize);
      const parentB = tournamentSelect(population, tournamentSize);
      let childStations = parentA.stations;

      if (randomFloat() < config.crossoverRate) {
        childStations = crossoverStations(
          parentA.stations,
          parentB.stations,
          stationCount,
          heatmap
        );
      }

      const mutatedStations = mutateStations(childStations, heatmap, config.mutationRate);
      const child = evaluateIndividual(mutatedStations, heatmap);
      nextPopulation.push(child);
    }

    population = nextPopulation.slice(0, config.populationSize);
    const generationBest = recordGeneration();

    if (generationBest.fitness > bestOverall.fitness) {
      bestOverall = generationBest;
    }
  }

  const finalBest = population.reduce((acc, current) => {
    return current.fitness > acc.fitness ? current : acc;
  }, population[0]);

  if (finalBest.fitness > bestOverall.fitness) {
    bestOverall = finalBest;
  }

  return {
    bestIndividual: bestOverall,
    bestFitnessHistory,
    averageFitnessHistory,
    bestCostHistory,
  };
}
