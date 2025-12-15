import { Box, VStack, Image } from '@chakra-ui/react';
import type { Item }          from '@project/shared';
import { useLocalStorage }    from '@/features/settings/hooks/useLocalStorage';

export const ReadingItem = ({ item }: { item: Item }) => {
  const [fontSize] = useLocalStorage<number>('fontSize', 28);
  const [showTranslation] = useLocalStorage<boolean>('showTranslation', true);

  const renderContent = () => {
    switch (item.tipe_tampilan) {
      case 'judul_tengah':
        return (
          <Box 
            fontSize={`${fontSize * 1.2}px`} 
            textAlign="center" 
            fontWeight="bold"
            fontFamily="'Scheherazade New', serif" 
            color="green.700"
            py={2}
            bg="green.50"
            rounded="md"
            sx={{ "& *": { fontFamily: "'Scheherazade New', serif !important" } }}
            dangerouslySetInnerHTML={{ __html: item.arabic || '' }}
          />
        );

      case 'syiir':
        return (
          <Box 
            fontSize={`${fontSize}px`} 
            textAlign="center" 
            fontFamily="'Scheherazade New', serif" 
            lineHeight="2.5"
            px={8} // Indent for poetry feel
            sx={{ "& *": { fontFamily: "'Scheherazade New', serif !important" } }}
            dangerouslySetInnerHTML={{ __html: item.arabic || '' }}
          />
        );

      case 'keterangan':
        return (
          <Box 
            fontSize={`${fontSize * 0.9}px`} 
            textAlign="center" 
            color="gray.500"
            fontStyle="italic"
            dangerouslySetInnerHTML={{ __html: item.arabic || '' }}
          />
        );

      case 'image':
        return (
          <Box textAlign="center">
             {/* Assuming arabic contains the image URL or filename */}
             <Image src={item.arabic || ''} alt="Gambar Bacaan" maxH="300px" mx="auto" />
          </Box>
        );

      case 'text':
      default:
        return (
          <Box 
            fontSize={`${fontSize}px`} 
            textAlign="right" 
            fontFamily="'Scheherazade New', serif" 
            lineHeight="2"
            sx={{ "& *": { fontFamily: "'Scheherazade New', serif !important" } }}
            dangerouslySetInnerHTML={{ __html: item.arabic || '' }}
          />
        );
    }
  };

  return (
    <Box py={4} borderBottomWidth="1px" borderColor="gray.100">
      <VStack gap={4} align="stretch">
        {/* Main Content (Arabic/Image/Title) */}
        {renderContent()}

        {/* Latin Transliteration (Hidden for image/keterangan usually, but optional) */}
        {item.tipe_tampilan !== 'image' && item.latin && (
          <Box fontSize="md" color="green.600" fontStyle="italic" textAlign={item.tipe_tampilan === 'syiir' ? 'center' : 'left'}>
            {item.latin}
          </Box>
        )}

        {/* Translation */}
        {showTranslation && item.terjemahan && item.tipe_tampilan !== 'image' && ( 
          <Box fontSize="md" color="gray.600" textAlign={item.tipe_tampilan === 'syiir' ? 'center' : 'left'}>
            {item.terjemahan}
          </Box>
        )}
      </VStack>
    </Box>
  );
};
