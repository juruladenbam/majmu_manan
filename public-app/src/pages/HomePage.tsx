import { SimpleGrid, Spinner, Center, Text, Input, Box, Heading, Stack } from '@chakra-ui/react';
import { useBacaanList } from '@/features/reader/hooks';
import { BacaanCard } from '@/features/reader/components/BacaanCard';
import { useState, useMemo } from 'react';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { data: bacaans, isLoading } = useBacaanList();
  const [searchTerm, setSearchTerm] = useState('');
  const { bookmarks } = useBookmarks();

  const filteredBacaans = useMemo(() => {
    if (!bacaans) return [];
    return bacaans.filter(bacaan =>
      bacaan.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bacaan.judul_arab?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bacaans, searchTerm]);

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="green.500" />
      </Center>
    );
  }

  return (
    <Box>
      {bookmarks.length > 0 && (
        <Stack mb={8}>
          <Heading size="md" mb={3}>Bookmarks Anda</Heading>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
            {bookmarks.map(b => (
              <Link to={`/bacaan/${b.slug}`} key={b.slug}>
                <Box p={3} borderWidth="1px" borderRadius="md" _hover={{ bg: 'gray.50' }}>
                  <Text fontWeight="bold">{b.judul}</Text>
                  <Text fontSize="sm" color="gray.500">Disimpan: {new Date(b.bookmarkedAt).toLocaleDateString()}</Text>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Stack>
      )}

      <Heading size="lg" mb={4}>Daftar Bacaan</Heading>
      <Input
        placeholder="Cari bacaan..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={6}
        size="lg"
      />
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
        {filteredBacaans.length > 0 ? (
          filteredBacaans.map((bacaan) => (
            <BacaanCard key={bacaan.id} bacaan={bacaan} />
          ))
        ) : (
          <Text textAlign="center" color="gray.500">
            {searchTerm ? "Tidak ada hasil untuk pencarian ini." : "Tidak ada bacaan tersedia."}
          </Text>
        )}
      </SimpleGrid>
    </Box>
  );
};
