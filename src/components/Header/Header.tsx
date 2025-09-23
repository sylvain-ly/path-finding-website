import { Box } from '@mantine/core';
import classes from './Header.module.css';

export const Header = () => {
  return (
    <Box pb={120}>
      <header className={classes.header}>
        {' '}
        Bienvenue sur ce modeste site de path finding visualizer encore en cours de finission. Pour
        faire simple vous pouvez déplacer les points vert et rouge en les glissant et ajouter des
        obstacles sur la grille, choissez un algorithmes et visualizer !
      </header>
    </Box>
  );
};
