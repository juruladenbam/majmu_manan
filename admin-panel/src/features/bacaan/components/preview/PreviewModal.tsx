import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import type { Bacaan } from '@project/shared';

// Since I haven't scaffolded the 'components/ui/dialog' as per Chakra v3 recommendations (shadcn-like),
// I will use the raw imports if available, OR simpler: use a fixed overlay box for now if v3 primitives are complex to setup without running the snippets.
// Actually, Chakra v3 uses 'Dialog' exports from root if using the new system correctly.
// Let's try importing DialogRoot etc from @chakra-ui/react directly if they exist, or fallback to a custom implementation if specific components are missing.

// Re-checking Chakra v3 docs from memory: it exports Dialog as a compound component usually or separate parts.
// Let's use a custom full-screen overlay for simplicity and robustness in this environment.

export const PreviewModal = ({ bacaan, isOpen, onClose }: { bacaan: Bacaan; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <Box position="fixed" top="0" left="0" w="100vw" h="100vh" zIndex="modal" bg="blackAlpha.600">
      <Box 
        position="absolute" 
        top="5%" 
        left="50%" 
        transform="translateX(-50%)" 
        w="90%" 
        maxW="container.md" 
        h="90%" 
        bg="white" 
        rounded="lg" 
        overflow="hidden" 
        display="flex" 
        flexDirection="column"
      >
        <Box p="4" borderBottomWidth="1px" display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="sm">Preview Tampilan Public App</Heading>
          <Button size="sm" onClick={onClose} variant="ghost">Tutup</Button>
        </Box>
        
        <Box flex="1" overflowY="auto" bg="gray.50">
           {/* Mock Mobile View */}
           <Box maxW="sm" mx="auto" minH="100%" bg="white" shadow="sm">
              <Box bg="green.600" color="white" py={4} px={4}>
                <Heading size="md" fontFamily="serif">Majmu' Manan</Heading>
              </Box>

              <Box p={4}>
                <VStack gap={6}>
                  <Box textAlign="center" py={4}>
                                      <Heading size="2xl" fontFamily="Scheherazade New, serif" mb={2} color="black">{bacaan.judul_arab}</Heading>
                                      <Heading size="lg" color="green.700">{bacaan.judul}</Heading>
                                    </Box>
                  {bacaan.sections?.map((section) => (
                    <Box key={section.id} w="full">
                      <Box 
                        p={3} 
                        bg="gray.100" 
                        borderLeftWidth="4px" 
                        borderLeftColor="green.500"
                        mb={4}
                      >
                        <Text fontWeight="bold">{section.judul_section}</Text>
                      </Box>
                      
                      <VStack gap={4} align="stretch" px={2}>
                        {section.items?.map((item) => (
                          <Box key={item.id} py={4} borderBottomWidth="1px" borderColor="gray.100">
                            <Box 
                              fontSize="2xl" 
                              textAlign="right" 
                              fontFamily="serif" 
                              lineHeight="2"
                              dangerouslySetInnerHTML={{ __html: item.arabic || '' }}
                            />
                            {item.latin && (
                              <Text fontSize="md" color="green.600" fontStyle="italic" mt={2}>
                                {item.latin}
                              </Text>
                            )}
                            {item.terjemahan && (
                              <Text fontSize="md" color="gray.600" mt={1}>
                                {item.terjemahan}
                              </Text>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
           </Box>
        </Box>
      </Box>
    </Box>
  );
};
