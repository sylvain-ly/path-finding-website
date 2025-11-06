import { useState } from 'react';
import { IconHelp } from '@tabler/icons-react';
import { Button, Modal, Stack, Text, Title } from '@mantine/core';

export function InstructionsModal() {
  const [opened, setOpened] = useState(true);

  return (
    <>
      <Button
        variant="subtle"
        color="gray"
        size="md"
        onClick={() => setOpened(true)}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 999,
        }}
        leftSection={<IconHelp size={24} />}
      >
        Help
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        radius="md"
        size="lg"
        padding="xl"
        title={<Title order={3}>👋 Welcome to my Pathfinding Visualizer !</Title>}
      >
        <Stack>
          <Text>Here’s how to use the pathfinding visualizer:</Text>
          <ul style={{ lineHeight: '1.6', marginTop: 12 }}>
            <li>
              <b>Select an algorithm</b> (Dijkstra, A*, BFS…)
            </li>
            <li>
              <b>Choose the animation speed</b>
            </li>
            <li>
              <b>Generate a maze</b> or <b>create your own</b> by clicking anywhere on the grid
            </li>
            <li>
              <b>Drag the start and end points</b> to any position you like
            </li>
            <li>
              <b>Click "Visualize"</b> to run the algorithm
            </li>
            <li>
              <b>Click "Clear"</b> to reset the grid
            </li>
          </ul>
          <Button
            onClick={() => setOpened(false)}
            size="md"
            radius="md"
            variant="filled"
            color="green"
          >
            Got it !
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
