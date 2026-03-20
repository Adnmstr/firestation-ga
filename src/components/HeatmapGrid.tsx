import React, { useEffect, useMemo, useRef, useState } from "react";
import { Coordinate, Heatmap } from "../ga/types";

type Props = {
  heatmap: Heatmap;
  stations: Coordinate[];
};

const getCellColor = (value: number, max: number): string => {
  const intensity = max === 0 ? 0 : value / max;
  const red = 255;
  const green = Math.floor(255 - intensity * 180);
  const blue = Math.floor(255 - intensity * 220);
  return `rgb(${red}, ${green}, ${blue})`;
};

const HeatmapGrid: React.FC<Props> = ({ heatmap, stations }) => {
  const maxValue = Math.max(...heatmap.flat(), 1);
  const stationKeys = useMemo(
    () => new Set(stations.map((s) => `${s.x},${s.y}`)),
    [stations]
  );
  const size = heatmap.length > 0 ? heatmap[0].length : 0;

  const gridRef = useRef<HTMLDivElement | null>(null);
  const [cellFontSize, setCellFontSize] = useState(10);

  useEffect(() => {
    const element = gridRef.current;
    if (!element) {
      return;
    }

    const updateCellSize = () => {
      const width = element.clientWidth;
      if (size <= 0) {
        setCellFontSize(10);
        return;
      }

      const rawCellSize = width / size;
      const nextFont = Math.max(6, Math.min(14, Math.floor(rawCellSize * 0.3)));
      setCellFontSize(nextFont);
    };

    updateCellSize();

    const observer = new ResizeObserver(() => {
      updateCellSize();
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [size, heatmap.length, heatmap]);

  return (
    <div
      ref={gridRef}
      className="heatmap-grid"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
      }}
    >
      {heatmap.map((row, y) =>
        row.map((value, x) => {
          const isStation = stationKeys.has(`${x},${y}`);

          return (
            <div
              key={`${x}-${y}`}
              className={`heatmap-cell ${isStation ? "station-cell" : ""}`}
              style={{ backgroundColor: getCellColor(value, maxValue), fontSize: `${cellFontSize}px` }}
              title={`(${x}, ${y}) Population: ${value}`}
            >
              {isStation ? "S" : value}
            </div>
          );
        })
      )}
    </div>
  );
};

export default HeatmapGrid;
