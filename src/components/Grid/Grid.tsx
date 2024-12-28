import { useState } from 'react';
import { Box, Button } from '@mantine/core';
import { Cell, CellType } from '../Cell/Cell';
import { initializeGrid } from './Grid.helper';
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
      setDragging(currentCell); // Début du déplacement
    } else {
      setIsMouseDown(true); // Début du dessin de mur
      setGrid((prevGrid) =>
        prevGrid.map((rowArray, rowIndex) =>
          rowArray.map((cell, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return 'obstacle';
            }
            return cell;
          })
        )
      );
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (dragging) {
      // Déplacement du point start/end
      setGrid((prevGrid) =>
        prevGrid.map((rowArray, rowIndex) =>
          rowArray.map((cell, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return dragging; // Place le point start/end ici
            }
            if (cell === dragging) {
              return 'empty'; // Libère l'ancienne position
            }
            return cell;
          })
        )
      );
    } else if (isMouseDown) {
      // Création de murs
      setGrid((prevGrid) =>
        prevGrid.map((rowArray, rowIndex) =>
          rowArray.map((cell, colIndex) => {
            if (rowIndex === row && colIndex === col && cell === 'empty') {
              return 'obstacle';
            }
            return cell;
          })
        )
      );
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
      <Box
        className={classes.grid}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Reset isMouseDown if the mouse leaves the grid
      >
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
