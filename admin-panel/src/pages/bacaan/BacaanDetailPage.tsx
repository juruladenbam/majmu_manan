import { Box, Button, Heading, Stack, Text, HStack, Spinner } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import { useBacaanDetail, useUpdateBacaan } from '@/features/bacaan/hooks';
import { useCreateSection, useDeleteSection } from '@/features/section/hooks';
import { BacaanMetadataForm } from '@/features/bacaan/components/BacaanMetadataForm';
import { SectionListItem } from '@/features/section/components/SectionListItem';
import { PreviewModal } from '@/features/bacaan/components/preview/PreviewModal';
import { FaEye } from 'react-icons/fa';
import { useState } from 'react';

export const BacaanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const bacaanId = parseInt(id!);
  const { data: bacaan, isLoading } = useBacaanDetail(bacaanId);
  const { mutate: updateBacaan } = useUpdateBacaan();
  const { mutate: createSection } = useCreateSection();
  const { mutate: deleteSection } = useDeleteSection();
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleUpdate = (data: any) => {
    updateBacaan({ id: bacaanId, data });
  };

  const handleAddSection = () => {
    const title = window.prompt("Judul Bagian (Section):");
    if (title) {
      createSection({ bacaan_id: bacaanId, judul_section: title, urutan: (bacaan?.sections?.length || 0) + 1 });
    }
  };

  if (isLoading) return <Spinner />;
  if (!bacaan) return <Text>Not Found</Text>;

  return (
    <Stack gap="8">
      <HStack justify="space-between">
        <Link to="/bacaan">
          <Button size="sm" variant="ghost">← Kembali</Button>
        </Link>
        <Button colorPalette="green" onClick={() => setIsPreviewOpen(true)}>
          <FaEye /> Preview Tampilan
        </Button>
      </HStack>

      <BacaanMetadataForm 
        initialData={bacaan} 
        onUpdate={handleUpdate} 
      />

      <Box>
        <HStack justify="space-between" mb="4">
          <Heading size="md">Daftar Bagian (Sections)</Heading>
          <Button size="sm" onClick={handleAddSection}>+ Tambah Bagian</Button>
        </HStack>

        <Stack gap="3">
          {bacaan.sections?.map(section => (
            <SectionListItem 
              key={section.id} 
              section={section}
              bacaanId={bacaanId} 
              onDelete={(id) => deleteSection({ id, bacaanId })} 
            />
          ))}
          {bacaan.sections?.length === 0 && <Text color="gray.500">Belum ada bagian.</Text>}
        </Stack>
      </Box>

      <PreviewModal 
        bacaan={bacaan} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </Stack>
  );
};
