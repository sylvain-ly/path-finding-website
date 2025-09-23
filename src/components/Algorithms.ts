import { CellType } from './Cell/Cell';
import { copyAndResetVisitedCellsInGrid, setGridWithValue } from './Grid/Grid.helper';

const directions = [
  [0, 1], // droite
  [-1, 0], //
  [1, 0],
  [0, -1],
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isValidCell = (
  row: number,
  col: number,
  grid: CellType[][],
  visited: boolean[][]
): boolean => {
  const rows = grid.length;
  const cols = grid[0].length;
  return (
    row >= 0 &&
    row < rows &&
    col >= 0 &&
    col < cols &&
    !visited[row][col] &&
    (grid[row][col] === 'empty' || grid[row][col] === 'end')
  );
};

const initializePredecessorsArray = (rows: number, cols: number): ([number, number] | null)[][] => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
};

const initializeVisitedArray = (rows: number, cols: number): boolean[][] => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
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

/*------------------------------------------- DFS --------------------------------------------- */
export const dfs = async (
  grid: CellType[][],
  start: [number, number],
  end: [number, number],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>
): Promise<boolean> => {
  const rows = grid.length;
  const cols = grid[0].length;
  const localGrid = copyAndResetVisitedCellsInGrid(grid);
  const visited: boolean[][] = initializeVisitedArray(rows, cols);

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

      if (isValidCell(newRow, newCol, localGrid, visited)) {
        predecessors[newRow][newCol] = [row, col];
        if (await dfsRec(newRow, newCol, predecessors)) {
          return true;
        }
      }
    }

    return false;
  };

  const predecessors = initializePredecessorsArray(rows, cols);
  const isPathFound = await dfsRec(start[0], start[1], predecessors);

  if (isPathFound) {
    let currentRow = end[0];
    let currentCol = end[1];
    await tracePath(currentRow, currentCol, predecessors, setGrid);
  }
  return false;
};
/*------------------------------------------- BFS --------------------------------------------- */

export const bfs = async (
  grid: CellType[][],
  start: [number, number],
  end: [number, number],
  setGrid: React.Dispatch<React.SetStateAction<CellType[][]>>
): Promise<boolean> => {
  const rows = grid.length;
  const cols = grid[0].length;

  const visited = initializeVisitedArray(rows, cols);
  const predecessors = initializePredecessorsArray(rows, cols);

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

      if (isValidCell(newRow, newCol, grid, visited)) {
        visited[newRow][newCol] = true;
        predecessors[newRow][newCol] = [row, col];
        queue.push([newRow, newCol]);

        if (newRow !== end[0] || newCol !== end[1]) {
          grid[newRow][newCol] = 'visited';
        }

        setGrid(grid.map((row) => [...row])); // crée une nouvelle référence des tableaux de cellules pour chaque rows donc c'est carré
        await delay(1);
      }
    }
  }

  return false;
};
