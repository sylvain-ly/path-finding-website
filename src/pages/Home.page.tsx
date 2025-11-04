import { useRef, useState } from 'react';
import { Group } from '@mantine/core';
import { SelectedAlgorithmContext } from '@/components/AlgorithmSelector/AlgorithmSelector';
import { Grid, GridHandle } from '@/components/Grid/Grid';
import { Header } from '@/components/Header/Header';
import { useDynamicGrid } from '@/hooks/useDynamicGrid';

export const HomePage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bfs');
  const [speed, setSpeed] = useState<string>('1');
  const [mazePattern, setMazePattern] = useState<string>('');
  const gridRef = useRef<GridHandle>(null);
  const { gridSize, ml, mb } = useDynamicGrid(100);
  const { rows, cols } = gridSize;

  return (
    <>
      <SelectedAlgorithmContext.Provider value={{ selectedAlgorithm, setSelectedAlgorithm }}>
        <Header
          clearGrid={() => gridRef.current?.clearGrid()}
          runAlgorithm={() => gridRef.current?.runAlgorithm()}
          speed={speed}
          setSpeed={setSpeed}
          setMazePattern={setMazePattern}
        />
        <Group mx={ml} mb={100}>
          <Grid ref={gridRef} rows={rows} cols={cols} speed={speed} mazePattern={mazePattern} />
        </Group>
      </SelectedAlgorithmContext.Provider>
    </>
  );
};
