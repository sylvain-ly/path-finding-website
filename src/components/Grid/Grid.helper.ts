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

const directions = [
  [0, 1],
  [-1, 0],
  [1, 0],
  [0, -1],
];

const copyAndResetVisitedCellsInGrid = (grid: CellType[][]): CellType[][] => {
  return grid.map((row) =>
    row.map((cell) => (cell === 'visited' || cell === 'path' ? 'empty' : cell))
  );
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dfs = async (
  grid: CellType[][],
  start: [number, number],
  end: [number, number],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>
): Promise<boolean> => {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );

  const localGrid = copyAndResetVisitedCellsInGrid(grid);

  const dfsRec = async (
    row: number,
    col: number,
    predecessors: ([number, number] | null)[][]
  ): Promise<boolean> => {
    if (row === end[0] && col === end[1]) return true;

    visited[row][col] = true;
    if (localGrid[row][col] !== 'start') {
      localGrid[row][col] = 'visited';
      setGrid(localGrid.map((row) => [...row]));
      await delay(1);
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
        predecessors[newRow][newCol] = [row, col];
        if (await dfsRec(newRow, newCol, predecessors)) {
          return true;
        }
      }
    }

    return false;
  };

  const predecessors: ([number, number] | null)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );

  const isPathFound = await dfsRec(start[0], start[1], predecessors);

  if (isPathFound) {
    let currentRow = end[0];
    let currentCol = end[1];
    await tracePath(currentRow, currentCol, predecessors, setGrid);
  }
  return false;
};

const tracePath = async (
  endRow: number,
  endCol: number,
  predecessors: ([number, number] | null)[][],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>
) => {
  const reversedPath: [number, number][] = [];

  let currentRow = endRow;
  let currentCol = endCol;

  while (currentRow !== null && currentCol !== null) {
    reversedPath.push([currentRow, currentCol]);

    const nxt = predecessors[currentRow][currentCol];
    if (nxt) {
      currentRow = nxt[0];
      currentCol = nxt[1];
    } else {
      break;
    }
  }

  for (const [row, col] of reversedPath.reverse().slice(1, -1)) {
    setGridWithValue(row, col, 'path', setGrid);
    await delay(1);
  }
};

export const bfs = async (
  grid: CellType[][],
  start: [number, number],
  end: [number, number],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>
): Promise<boolean> => {
  const rows = grid.length;
  const cols = grid[0].length;

  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );

  const predecessors: ([number, number] | null)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );

  const localGrid = copyAndResetVisitedCellsInGrid(grid);

  const queue: [number, number][] = [start];
  visited[start[0]][start[1]] = true;

  while (queue.length > 0) {
    const [row, col] = queue.shift()!;

    if (row === end[0] && col === end[1]) {
      await tracePath(row, col, predecessors, setGrid);
      return true;
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
        visited[newRow][newCol] = true;
        predecessors[newRow][newCol] = [row, col];
        queue.push([newRow, newCol]);

        if (newRow !== end[0] || newCol !== end[1]) {
          localGrid[newRow][newCol] = 'visited';
        }

        setGrid(localGrid.map((row) => [...row]));
        await delay(1);
      }
    }
  }

  return false;
};
