import { toPng, toBlob } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ExportOptions {
  element: HTMLElement;
  filename?: string;
  pixelRatio?: number;
}

export async function exportToPng({ element, filename = 'kapian-card', pixelRatio = 2 }: ExportOptions): Promise<void> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });

  const link = document.createElement('a');
  link.download = `${filename}-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

export async function copyToClipboard(element: HTMLElement, pixelRatio = 2): Promise<void> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ]);
}

export async function exportAllToZip(elements: HTMLElement[], filenamePrefix = 'kapian-card', pixelRatio = 2): Promise<void> {
  const zip = new JSZip();

  // Generate all promises
  const promises = elements.map(async (element, index) => {
    const blob = await toBlob(element, {
      cacheBust: true,
      pixelRatio,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
      },
    });
    if (blob) {
      zip.file(`${filenamePrefix}-${index + 1}.png`, blob);
    }
  });

  await Promise.all(promises);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `kapian-export-${Date.now()}.zip`);
}
