import { useEffect, useState } from 'react';

interface GridSize {
  rows: number;
  cols: number;
}

const CELL_SIZE = 25;

export const useDynamicGrid = (
  ml = 25,
  mb = 100
): { gridSize: GridSize; ml: number; mb: number } => {
  const [gridSize, setGridSize] = useState<GridSize>({ rows: 20, cols: 40 });

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const usableWidth = Math.max(width - ml * 2, CELL_SIZE);
      const usableHeight = Math.max(height - mb * 2, CELL_SIZE);

      const cols = Math.floor(usableWidth / CELL_SIZE);
      const rows = Math.floor(usableHeight / CELL_SIZE);

      setGridSize({ rows, cols });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [CELL_SIZE, ml, mb]);

  return { gridSize: gridSize, ml: ml, mb: mb };
};
