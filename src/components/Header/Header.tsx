import classes from './Header.module.scss';
import { Box } from '@mantine/core';

export const Header = () => {
  return (
    <Box pb={120}>
      <header className={classes.header}></header>
    </Box>
  );
};
