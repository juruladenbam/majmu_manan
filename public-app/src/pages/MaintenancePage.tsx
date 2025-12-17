import { Box, Container, Heading, Text, Icon, VStack } from '@chakra-ui/react';
import { FaTools } from 'react-icons/fa';

interface MaintenancePageProps {
    message?: string | null;
}

export const MaintenancePage = ({ message }: MaintenancePageProps) => {
    return (
        <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
            <Container maxW="container.md" centerContent>
                <VStack gap={6} textAlign="center" bg="white" p={10} borderRadius="xl" shadow="lg" width="full">
                    <Icon as={FaTools} w={20} h={20} color="green.500" />

                    <Heading size="xl" color="gray.800">
                        Sedang Dalam Pemeliharaan
                    </Heading>

                    <Text fontSize="lg" color="gray.600">
                        {message || 'Mohon maaf, aplikasi sedang dalam perbaikan. Silakan kembali lagi nanti.'}
                    </Text>
                </VStack>
            </Container>
        </Box>
    );
};
