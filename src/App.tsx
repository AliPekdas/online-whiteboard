import { useState, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { Header } from './components/Header';
import { CanvasArea } from './components/CanvasArea';
import { useHistory } from './hooks/useHistory';
import type { ToolType } from './types';
import { saveShapesToDB, loadShapesFromDB } from './services/db';
import { exportCanvasToPDF } from './services/pdfExport';

function App() {
  const [currentTool, setCurrentTool] = useState<ToolType>('pencil');
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [currentStrokeWidth, setStrokeWidth] = useState<number>(4);
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    shapes,
    setShapes,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    replaceAllHistory
  } = useHistory([]);

  // Load from DB on mount
  useEffect(() => {
    loadShapesFromDB().then((savedShapes) => {
      if (savedShapes && savedShapes.length > 0) {
        replaceAllHistory(savedShapes);
      }
      setIsLoaded(true);
    });
  }, [replaceAllHistory]);

  // Save to DB on change
  useEffect(() => {
    if (isLoaded) {
      saveShapesToDB(shapes);
    }
  }, [shapes, isLoaded]);

  const handleDownloadPdf = () => {
    exportCanvasToPDF();
  };

  if (!isLoaded) return null; // Avoid rendering empty canvas before load

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Header 
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onClear={clearHistory}
        onDownloadPdf={handleDownloadPdf}
      />
      
      <Toolbar 
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        currentStrokeWidth={currentStrokeWidth}
        setStrokeWidth={setStrokeWidth}
      />
      
      <CanvasArea 
        shapes={shapes}
        setShapes={setShapes}
        currentTool={currentTool}
        currentColor={currentColor}
        currentStrokeWidth={currentStrokeWidth}
      />
    </main>
  );
}

export default App;
