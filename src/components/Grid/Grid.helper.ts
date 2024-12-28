import { CellType } from '../Cell/Cell';

export const initializeGrid = (rows: number, cols: number): CellType[][] => {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'empty' as CellType)
  );

  const startRow = Math.floor(rows / 2);
  const startCol = Math.floor(cols / 3);
  const endRow = Math.floor(rows / 2);
  const endCol = Math.floor((2 * cols) / 3);

  grid[startRow][startCol] = 'start';
  grid[endRow][endCol] = 'end';

  return grid;
};
