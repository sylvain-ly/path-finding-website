import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Box, Button, Flex } from '@mantine/core';
import { astar, bfs, dfs, djikstras } from '../Algorithms';
import { useSelectedAlgorithm } from '../AlgorithmSelector/AlgorithmSelector';
import { Cell, CellType } from '../Cell/Cell';
import { findCell, initializeGrid, setGridWithValue } from './Grid.helper';
import classes from './Grid.module.css';

interface GridProps {
  rows: number;
  cols: number;
}

export type GridHandle = {
  clearGrid: () => void;
  runAlgorithm: () => void | Promise<void>;
};

export const Grid = forwardRef<GridHandle, GridProps>((props: GridProps, ref) => {
  const { selectedAlgorithm, setSelectedAlgorithm } = useSelectedAlgorithm();
  const { rows, cols } = props;
  const [grid, setGrid] = useState<CellType[][]>(initializeGrid(rows, cols));
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);

  const handleMouseDown = (row: number, col: number) => {
    const currentCell = grid[row][col];
    if (currentCell === 'start' || currentCell === 'end') {
      setDragging(currentCell);
    } else {
      setIsMouseDown(true);
      setGridWithValue(row, col, 'obstacle', setGrid);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
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
      if (currentCell !== 'start' && currentCell !== 'end')
        setGridWithValue(row, col, 'obstacle', setGrid);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragging(null);
  };

  const clearGrid = useCallback(() => {
    setGrid(initializeGrid(rows, cols));
  }, [rows, cols]);

  const runAlgorithm = useCallback(() => {
    const start = findCell(grid, 'start');
    const end = findCell(grid, 'end');
    if (!start || !end) {
      alert('Start or End point is missing!');
      return;
    }

    if (selectedAlgorithm === 'dfs') dfs(grid, start, end, setGrid);
    else if (selectedAlgorithm === 'bfs') bfs(grid, start, end, setGrid);
    else if (selectedAlgorithm === 'dijkstra') djikstras(grid, start, end, setGrid);
    else if (selectedAlgorithm === 'astar') astar(grid, start, end, setGrid);
  }, [grid, selectedAlgorithm]);

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
