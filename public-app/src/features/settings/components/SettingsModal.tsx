import {
  Button,
  Stack,
  Slider,
  Switch,
  RadioGroup,
  HStack,
} from '@chakra-ui/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [fontSize, setFontSize] = useLocalStorage<number>('fontSize', 28);
  const [showTranslation, setShowTranslation] = useLocalStorage<boolean>('showTranslation', true);
  const [themeMode, setThemeMode] = useLocalStorage<'light' | 'dark'>('themeMode', 'light');

  const handleFontSizeChange = (e: { value: number[] }) => {
    setFontSize(e.value[0]);
  };

  const handleTranslationToggle = (e: { checked: boolean }) => {
    setShowTranslation(e.checked);
  };

  const handleThemeChange = (e: { value: string }) => {
    setThemeMode(e.value as 'light' | 'dark');
    document.body.setAttribute('data-theme', e.value);
  };

  React.useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        width: '90%', maxWidth: '400px',
        color: 'black' 
      }}>
        <Stack gap="6">
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Pengaturan Bacaan</div>
          
          <Stack gap="2">
            <label style={{ display: 'block', fontWeight: 'bold' }}>Ukuran Font (Arab)</label>
            <Slider.Root 
              defaultValue={[fontSize]} 
              min={16} max={48} step={1}
              onValueChange={handleFontSizeChange}
              width="100%"
              colorPalette="green"
            >
              <Slider.Control>
                <Slider.Track bg="gray.200" height="6px" borderRadius="full">
                  <Slider.Range bg="green.500" />
                </Slider.Track>
                <Slider.Thumb index={0} boxSize="20px" bg="white" shadow="md" border="1px solid" borderColor="gray.200" />
              </Slider.Control>
            </Slider.Root>
            <div style={{ fontSize: '0.8rem', color: 'gray' }}>Ukuran saat ini: {fontSize}px</div>
          </Stack>

          <Stack gap="2" direction="row" alignItems="center" justify="space-between">
            <label style={{ fontWeight: 'bold' }}>Tampilkan Terjemahan</label>
            <Switch.Root checked={showTranslation} onCheckedChange={handleTranslationToggle}>
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label />
            </Switch.Root>
          </Stack>

          <Stack gap="2">
            <label style={{ fontWeight: 'bold' }}>Mode Tema</label>
            <RadioGroup.Root value={themeMode} onValueChange={handleThemeChange as any}>
              <HStack gap="4">
                <RadioGroup.Item value="light">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText>Terang</RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item value="dark">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText>Gelap</RadioGroup.ItemText>
                </RadioGroup.Item>
              </HStack>
            </RadioGroup.Root>
          </Stack>

          <HStack justify="flex-end">
            <Button colorPalette="green" onClick={onClose}>Tutup</Button>
          </HStack>
        </Stack>
      </div>
    </div>
  );
};
