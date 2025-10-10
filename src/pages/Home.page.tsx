import { useRef, useState } from 'react';
import {
  AlgorithmSelector,
  SelectedAlgorithmContext,
} from '@/components/AlgorithmSelector/AlgorithmSelector';
import { Grid, GridHandle } from '@/components/Grid/Grid';
import { Header } from '@/components/Header/Header';

export const HomePage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bfs');
  const gridRef = useRef<GridHandle>(null);
  const rows = 20;
  const cols = 40;

  return (
    <>
      <SelectedAlgorithmContext.Provider
        value={{ selectedAlgorithm: selectedAlgorithm, setSelectedAlgorithm: setSelectedAlgorithm }}
      >
        <Header
          clearGrid={() => gridRef.current?.clearGrid()}
          runAlgorithm={() => gridRef.current?.runAlgorithm()}
        />
        <Grid ref={gridRef} rows={rows} cols={cols} />
      </SelectedAlgorithmContext.Provider>
    </>
  );
};
