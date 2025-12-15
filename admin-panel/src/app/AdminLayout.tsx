import { Box, Flex, Heading, Link as ChakraLink, Stack, Button } from '@chakra-ui/react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useLogout } from '@/features/auth/hooks';

export const AdminLayout = () => {
  const { mutate: logout } = useLogout();
  const location = useLocation();

  const NavItem = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <ChakraLink asChild fontWeight={isActive ? 'bold' : 'normal'} color={isActive ? 'blue.600' : 'gray.600'}>
        <Link to={to}>{label}</Link>
      </ChakraLink>
    );
  };

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box w="250px" bg="gray.100" p={5} borderRight="1px solid" borderColor="gray.200">
        <Stack gap="6">
          <Heading size="md">Admin Panel</Heading>
          
          <Stack gap="2">
            <NavItem to="/dashboard" label="Dashboard" />
            <NavItem to="/bacaan" label="Daftar Bacaan" />
          </Stack>

          <Button size="sm" variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box flex="1" p={8} bg="white">
        <Outlet />
      </Box>
    </Flex>
  );
};
