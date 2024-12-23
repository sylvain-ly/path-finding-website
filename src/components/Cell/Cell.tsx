import { Box } from '@mantine/core';

import './Cell.module.css';

export type CellType = 'empty' | 'start' | 'end' | 'obstacle';

interface CellProps {
  row: number;
  col: number;
  type: CellType;
  onClick: (row: number, col: number) => void;
}

export const Cell = (props: CellProps) => {
  const { row, col, type, onClick } = props;

  const getClassName = () => {
    switch (type) {
      case 'start':
        return 'cell start';
      case 'end':
        return 'cell end';
      case 'obstacle':
        return 'cell obstacle';
      default:
        return 'cell empty';
    }
  };

  return (
    <Box
      className={getClassName()}
      onClick={() => onClick(row, col)}
      data-row={row}
      data-col={col}
    />
  );
};
