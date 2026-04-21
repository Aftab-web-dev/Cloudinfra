import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './components/layout/AppLayout';
import { CommandPalette } from './components/toolbar/CommandPalette';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);

  useKeyboardShortcuts(openCommandPalette);

  return (
    <>
      <AppLayout />
      <CommandPalette open={commandPaletteOpen} onClose={closeCommandPalette} />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: '!bg-white dark:!bg-gray-800 !text-gray-800 dark:!text-gray-200 !text-xs !shadow-lg !rounded-xl',
          duration: 2000,
        }}
      />
    </>
  );
}

export default App;
