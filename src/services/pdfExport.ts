import { jsPDF } from 'jspdf';

export const exportCanvasToPDF = () => {
  // Get all canvas elements (we only have one mainly, but to be sure we find the active one)
  const canvasElement = document.querySelector('canvas') as HTMLCanvasElement;
  if (!canvasElement) return;

  // We want to generate a high quality image. 
  // Let's get the data URL
  const imgData = canvasElement.toDataURL('image/png', 1.0);
  
  // Create jsPDF instance
  // Default is A4 paper size
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvasElement.width, canvasElement.height]
  });

  // Calculate width and height to fit the whole page
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvasElement.height * pdfWidth) / canvasElement.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('whiteboard-export.pdf');
};
