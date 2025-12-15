import { Box, Heading, Input, Stack, Text, Textarea, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import type { Bacaan } from '@project/shared';

interface BacaanMetadataFormProps {
  initialData: Bacaan;
  onUpdate: (data: Partial<Bacaan>) => void;
}

export const BacaanMetadataForm = ({ initialData, onUpdate }: BacaanMetadataFormProps) => {
  const [formData, setFormData] = useState({ 
    judul: '', 
    judul_arab: '', 
    deskripsi: '' 
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        judul: initialData.judul,
        judul_arab: initialData.judul_arab || '',
        deskripsi: initialData.deskripsi || ''
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <Box p="6" bg="white" rounded="lg" shadow="sm" borderWidth="1px">
      <Stack gap="4">
        <Heading size="md">Edit Metadata</Heading>
        <Stack gap="2">
          <Text fontSize="sm">Judul Latin</Text>
          <Input 
            value={formData.judul} 
            onChange={e => setFormData({...formData, judul: e.target.value})} 
          />
          
          <Text fontSize="sm">Judul Arab</Text>
          <Input 
            value={formData.judul_arab} 
            onChange={e => setFormData({...formData, judul_arab: e.target.value})} 
          />
          
          <Text fontSize="sm">Deskripsi</Text>
          <Textarea 
            value={formData.deskripsi} 
            onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
          />
          
          <Button onClick={handleSubmit} colorPalette="blue" alignSelf="flex-start">
            Simpan Perubahan
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
