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

export const resetVisitedCells = (setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>) => {
  setGrid((prevGrid) =>
    prevGrid.map((row) => row.map((cell) => (cell === 'visited' ? 'empty' : cell)))
  );
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

const directions = [
  [0, 1],
  [-1, 0],
  [1, 0],
  [0, -1],
];

const copyAndResetVisitedCellsInGrid = (grid: CellType[][]): CellType[][] => {
  return grid.map((row) => row.map((cell) => (cell === 'visited' ? 'empty' : cell)));
};

export const dfs = (
  grid: CellType[][],
  start: [number, number],
  end: [number, number],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>
) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );

  const localGrid = copyAndResetVisitedCellsInGrid(grid);

  const dfsRec = (row: number, col: number) => {
    if (row === end[0] && col === end[1]) return true;

    visited[row][col] = true;
    if (localGrid[row][col] !== 'start') {
      localGrid[row][col] = 'visited';
      setGrid(grid.map((row) => [...row]));
    }

    for (const [dirRow, dirCol] of directions) {
      const newRow = row + dirRow;
      const newCol = col + dirCol;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        (localGrid[newRow][newCol] === 'empty' || localGrid[newRow][newCol] === 'end')
      ) {
        if (dfsRec(newRow, newCol)) {
          return true;
        }
      }
    }

    return false;
  };

  const result = dfsRec(start[0], start[1]);

  setGrid(localGrid);
};
