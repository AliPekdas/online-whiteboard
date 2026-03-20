export type ToolType = 'select' | 'pencil' | 'rectangle' | 'ellipse' | 'arrow' | 'line';

export interface Point {
  x: number;
  y: number;
}

export interface BaseShape {
  id: string;
  type: ToolType;
  color: string;
  strokeWidth: number;
}

export interface PencilShape extends BaseShape {
  type: 'pencil';
  points: Point[];
}

export interface RectangleShape extends BaseShape {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse';
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
}

export interface LineShape extends BaseShape {
  type: 'line' | 'arrow';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type Shape = PencilShape | RectangleShape | EllipseShape | LineShape;
