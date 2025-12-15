import { Box, Button, HStack, Text } from '@chakra-ui/react';
import type { Section } from '@project/shared';
import { ItemEditorList } from '@/features/item/components/ItemEditorList';
import { useState } from 'react';

interface SectionListItemProps {
  section: Section;
  bacaanId: number;
  onDelete: (id: number) => void;
}

export const SectionListItem = ({ section, bacaanId, onDelete }: SectionListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box bg="white" borderWidth="1px" rounded="md" overflow="hidden">
      <Box p="4" bg="white">
        <HStack justify="space-between">
          <Text fontWeight="bold">{section.judul_section}</Text>
          <HStack>
            <Button 
              size="sm" 
              variant="outline"
              colorPalette="blue"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Tutup' : 'Kelola Isi'}
            </Button>
            <Button 
              size="sm" 
              colorPalette="red" 
              variant="ghost" 
              onClick={() => {
                if(confirm('Hapus section ini?')) onDelete(section.id);
              }}
            >
              Hapus
            </Button>
          </HStack>
        </HStack>
      </Box>
      
      {isOpen && (
        <Box p="4" bg="gray.50" borderTopWidth="1px">
           <ItemEditorList 
              bacaanId={bacaanId} 
              sectionId={section.id} 
              items={section.items || []} 
           />
        </Box>
      )}
    </Box>
  );
};
