import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Pencil, Square, Circle, ArrowUpRight, Minus, GripHorizontal } from 'lucide-react';
import type { ToolType } from '../types';

interface ToolbarProps {
  currentTool: ToolType;
  setCurrentTool: (tool: ToolType) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  currentStrokeWidth: number;
  setStrokeWidth: (width: number) => void;
}

const COLORS = ['#000000', '#EF4444', '#EAB308', '#22C55E', '#3B82F6']; // Siyah, Kırmızı, Sarı, Yeşil, Mavi

export const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  setCurrentTool,
  currentColor,
  setCurrentColor,
  currentStrokeWidth,
  setStrokeWidth,
}) => {
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div 
      className={`absolute flex flex-col gap-2 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 w-14 items-center z-20 ${!isDragging ? 'transition-transform' : ''}`}
      style={{ left: position.x, top: position.y, touchAction: 'none' }}
    >
      <div 
        className="w-full flex justify-center py-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
        onPointerDown={(e) => {
          setIsDragging(true);
          dragRef.current = { startX: e.clientX, startY: e.clientY, initialX: position.x, initialY: position.y };
          e.preventDefault();
        }}
        title="Sürükle"
      >
        <GripHorizontal size={16} />
      </div>
      
      <div className="flex flex-col gap-1 w-full items-center">
        <ToolButton icon={<MousePointer2 size={20} />} tool="select" current={currentTool} onClick={setCurrentTool} />
        <ToolButton icon={<Pencil size={20} />} tool="pencil" current={currentTool} onClick={setCurrentTool} />
        <ToolButton icon={<Square size={20} />} tool="rectangle" current={currentTool} onClick={setCurrentTool} />
        <ToolButton icon={<Circle size={20} />} tool="ellipse" current={currentTool} onClick={setCurrentTool} />
        <ToolButton icon={<ArrowUpRight size={20} />} tool="arrow" current={currentTool} onClick={setCurrentTool} />
        <ToolButton icon={<Minus size={20} />} tool="line" current={currentTool} onClick={setCurrentTool} />
      </div>

      <div className="w-full h-px bg-gray-200 my-1"></div>

      <div className="flex flex-col gap-2 w-full items-center">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setCurrentColor(color)}
            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${currentColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
            style={{ backgroundColor: color }}
            title={`Renk`}
          />
        ))}
        <input 
          type="color" 
          value={currentColor} 
          onChange={e => setCurrentColor(e.target.value)}
          className="w-6 h-6 p-0 border-0 rounded cursor-pointer mt-1" 
          title="Özel Renk"
        />
      </div>

      <div className="w-full h-px bg-gray-200 my-1"></div>

      <div className="flex flex-col gap-1 w-full items-center pb-1">
        {[2, 4, 6, 8].map((width) => (
          <button
            key={width}
            onClick={() => setStrokeWidth(width)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors ${currentStrokeWidth === width ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
          >
            <div className="bg-current rounded-full" style={{ width: width + 2, height: width + 2 }}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  tool: ToolType;
  current: ToolType;
  onClick: (tool: ToolType) => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, tool, current, onClick }) => {
  const isActive = current === tool;
  return (
    <button
      onClick={() => onClick(tool)}
      className={`p-2 rounded-xl transition-all duration-200 w-full flex justify-center items-center ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' 
          : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      title={tool.charAt(0).toUpperCase() + tool.slice(1)}
    >
      {icon}
    </button>
  );
};
