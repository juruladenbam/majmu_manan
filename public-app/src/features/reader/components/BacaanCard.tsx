import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import type { Bacaan } from '@project/shared';
import { Link } from 'react-router-dom';

export const BacaanCard = ({ bacaan }: { bacaan: Bacaan }) => {
  return (
    <Link to={`/bacaan/${bacaan.slug}`}>
      <Box 
        p={4} 
        borderWidth="1px" 
        borderRadius="lg" 
        bg="white" 
        shadow="sm"
        _hover={{ shadow: 'md', borderColor: 'green.500' }}
        transition="all 0.2s"
      >
        <VStack align="start" gap={1}>
          <Heading size="md" color="green.700">{bacaan.judul}</Heading>
          {bacaan.judul_arab && <Text fontSize="lg" fontFamily="Scheherazade New, serif">{bacaan.judul_arab}</Text>}
        </VStack>
      </Box>
    </Link>
  );
};
