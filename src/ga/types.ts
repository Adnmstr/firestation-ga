export type Coordinate = {
  x: number;
  y: number;
};

export type Heatmap = number[][];

export type Individual = {
  stations: Coordinate[];
  fitness: number;
  cost: number;
};

export type GAConfig = {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  stationCount: number;
  tournamentSize: number;
};

export type GARunResult = {
  bestIndividual: Individual;
  bestFitnessHistory: number[];
  bestCostHistory: number[];
};