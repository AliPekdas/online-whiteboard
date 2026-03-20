import { useState, useCallback } from 'react';
import type { Shape } from '../types';

export const useHistory = (initialState: Shape[] = []) => {
  const [history, setHistory] = useState<Shape[][]>([initialState]);
  const [pointer, setPointer] = useState<number>(0);

  const setShapes = useCallback(
    (newShapes: Shape[] | ((prev: Shape[]) => Shape[])) => {
      setHistory((prev) => {
        const currentShapes = prev[pointer];
        const nextShapes = typeof newShapes === 'function' ? newShapes(currentShapes) : newShapes;
        const nextHistory = [...prev.slice(0, pointer + 1), nextShapes];
        setPointer(nextHistory.length - 1);
        return nextHistory;
      });
    },
    [pointer]
  );

  const undo = useCallback(() => {
    setPointer((prev) => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      setPointer((ptr) => Math.min(prev.length - 1, ptr + 1));
      return prev;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([[]]);
    setPointer(0);
  }, []);

  const replaceAllHistory = useCallback((shapes: Shape[]) => {
    setHistory([shapes]);
    setPointer(0);
  }, []);

  return {
    shapes: history[pointer],
    setShapes,
    undo,
    redo,
    canUndo: pointer > 0,
    canRedo: pointer < history.length - 1,
    clearHistory,
    replaceAllHistory
  };
};
