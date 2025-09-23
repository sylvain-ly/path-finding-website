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

export const findCell = (
  grid: CellType[][],
  endpoint: 'start' | 'end'
): [number, number] | null => {
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    for (let cellIndex = 0; cellIndex < grid[rowIndex].length; cellIndex++) {
      if (grid[rowIndex][cellIndex] === endpoint) {
        return [rowIndex, cellIndex];
      }
    }
  }
  return null;
};

export const setGridWithValue = (
  row: number,
  col: number,
  value: CellType,
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>
) => {
  setGrid((prevGrid) =>
    prevGrid.map((rowArray, rowIndex) =>
      rowArray.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return value;
        }
        return cell;
      })
    )
  );
};

export const copyAndResetVisitedCellsInGrid = (grid: CellType[][]): CellType[][] => {
  return grid.map((row) =>
    row.map((cell) => (cell === 'visited' || cell === 'path' ? 'empty' : cell))
  );
};
