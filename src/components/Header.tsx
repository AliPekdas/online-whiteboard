import React from 'react';
import { Undo2, Redo2, Download, Trash2 } from 'lucide-react';

interface HeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
  onDownloadPdf: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  onDownloadPdf,
}) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-xl border border-gray-100 z-10 transition-all">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        title="Geri Al (Ctrl+Z)"
      >
        <Undo2 size={20} />
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        title="İleri Al (Ctrl+Y)"
      >
        <Redo2 size={20} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-2"></div>

      <button
        onClick={onClear}
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2 font-medium text-sm px-3"
      >
        <Trash2 size={16} />
        <span className="hidden sm:inline">Temizle</span>
      </button>

      <button
        onClick={onDownloadPdf}
        className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors flex items-center gap-2 font-medium text-sm px-4 ml-2"
      >
        <Download size={16} />
        <span>PDF İndir</span>
      </button>
    </div>
  );
};
