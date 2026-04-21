import { useEffect } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { useUIStore } from '../store/uiStore';
import toast from 'react-hot-toast';

export function useKeyboardShortcuts(onOpenCommandPalette: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Command palette — always works
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
        return;
      }

      // Skip shortcuts if user is typing in an input
      if (isInput) return;

      const store = useCanvasStore.getState();

      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        store.undo();
        return;
      }

      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        store.redo();
        return;
      }

      // Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const { nodes, edges } = store;
        const data = JSON.stringify({ nodes, edges, savedAt: new Date().toISOString() });
        localStorage.setItem('cloudinfra-diagram', data);
        toast.success('Diagram saved');
        return;
      }

      // Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        store.copySelected();
        if (store.selectedNodeId) toast.success('Node copied');
        return;
      }

      // Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        store.paste();
        return;
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        store.copySelected();
        store.paste();
        return;
      }

      // Select All
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        store.selectAll();
        return;
      }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        store.deleteSelected();
        return;
      }

      // Toggle theme (Ctrl+Shift+T)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        useUIStore.getState().toggleTheme();
        return;
      }

      // Toggle sidebar (Ctrl+B)
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        useUIStore.getState().toggleSidebar();
        return;
      }

      // Escape — deselect
      if (e.key === 'Escape') {
        store.selectNode(null);
        store.selectEdge(null);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette]);
}
