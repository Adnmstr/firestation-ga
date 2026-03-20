import { Coordinate, Heatmap } from "../ga/types";

export function getGridWidth(heatmap: Heatmap): number {
  return heatmap[0]?.length ?? 0;
}

export function getGridHeight(heatmap: Heatmap): number {
  return heatmap.length;
}

export function isValidCoordinate(
  coordinate: Coordinate,
  heatmap: Heatmap
): boolean {
  const width = getGridWidth(heatmap);
  const height = getGridHeight(heatmap);

  return (
    coordinate.x >= 0 &&
    coordinate.x < width &&
    coordinate.y >= 0 &&
    coordinate.y < height
  );
}

export function coordinateKey(coordinate: Coordinate): string {
  return `${coordinate.x},${coordinate.y}`;
}