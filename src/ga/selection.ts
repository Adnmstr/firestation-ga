import { Individual } from "./types";
import { randomInt } from "../utils/random";

export function tournamentSelect(
  population: Individual[],
  tournamentSize: number
): Individual {
  if (population.length === 0) {
    throw new Error("Population cannot be empty during selection.");
  }

  const participants = Math.max(
    1,
    Math.min(tournamentSize, population.length)
  );
  const winner = population[randomInt(0, population.length - 1)];

  let best = winner;

  for (let i = 1; i < participants; i++) {
    const candidate = population[randomInt(0, population.length - 1)];

    if (candidate.fitness > best.fitness) {
      best = candidate;
    }
  }

  return best;
}
