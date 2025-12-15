import { useParams, Link } from 'react-router-dom';
import { useBacaanDetail } from '@/features/reader/hooks';
import { Box, Button, Center, Heading, Spinner, Stack, Text, VStack } from '@chakra-ui/react';

export const ReaderMenuPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: bacaan, isLoading } = useBacaanDetail(slug!);

  if (isLoading) return <Center h="50vh"><Spinner /></Center>;
  if (!bacaan) return <Text>Bacaan tidak ditemukan.</Text>;

  return (
    <Stack gap={6}>
      <Link to="/">
        <Button variant="ghost" size="sm" colorPalette="green">← Kembali ke Menu</Button>
      </Link>

      <Box textAlign="center" py={4}>
        <Heading size="2xl" fontFamily="Scheherazade New, serif" mb={2}>{bacaan.judul_arab}</Heading>
        <Heading size="lg" color="green.700">{bacaan.judul}</Heading>
      </Box>

      <VStack align="stretch" gap={3}>
        {bacaan.sections?.map((section, index) => (
          <Link key={section.id} to={`/bacaan/${slug}/${section.slug_section}`}>
            <Box 
              p={4} 
              bg="white" 
              rounded="md" 
              shadow="sm" 
              borderLeftWidth="4px" 
              borderLeftColor="green.500"
              _hover={{ bg: 'green.50' }}
            >
              <Text fontWeight="bold">{index + 1}. {section.judul_section}</Text>
            </Box>
          </Link>
        ))}
        {bacaan.sections?.length === 0 && (
          <Text textAlign="center" color="gray.500">Langsung baca konten (Single Page Mode - Coming Soon)</Text>
        )}
      </VStack>
    </Stack>
  );
};
