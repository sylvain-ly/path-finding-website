import { useState } from 'react';
import { AlgorithmSelector } from '@/components/AlgorithmSelector/AlgorithmSelector';
import { Cell } from '@/components/Cell/Cell';
import { Grid } from '@/components/Grid/Grid';
import { Header } from '@/components/Header/Header';

export const HomePage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bfs');
  const rows = 30;
  const cols = 60;

  return (
    <>
      <Header />
      <AlgorithmSelector
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
      />
      <Grid rows={rows} cols={cols} />
    </>
  );
};
