import { createContext, useContext } from 'react';
import { Select } from '@mantine/core';

type Ctx = {
  selectedAlgorithm: string;
  setSelectedAlgorithm: (a: string) => void;
};

export const SelectedAlgorithmContext = createContext<Ctx | null>(null);

export const useSelectedAlgorithm = () => {
  const ctx = useContext(SelectedAlgorithmContext);
  if (!ctx) {throw new Error('useSelectedAlgorithm must be used within provider');}
  return ctx;
};

interface AlgorithmSelectorProps {
  selectedAlgorithm: string;
  setSelectedAlgorithm: (algorithm: string) => void;
}

export const AlgorithmSelector = (props: AlgorithmSelectorProps) => {
  const { selectedAlgorithm, setSelectedAlgorithm } = props;

  const algorithmOptions = [
    { value: 'bfs', label: 'Breadth-First Search (BFS)' },
    { value: 'dfs', label: 'Depth-First Search (DFS)' },
    { value: 'dijkstra', label: "Dijkstra's Algorithm" },
    { value: 'astar', label: 'A* Algorithm' },
  ];

  return (
    <Select
      label="Choose your algorithm"
      data={algorithmOptions}
      value={selectedAlgorithm}
      onChange={(value) => setSelectedAlgorithm(value || '')}
      allowDeselect={false}
    />
  );
};
