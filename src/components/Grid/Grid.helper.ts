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
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

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

  const dfsRec = async (row: number, col: number) => {
    if (row === end[0] && col === end[1]) return true;

    visited[row][col] = true;
    setGridWithValue(row, col, 'visited', setGrid);
    await new Promise((resolve) => setTimeout(resolve, 50));

    for (const [dirRow, dirCol] of directions) {
      const newRow = row + dirRow;
      const newCol = col + dirCol;
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        (grid[newRow][newCol] === 'empty' || grid[newRow][newCol] === 'end')
      ) {
        if (await dfsRec(newRow, newCol)) {
          return true;
        }
      }
    }
    return false;
  };

  return dfsRec(start[0], start[1]);
};
