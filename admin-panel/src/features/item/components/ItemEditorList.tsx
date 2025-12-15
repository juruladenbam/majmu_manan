import { Box, Button, Stack, Textarea, HStack, IconButton, Text } from '@chakra-ui/react';
import { useState } from 'react';
import type { Item } from '@project/shared';
import { useCreateItem, useUpdateItem, useDeleteItem } from '../hooks';
import { FaTrash, FaSave, FaPlus, FaEdit } from 'react-icons/fa';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

interface ItemEditorListProps {
  bacaanId: number;
  sectionId: number | null;
  items: Item[];
}

export const ItemEditorList = ({ bacaanId, sectionId, items }: ItemEditorListProps) => {
  const { mutate: createItem } = useCreateItem();
  
  const handleAddItem = () => {
    createItem({
      bacaan_id: bacaanId,
      section_id: sectionId,
      arabic: '',
      terjemahan: '',
      tipe_tampilan: 'text',
      urutan: items.length + 1
    });
  };

  return (
    <Stack gap="4" mt="4" pl="4" borderLeft="2px solid" borderColor="gray.200">
      {items.map((item) => (
        <ItemRow key={item.id} item={item} bacaanId={bacaanId} />
      ))}
      <Button size="sm" variant="outline" onClick={handleAddItem}>
        <FaPlus /> Tambah Baris/Ayat
      </Button>
    </Stack>
  );
};

const ItemRow = ({ item, bacaanId }: { item: Item; bacaanId: number }) => {
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: deleteItem } = useDeleteItem();
  const [data, setData] = useState(item);
  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof Item, value: any) => {
    setData({ ...data, [field]: value });
    setIsDirty(true);
  };

  const handleSave = () => {
    updateItem({ id: item.id, data });
    setIsDirty(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Hapus baris ini?')) {
      deleteItem({ id: item.id, bacaanId });
    }
  };

  const handleCancel = () => {
    setData(item);
    setIsDirty(false);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Box p="3" bg="white" rounded="md" borderWidth="1px">
        <HStack justify="space-between" align="start">
          <Stack gap="1" flex="1">
            {item.arabic ? (
              <div 
                dangerouslySetInnerHTML={{ __html: item.arabic }} 
                style={{ fontFamily: "'Scheherazade New', serif", fontSize: '2.2rem', direction: 'rtl', lineHeight: '2.2' }} 
              />
            ) : (
              <Text fontSize="sm" color="gray.400">Teks Arab kosong</Text>
            )}
            
            {item.latin && (
              <Text fontSize="sm" fontStyle="italic" color="gray.600">
                {item.latin}
              </Text>
            )}
            
            {item.terjemahan && (
              <Text fontSize="sm">
                {item.terjemahan}
              </Text>
            )}

            {item.tipe_tampilan !== 'text' && (
               <Text fontSize="xs" color="blue.500" fontWeight="bold">
                 Tipe: {item.tipe_tampilan}
               </Text>
            )}
          </Stack>
          
          <HStack>
            <IconButton 
              aria-label="Edit" 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsEditing(true)}
            >
              <FaEdit />
            </IconButton>
            <IconButton 
              aria-label="Delete" 
              size="sm" 
              colorPalette="red" 
              variant="ghost" 
              onClick={handleDelete}
            >
              <FaTrash />
            </IconButton>
          </HStack>
        </HStack>
      </Box>
    );
  }

  return (
    <Box p="3" bg="gray.50" rounded="md" borderWidth="1px">
      <Stack gap="2">
        <RichTextEditor
          value={data.arabic || ''}
          onChange={(val) => handleChange('arabic', val)}
          placeholder="Teks Arab (Wysiwyg)"
          isRtl={true}
        />
        <Textarea 
          placeholder="Transliterasi Latin" 
          value={data.latin || ''} 
          onChange={(e) => handleChange('latin', e.target.value)} 
          fontStyle="italic"
        />
        <Textarea 
          placeholder="Terjemahan Bahasa Indonesia" 
          value={data.terjemahan || ''} 
          onChange={(e) => handleChange('terjemahan', e.target.value)} 
        />
        <HStack justify="space-between">
          <select
            value={data.tipe_tampilan} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('tipe_tampilan', e.target.value as any)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="text">Teks Biasa</option>
            <option value="syiir">Syiir (Puisi)</option>
            <option value="judul_tengah">Judul Tengah</option>
            <option value="image">Gambar</option>
            <option value="keterangan">Keterangan</option>
          </select>
          
          <HStack>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Batal
            </Button>
            <Button 
              size="sm" 
              colorPalette="green" 
              onClick={handleSave}
              disabled={!isDirty}
            >
              Simpan
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </Box>
  );
};
