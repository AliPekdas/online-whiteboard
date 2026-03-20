import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import type { Shape, ToolType, Point } from '../types';

interface CanvasAreaProps {
  shapes: Shape[];
  setShapes: (shapes: Shape[] | ((prev: Shape[]) => Shape[])) => void;
  currentTool: ToolType;
  currentColor: string;
  currentStrokeWidth: number;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  shapes,
  setShapes,
  currentTool,
  currentColor,
  currentStrokeWidth,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  
  // Camera State
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const lastPanPoint = useRef<{ x: number, y: number } | null>(null);

  // Resize canvas to window size
  useLayoutEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        drawAll(); // Redraw after resize
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [shapes, currentShape, camera]);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (shape.type) {
      case 'pencil':
        if (shape.points.length === 0) return;
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
        break;
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.stroke();
        break;
      case 'ellipse':
        ctx.beginPath();
        ctx.ellipse(shape.centerX, shape.centerY, Math.abs(shape.radiusX), Math.abs(shape.radiusY), 0, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'line':
      case 'arrow':
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        
        if (shape.type === 'arrow') {
          const headlen = 15;
          const dx = shape.endX - shape.startX;
          const dy = shape.endY - shape.startY;
          const angle = Math.atan2(dy, dx);
          ctx.beginPath();
          ctx.moveTo(shape.endX, shape.endY);
          ctx.lineTo(shape.endX - headlen * Math.cos(angle - Math.PI / 6), shape.endY - headlen * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(shape.endX, shape.endY);
          ctx.lineTo(shape.endX - headlen * Math.cos(angle + Math.PI / 6), shape.endY - headlen * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
        break;
    }
  }, []);

  const drawAll = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.save();
    // Clear whole board
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform to clear exactly the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Re-apply DPR scaling if necessary, but since we set it on resize, 
    // it's easier to just pick it up from current state, but wait, setTransform clears DPR
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    // Apply Camera Transform
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.scale, camera.scale);

    // Render all saved shapes
    shapes.forEach(shape => drawShape(ctx, shape));

    // Render currently drawing shape
    if (currentShape) {
      drawShape(ctx, currentShape);
    }
    
    ctx.restore();
  }, [shapes, currentShape, drawShape, camera]);

  // Redraw whenever shapes or camera changes
  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      drawAll();
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [drawAll]);

  // Mouse wheel for zooming
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Get mouse pos relative to canvas
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Adjust zoom
      const zoomSensitivity = 0.001;
      const zoomFactor = Math.exp(-e.deltaY * zoomSensitivity);
      
      setCamera(prev => {
        const newScale = Math.min(Math.max(0.1, prev.scale * zoomFactor), 10);
        
        // Compute new x and y so the point under mouse didn't move
        const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale);
        const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale);

        return { x: newX, y: newY, scale: newScale };
      });
    };

    // passive: false allows e.preventDefault()
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  const getWorldCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | Touch): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    
    return {
      x: (screenX - camera.x) / camera.scale,
      y: (screenY - camera.y) / camera.scale
    };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Start panning if Middle Mouse (button 1) or Tool is Select
    if (e.button === 1 || currentTool === 'select') {
      setIsPanning(true);
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      return;
    }
    
    setIsDrawing(true);
    const { x, y } = getWorldCoordinates(e);
    const baseProps = {
      id: Math.random().toString(36).substring(2, 9),
      color: currentColor,
      strokeWidth: currentStrokeWidth
    };

    switch (currentTool) {
      case 'pencil':
        setCurrentShape({ ...baseProps, type: 'pencil', points: [{ x, y }] });
        break;
      case 'rectangle':
        setCurrentShape({ ...baseProps, type: 'rectangle', x, y, width: 0, height: 0 });
        break;
      case 'ellipse':
        setCurrentShape({ ...baseProps, type: 'ellipse', centerX: x, centerY: y, radiusX: 0, radiusY: 0 });
        break;
      case 'line':
      case 'arrow':
        setCurrentShape({ ...baseProps, type: currentTool, startX: x, startY: y, endX: x, endY: y });
        break;
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && lastPanPoint.current) {
      const dx = e.clientX - lastPanPoint.current.x;
      const dy = e.clientY - lastPanPoint.current.y;
      setCamera(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!isDrawing || !currentShape || currentTool === 'select') return;
    const { x, y } = getWorldCoordinates(e);

    setCurrentShape(prev => {
      if (!prev) return null;
      switch (prev.type) {
        case 'pencil':
          return { ...prev, points: [...prev.points, { x, y }] };
        case 'rectangle':
          return { ...prev, width: x - prev.x, height: y - prev.y };
        case 'ellipse':
          return { ...prev, radiusX: (x - prev.centerX), radiusY: (y - prev.centerY) };
        case 'line':
        case 'arrow':
          return { ...prev, endX: x, endY: y };
        default:
          return prev;
      }
    });
  };

  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
      lastPanPoint.current = null;
    }

    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentShape) {
      let isValidShape = true;
      if (currentShape.type === 'pencil' && currentShape.points.length < 2) isValidShape = false;
      if (currentShape.type === 'rectangle' && (currentShape.width === 0 || currentShape.height === 0)) isValidShape = false;
      if (currentShape.type === 'ellipse' && (currentShape.radiusX === 0 || currentShape.radiusY === 0)) isValidShape = false;
      if ((currentShape.type === 'line' || currentShape.type === 'arrow') && currentShape.startX === currentShape.endX && currentShape.startY === currentShape.endY) isValidShape = false;
      
      if (isValidShape) {
        setShapes(prev => [...prev, currentShape]);
      }
      setCurrentShape(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      // Touch support simple adaptation without pinch-zoom yet
      onTouchStart={(e) => {
        if(e.touches.length > 1) return; // Prevent messy input if zooming gesture
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          button: 0
        });
        handlePointerDown(mouseEvent as any);
      }}
      onTouchMove={(e) => {
        if(e.touches.length > 1) return;
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        handlePointerMove(mouseEvent as any);
      }}
      onTouchEnd={(e) => {
        handlePointerUp();
      }}
      className={`absolute inset-0 block w-full h-full ${currentTool !== 'select' && !isPanning ? 'crosshair-cursor' : 'grab-cursor'}`}
      style={{ 
        cursor: isPanning ? 'grabbing' : (currentTool === 'select' ? 'grab' : 'crosshair'), 
        touchAction: 'none' 
      }}
    />
  );
};
