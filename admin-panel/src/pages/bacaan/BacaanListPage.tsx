import { Button, Heading, Stack, HStack, Spinner } from '@chakra-ui/react';
import { useBacaanList, useDeleteBacaan, useCreateBacaan } from '@/features/bacaan/hooks';
import { BacaanListItem } from '@/features/bacaan/components/BacaanListItem';

export const BacaanListPage = () => {
  const { data: bacaans, isLoading } = useBacaanList();
  const { mutate: deleteBacaan } = useDeleteBacaan();
  const { mutate: createBacaan } = useCreateBacaan();

  // Simple prompt for now instead of Modal to save time/tokens
  const handleAdd = () => {
    const title = window.prompt("Judul Bacaan:");
    if (title) {
      createBacaan({ judul: title, judul_arab: '', deskripsi: '' });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Hapus bacaan ini?")) {
      deleteBacaan(id);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <Stack gap="6">
      <HStack justify="space-between">
        <Heading size="lg">Daftar Bacaan</Heading>
        <Button onClick={handleAdd} colorPalette="blue">+ Tambah Bacaan</Button>
      </HStack>

      <Stack gap="4">
        {bacaans?.map((item) => (
          <BacaanListItem 
            key={item.id} 
            bacaan={item} 
            onDelete={handleDelete} 
          />
        ))}
      </Stack>
    </Stack>
  );
};
