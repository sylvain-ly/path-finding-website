import { createContext, useState } from 'react';
import {
  AlgorithmSelector,
  SelectedAlgorithmContext,
} from '@/components/AlgorithmSelector/AlgorithmSelector';
import { Cell } from '@/components/Cell/Cell';
import { Grid } from '@/components/Grid/Grid';
import { Header } from '@/components/Header/Header';

export const HomePage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bfs');
  const rows = 20;
  const cols = 40;

  return (
    <>
      <Header />
      <AlgorithmSelector
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
      />
      <SelectedAlgorithmContext.Provider value={selectedAlgorithm}>
        <Grid rows={rows} cols={cols} />
      </SelectedAlgorithmContext.Provider>
    </>
  );
};
