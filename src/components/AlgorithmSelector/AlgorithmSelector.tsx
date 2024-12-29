import { createContext } from 'react';
import { Group, Select } from '@mantine/core';

export const SelectedAlgorithmContext = createContext<string | undefined>(undefined);

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
    <Group>
      <Select
        label="Choose an Algorithm"
        placeholder="Select an algorithm"
        onChange={(value) => setSelectedAlgorithm(value || '')}
        data={algorithmOptions}
      />
    </Group>
  );
};
