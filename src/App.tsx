import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';

export const App = () => {
  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  );
};
