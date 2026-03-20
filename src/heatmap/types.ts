export type HeatmapGeneratorConfig = {
  gridSize: number;
  centerCount: number;
  minCenterStrength: number;
  maxCenterStrength: number;
  spread: number;
  noiseLevel: number;
};

export type PopulationCenter = {
  x: number;
  y: number;
  strength: number;
};