import { useContext, useEffect, useState } from 'react';
import { Box, Button, Flex } from '@mantine/core';
import { SelectedAlgorithmContext } from '../AlgorithmSelector/AlgorithmSelector';
import { Cell, CellType } from '../Cell/Cell';
import { dfs, findCell, initializeGrid, setGridWithValue } from './Grid.helper';
import classes from './Grid.module.css';

interface GridProps {
  rows: number;
  cols: number;
}

export const Grid = (props: GridProps) => {
  const selectedAlgorithm = useContext(SelectedAlgorithmContext);
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

  const clearGrid = () => {
    setGrid(initializeGrid(rows, cols));
  };

  const handleRunAlgorithm = async () => {
    const start = findCell(grid, 'start');
    const end = findCell(grid, 'end');

    if (!start || !end) {
      alert('Start or End point is missing!');
      return;
    }

    if (selectedAlgorithm === 'dfs') {
      dfs(grid, start, end, setGrid);
    }
  };

  return (
    <div>
      <Flex gap={12}>
        <Button onClick={clearGrid} style={{ marginBottom: '10px' }}>
          Clear Grid
        </Button>
        <Button onClick={handleRunAlgorithm} style={{ marginBottom: '10px' }}>
          Visualize
        </Button>
      </Flex>
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
