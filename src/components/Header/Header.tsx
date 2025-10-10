import { Button, Flex, Text } from '@mantine/core';
import { AlgorithmSelector, useSelectedAlgorithm } from '../AlgorithmSelector/AlgorithmSelector';

interface GridProps {
  clearGrid: () => void;
  runAlgorithm: () => void;
}

export const Header = ({ clearGrid, runAlgorithm }: GridProps) => {
  const { selectedAlgorithm, setSelectedAlgorithm } = useSelectedAlgorithm();
  const gradientStyle = { from: 'pink', to: 'indigo', deg: 90 };
  return (
    <Flex gap={12} pb={20} pt={20} pl={20} align={'center'} bg={'#3d0d3dff'} mb={20}>
      <Text size="xl" fw={700}>
        Pathfinding Visualizer
      </Text>
      <Text fw={500} c={'dimmed'} size={'xl'}>
        | Choose your algorithm
      </Text>
      <AlgorithmSelector
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
      />
      <Button onClick={clearGrid} variant={'gradient'} gradient={gradientStyle}>
        Clear Grid
      </Button>
      <Button onClick={runAlgorithm} variant={'gradient'} gradient={gradientStyle}>
        Visualize {selectedAlgorithm.toUpperCase()}
      </Button>
    </Flex>
  );
};
