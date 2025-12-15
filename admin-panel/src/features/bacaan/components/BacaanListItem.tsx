import { Box, Heading, Text, HStack, Button } from '@chakra-ui/react';
import type { Bacaan } from '@project/shared';
import { Link } from 'react-router-dom';

interface BacaanListItemProps {
  bacaan: Bacaan;
  onDelete: (id: number) => void;
}

export const BacaanListItem = ({ bacaan, onDelete }: BacaanListItemProps) => {
  return (
    <Box p="4" borderWidth="1px" borderRadius="lg" bg="white">
      <HStack justify="space-between">
        <Box>
          <Heading size="md">{bacaan.judul}</Heading>
          {bacaan.judul_arab && <Text color="gray.500" fontSize="lg" fontFamily="Scheherazade New, serif">{bacaan.judul_arab}</Text>}
        </Box>
        <HStack>
          <Link to={`/bacaan/${bacaan.id}`}>
            <Button size="sm" variant="outline">Detail</Button>
          </Link>
          <Button 
            size="sm" 
            colorPalette="red" 
            variant="subtle" 
            onClick={() => onDelete(bacaan.id)}
          >
            Hapus
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};
