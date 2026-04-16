import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RoadmapPDFExport({ projectName }) {
  const handlePrint = () => {
    // The easiest, dependency-free way to "export to PDF" in the browser 
    // is invoking the native print dialog, which offers "Save to PDF".
    // We rely on CSS @media print rules in index.css to format it perfectly.
    window.print();
  };

  return (
    <Button onClick={handlePrint} variant="outline" className="gap-2 print:hidden">
      <Download className="w-4 h-4" />
      Download as PDF
    </Button>
  );
}