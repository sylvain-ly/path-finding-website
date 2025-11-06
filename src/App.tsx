import '@mantine/core/styles.css';

import { ColorSchemeScript, localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import { Router } from './Router';

const colorSchemeManager = localStorageColorSchemeManager({ key: 'mantine-color-scheme' });

export const App = () => {
  return (
    <MantineProvider defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
      <ColorSchemeScript defaultColorScheme="dark" />
      <Router />
    </MantineProvider>
  );
};
