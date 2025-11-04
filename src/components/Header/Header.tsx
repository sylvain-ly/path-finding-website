import { Button, Flex, Select, Text, Title } from '@mantine/core';
import { AlgorithmSelector, useSelectedAlgorithm } from '../AlgorithmSelector/AlgorithmSelector';

interface GridProps {
  clearGrid: () => void;
  runAlgorithm: () => void;
  speed: string;
  setSpeed: (s: string) => void;
  setMazePattern: (s: string) => void;
}

export const Header = ({ clearGrid, runAlgorithm, speed, setSpeed, setMazePattern }: GridProps) => {
  const { selectedAlgorithm, setSelectedAlgorithm } = useSelectedAlgorithm();
  const gradientStyle = { from: 'pink', to: 'indigo', deg: 90 };

  const speedOptions = [
    { value: '1', label: 'Normal' },
    { value: '2', label: 'Fast' },
    { value: '4', label: 'Very-fast' },
  ];

  const MazePatternOptions = [
    { value: 'recursive division vertical skew', label: 'Recursive division (vertical skew)' },
    { value: 'recursive division horizontal skew', label: 'Recursive division (horizontal skew)' },
  ];

  return (
    <Flex
      align="center"
      bg="#3d0d3dff"
      mb={20}
      pb={20}
      pt={20}
      pl={20}
      gap={12}
      justify="center"
      wrap="wrap"
    >
      <Title order={1}>Pathfinding Visualizer</Title>
      <Flex gap={12} align="flex-end">
        <AlgorithmSelector
          selectedAlgorithm={selectedAlgorithm}
          setSelectedAlgorithm={setSelectedAlgorithm}
        />
        <Select
          label="Speed"
          data={speedOptions}
          value={speed}
          onChange={(value) => setSpeed(value ?? '1')}
          allowDeselect={false}
        />
        <Select
          label="Create walls"
          data={MazePatternOptions}
          placeholder="Pick an algorithm"
          onChange={(value) => setMazePattern(value ?? 'empty')}
          searchable
        />
        <Button onClick={clearGrid} variant="gradient" gradient={gradientStyle}>
          Clear Grid
        </Button>
        <Button onClick={runAlgorithm} variant="gradient" gradient={gradientStyle}>
          Visualize {selectedAlgorithm.toUpperCase()}
        </Button>
      </Flex>
    </Flex>
  );
};
