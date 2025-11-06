import '@mantine/core/styles.css';

import { ColorSchemeScript, localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';

const colorSchemeManager = localStorageColorSchemeManager({ key: 'mantine-color-scheme' });

export const App = () => {
  return (
    <MantineProvider theme={theme} colorSchemeManager={colorSchemeManager}>
      <ColorSchemeScript defaultColorScheme="dark" />
      <Router />
    </MantineProvider>
  );
};
