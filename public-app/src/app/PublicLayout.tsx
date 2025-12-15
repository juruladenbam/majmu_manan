import { Box, Container, Flex, Heading, Button } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';
import { SettingsModal } from '@/features/settings/components/SettingsModal';
import { FaCog } from 'react-icons/fa';
import { useState } from 'react';

export const PublicLayout = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Header */}
      <Box bg="green.600" color="white" py={4} shadow="md" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.md">
          <Flex justify="space-between" align="center">
            <Link to="/">
              <Heading size="lg" fontFamily="serif">Majmu' Manan</Heading>
            </Link>
            <Button variant="ghost" onClick={() => setIsSettingsOpen(true)}>
              <FaCog /> Pengaturan
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.md" py={6}>
        <Outlet />
      </Container>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </Box>
  );
};

