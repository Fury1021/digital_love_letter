import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFExportOptions {
  fileName?: string;
  title?: string;
}

/**
 * Captures an HTML element and exports it as a high-quality A4 PDF.
 * Uses client-side html2canvas and jsPDF.
 */
export async function generateLetterPDF(
  elementId: string,
  options: PDFExportOptions = {}
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id '${elementId}' not found for PDF generation.`);
    return false;
  }

  try {
    // Wait for fonts to finish loading
    if (document.fonts) {
      await document.fonts.ready;
    }

    // High resolution render
    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for crisp print quality
      useCORS: true,
      logging: false,
      backgroundColor: null,
      windowWidth: 800, // standard desktop stationery width for consistent rendering
    });

    const imgData = canvas.toDataURL("image/png");

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10; // 10mm margin
    const contentWidth = pageWidth - margin * 2; // 190mm

    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Check if it fits on one page or needs multiple pages
    if (imgHeight <= pageHeight - margin * 2) {
      // Center vertically if it comfortably fits on one page
      const verticalOffset = Math.max(margin, (pageHeight - imgHeight) / 2);
      pdf.addImage(imgData, "PNG", margin, verticalOffset, imgWidth, imgHeight);
    } else {
      // Multipage handling for very long letters
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    const safeTitle = (options.title || "love-letter")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const fileName = options.fileName || `${safeTitle || "love-letter"}.pdf`;

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}
