import { Box } from '@mantine/core';
import classes from './Cell.module.css';

export type CellType = 'empty' | 'start' | 'end' | 'obstacle';

interface CellProps {
  row: number;
  col: number;
  type: CellType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
}

export const Cell = (props: CellProps) => {
  const { row, col, type, onMouseDown, onMouseEnter } = props;

  const getClassName = () => {
    switch (type) {
      case 'start':
        return `${classes.cell} ${classes.start}`;
      case 'end':
        return `${classes.cell} ${classes.end}`;
      case 'obstacle':
        return `${classes.cell} ${classes.obstacle}`;
      default:
        return `${classes.cell} ${classes.empty}`;
    }
  };

  return (
    <Box
      size={'xs'}
      className={getClassName()}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      data-row={row}
      data-col={col}
    />
  );
};
