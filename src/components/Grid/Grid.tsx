import { useState } from 'react';
import { Box } from '@mantine/core';
import { Cell, CellType } from '../Cell/Cell';

interface GridProps {
  rows: number;
  cols: number;
}

export const Grid = (props: GridProps) => {
  const { rows, cols } = props;
  const [grid, setGrid] = useState<CellType[][]>(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'empty'))
  );

  const handleCellClick = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((rowArray, rowIndex) =>
        rowArray.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return cell === 'obstacle' ? 'empty' : 'obstacle';
          }
          return cell;
        })
      );
      return newGrid;
    });
  };

  return (
    <Box className="grid">
      {grid.map((rowArray, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {rowArray.map((cellType, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              type={cellType}
              onClick={handleCellClick}
            />
          ))}
        </div>
      ))}
    </Box>
  );
};
