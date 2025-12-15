import React, { useState } from 'react';
import { Box, Button, Input, Stack, Heading, Text } from '@chakra-ui/react';
import { useLogin } from '@/features/auth/hooks';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: () => {
        navigate('/');
      }
    });
  };

  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Box p={8} bg="white" rounded="md" shadow="md" width="100%" maxWidth="400px">
        <Stack gap="4">
          <Heading textAlign="center" size="xl">Majmu Admin</Heading>
          
          {error && <Text color="red.500">{(error as any).response?.data?.message || 'Login failed'}</Text>}

          <form onSubmit={handleSubmit}>
            <Stack gap="4">
              <Box>
                <Text mb="2">Email</Text>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@majmu-manan.com"
                />
              </Box>
              <Box>
                <Text mb="2">Password</Text>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </Box>
              <Button type="submit" loading={isPending} width="100%" colorPalette="blue">
                Login
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Box>
  );
};
