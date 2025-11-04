import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Box } from '@mantine/core';
import { astar, bfs, dfs, djikstras } from '../Algorithms';
import { useSelectedAlgorithm } from '../AlgorithmSelector/AlgorithmSelector';
import { Cell, CellType } from '../Cell/Cell';
import { generateMazeSkewHorizontal, generateMazeSkewVertical } from '../MazeAlgorithms';
import { findCell, initializeGrid, setGridWithValue } from './Grid.helper';
import classes from './Grid.module.css';

interface GridProps {
  rows: number;
  cols: number;
  speed: string;
  mazePattern: string | null;
}

export type GridHandle = {
  clearGrid: () => void;
  runAlgorithm: () => void | Promise<void>;
};

export const Grid = forwardRef<GridHandle, GridProps>((props: GridProps, ref) => {
  const { selectedAlgorithm } = useSelectedAlgorithm();
  const { rows, cols, speed, mazePattern } = props;
  const [grid, setGrid] = useState<CellType[][]>(initializeGrid(rows, cols));
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setGrid(initializeGrid(rows, cols));
  }, [rows, cols]);

  useEffect(() => {
    if (!mazePattern) {
      return;
    }

    (async () => {
      try {
        setIsBusy(true);

        if (mazePattern === 'recursive division vertical skew') {
          await generateMazeSkewVertical(
            grid,
            findCell(grid, 'start')!,
            findCell(grid, 'end')!,
            setGrid,
            0.75
          );
        } else if (mazePattern === 'recursive division horizontal skew') {
          await generateMazeSkewHorizontal(
            grid,
            findCell(grid, 'start')!,
            findCell(grid, 'end')!,
            setGrid,
            0.75
          );
        }
      } finally {
        setIsBusy(false);
      }
    })();
  }, [mazePattern]);

  const handleMouseDown = (row: number, col: number) => {
    if (isBusy) {
      return;
    }
    const currentCell = grid[row][col];
    if (currentCell === 'start' || currentCell === 'end') {
      setDragging(currentCell);
    } else {
      setIsMouseDown(true);
      setGridWithValue(row, col, 'obstacle', setGrid);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isBusy) {
      return;
    }
    if (dragging) {
      setGrid((prevGrid) =>
        prevGrid.map((rowArray, rowIndex) =>
          rowArray.map((cell, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              if (cell === 'start' || cell === 'end') {
                return cell;
              }
              return dragging;
            }
            if (cell === dragging) {
              return 'empty';
            }
            return cell;
          })
        )
      );
    } else if (isMouseDown) {
      const currentCell = grid[row][col];
      if (currentCell !== 'start' && currentCell !== 'end') {
        setGridWithValue(row, col, 'obstacle', setGrid);
      }
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragging(null);
  };

  const clearGrid = useCallback(() => {
    if (isBusy) {
      return;
    }
    setGrid(initializeGrid(rows, cols));
  }, [rows, cols]);

  const runAlgorithm = useCallback(() => {
    if (isBusy) {
      return;
    }
    const start = findCell(grid, 'start');
    const end = findCell(grid, 'end');
    const speedNumber = parseInt(speed, 10);

    if (!start || !end) {
      return;
    }
    try {
      setIsBusy(true);
      if (selectedAlgorithm === 'bfs') {
        bfs(grid, start, end, setGrid, speedNumber);
      } else if (selectedAlgorithm === 'dfs') {
        dfs(grid, start, end, setGrid, speedNumber);
      } else if (selectedAlgorithm === 'dijkstra') {
        djikstras(grid, start, end, setGrid, speedNumber);
      } else if (selectedAlgorithm === 'astar') {
        astar(grid, start, end, setGrid, speedNumber);
      }
    } finally {
      setIsBusy(false);
    }
  }, [grid, selectedAlgorithm, speed, isBusy]);

  useImperativeHandle(ref, () => ({ clearGrid, runAlgorithm }), [clearGrid, runAlgorithm]);

  return (
    <div>
      <Box className={classes.grid} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {grid.map((rowArray, rowIndex) => (
          <div key={`row-${rowIndex}`} className={classes.gridRow}>
            {rowArray.map((cellType, colIndex) => (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                type={cellType}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
              />
            ))}
          </div>
        ))}
      </Box>
    </div>
  );
});
