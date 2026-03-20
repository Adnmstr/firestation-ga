# Fire Station GA Simulation

This project is a React + TypeScript web app that simulates placing fire stations on a generated square population heatmap using a genetic algorithm.

Users can:

- Generate a square city heatmap from a set of configurable population centers.
- Configure GA settings (population size, generations, mutation/crossover rates, tournament size, station count).
- Run the genetic algorithm on the **currently generated heatmap**.
- Visualize the resulting station placement on the heatmap.
- Track optimization progress with a fitness chart (best vs average fitness by generation).

## Demo Features

- Dynamic square heatmap generation
- GA-driven optimization for station placement
- Nearest-station weighted Euclidean distance as fitness objective
- UI separation between heatmap-generation controls and GA controls
- Real-time results panel showing best individual stations
- Fitness visualization under the heatmap with legend

## Tech Stack

- React 19
- TypeScript 4.9
- Create React App
- CRA tooling (`react-scripts`)

## Project Structure

```text
src/
  components/
    GAControlPanel.tsx
    HeatmapGeneratorPanel.tsx
    HeatmapGrid.tsx
    FitnessGraph.tsx
    ResultsPanel.tsx
    StationOverlay.tsx
  ga/
    crossover.ts
    fitness.ts
    geneticAlgorithm.ts
    initialization.ts
    grid.ts
    mutation.ts
    selection.ts
    types.ts
  heatmap/
    generator.ts
    types.ts
  utils/
    random.ts
  App.tsx
  App.css
  index.tsx
  index.css
  react-app-env.d.ts
  data/
    sampleHeatmaps.ts
```

## How it works

### 1) Heatmap generation

`src/heatmap/generator.ts` builds a `number[][]` heatmap of shape `gridSize x gridSize`.

- Random population centers are placed on the grid.
- Each cell receives population contribution from all centers using Gaussian-like decay.
- Configurable noise is added.
- Final values are clamped to non-negative integers.

### 2) GA encoding

A chromosome/individual is a list of unique station coordinates:

- `Coordinate`: `{ x: number; y: number }`
- `Individual`: `{ stations, fitness, cost }`
- `Individual.stations` stores station locations on the heatmap.

Important constraints enforced in logic:

- Station coordinates are always within map bounds.
- No duplicates inside one individual.
- Station count is clamped to valid grid capacity (`gridSize * gridSize`).

### 3) Fitness objective

`src/ga/fitness.ts` evaluates stations using:

- Population-weighted nearest-station Euclidean distance.
- Lower weighted cost is better.
- Fitness is transformed as `1 / (1 + cost)`.

### 4) GA flow

`src/ga/geneticAlgorithm.ts`:

- Initializes a valid random population.
- Runs generation loops:
  - Tournament selection
  - Crossover
  - Mutation
  - Evaluation
- Tracks:
  - Best fitness history
  - Average fitness history
  - Best cost history
- Returns the best individual from the run.

## Scripts

From the project root:

- `npm install`
- `npm start` — run dev server
- `npm run build` — production build
- `npm test` — run tests (if/when added)

## Expected flow in the UI

1. Configure and generate a heatmap in **Heatmap Generator** panel.
2. Configure GA parameters in **Genetic Algorithm** panel.
3. Click **Run GA**.
4. View:
   - Heatmap with best station placement
   - Station list in results panel
   - Fitness progress graph (best and average lines)

## Notes

- `src/data/sampleHeatmaps.ts` exists as a module placeholder for future sample presets.
- `src/components/StationOverlay.tsx` is currently a stub for future map overlays.
- Fitness/GA modules are intentionally kept separate from UI components for readability and maintainability.

## Extensibility ideas

- Add a chart tooltip and selectable metric overlays.
- Add stop/continue GA controls with animation of generations.
- Add export/import of generated heatmaps and run configurations.
- Add more crossover operators and mutation strategies.
- Add distance variants (Manhattan, travel-time approximation).
