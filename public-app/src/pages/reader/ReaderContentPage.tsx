import { useParams, useNavigate } from 'react-router-dom';
import { useSectionDetail, useBacaanDetail } from '@/features/reader/hooks';
import { ReadingItem } from '@/features/reader/components/ReadingItem';
import { Box, Button, Center, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { BookmarkButton } from '@/features/bookmarks/components/BookmarkButton';
import { useEffect } from 'react';

export const ReaderContentPage = () => {
  const { slug, sectionSlug } = useParams<{ slug: string; sectionSlug: string }>();
  const navigate = useNavigate();

  // Scroll to top whenever sectionSlug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sectionSlug]);

  // Fetch Bacaan to know prev/next sections
  const { data: bacaan } = useBacaanDetail(slug!);
  const { data: section, isLoading } = useSectionDetail(slug!, sectionSlug!);

  // Calculate Navigation
  const currentIndex = bacaan?.sections?.findIndex(s => s.slug_section === sectionSlug) ?? -1;
  const prevSection = currentIndex > 0 ? bacaan?.sections?.[currentIndex - 1] : null;
  const nextSection = currentIndex < (bacaan?.sections?.length ?? 0) - 1 ? bacaan?.sections?.[currentIndex + 1] : null;

  const handleNext = () => {
    if (nextSection) navigate(`/bacaan/${slug}/${nextSection.slug_section}`);
  };

  const handlePrev = () => {
    if (prevSection) navigate(`/bacaan/${slug}/${prevSection.slug_section}`);
  };

  const handlers = useSwipeable({
    onSwipedRight: () => handleNext(), // Swipe Right (Left->Right) -> Go to NEXT
    onSwipedLeft: () => handlePrev(),  // Swipe Left (Right->Left) -> Go to PREV
    preventScrollOnSwipe: true,
    trackMouse: true, 
  });

  if (isLoading) return <Center h="50vh"><Spinner /></Center>;
  if (!section) return <Text>Section not found.</Text>;

  return (
    <Stack gap={0} minH="80vh">
      {/* Sticky Navigation Header */}
      <Box 
        position="sticky" 
        top="72px" 
        zIndex={9} 
        bg="gray.50" 
        py={2}
        borderBottom="1px solid"
        borderColor="gray.200"
        mb={6}
      >
        <Flex justify="space-between" align="center">
          {/* RTL: Right side is Start/Previous, Left side is End/Next */}
          
          {/* Right Arrow (Previous) */}
          <Button 
            size="sm" 
            variant="ghost" 
            disabled={!nextSection} 
            onClick={handleNext} 
            colorScheme="green"
            width="auto"
          >
            ←
          </Button>

          <Heading 
            size="sm" 
            color="gray.500" 
            flex="1" 
            textAlign="center" 
            mx={2} 
            whiteSpace="nowrap" 
            overflow="hidden" 
            textOverflow="ellipsis"
          >
            {section.judul_section}
          </Heading>

          {/* Left Arrow (Next) */}
          <Button 
            size="sm" 
            variant="ghost" 
            disabled={!prevSection} 
            onClick={handlePrev}
            colorScheme="green"
            width="auto"
          >
            →
          </Button>
        </Flex>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          // Animation for RTL: 
          // Next enters from Left (x: -20) because we are moving Leftwards into the content?
          // Let's standardise: Fade in with slight slide.
          initial={{ opacity: 0, x: 0 }} 
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          {...handlers}
        >
          <Box bg="white" p={6} rounded="lg" shadow="sm">
            {bacaan && <BookmarkButton bacaan={bacaan} />} {/* Add BookmarkButton */}
            {section.items?.map((item) => (
              <ReadingItem key={item.id} item={item} />
            ))}
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <Flex justify="center" mt={8} gap={4}>
         <Button onClick={() => navigate(`/bacaan/${slug}`)} variant="outline">
           Kembali ke Daftar Isi
         </Button>
      </Flex>
    </Stack>
  );
};
