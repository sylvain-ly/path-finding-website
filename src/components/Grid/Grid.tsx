import { useState } from 'react';
import { Box, Button } from '@mantine/core';
import { Cell, CellType } from '../Cell/Cell';
import { initializeGrid, setGridWithValue } from './Grid.helper';
import classes from './Grid.module.css';

interface GridProps {
  rows: number;
  cols: number;
}

export const Grid = (props: GridProps) => {
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
      setGridWithValue(row, col, 'obstacle', setGrid);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragging(null);
  };

  const clearGrid = () => {
    setGrid(initializeGrid(rows, cols));
  };

  return (
    <div>
      <Button onClick={clearGrid} style={{ marginBottom: '10px' }}>
        Clear Grid
      </Button>
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
};
