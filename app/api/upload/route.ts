import { MAX_PDF_SIZE } from '../../../lib/constants';

export const runtime = 'nodejs';

const TEXT_EXTENSIONS = new Set(['.txt', '.md']);
const PDF_EXTENSIONS = new Set(['.pdf']);

function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot === -1 ? '' : fileName.slice(dot).toLowerCase();
}

function isPdf(file: File, ext: string): boolean {
  return ext === '.pdf' || file.type === 'application/pdf';
}

function isTextFile(file: File, ext: string): boolean {
  return TEXT_EXTENSIONS.has(ext) || file.type === 'text/plain' || file.type === 'text/markdown';
}

async function extractText(file: File, ext: string): Promise<string> {
  if (isPdf(file, ext)) {
    const { PDFParse } = await import('pdf-parse');
    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  if (isTextFile(file, ext)) {
    return (await file.text()).trim();
  }

  throw new Error('UNSUPPORTED');
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_PDF_SIZE) {
      return Response.json({ error: 'File too large' }, { status: 413 });
    }

    const ext = getExtension(file.name);

    if (!isPdf(file, ext) && !isTextFile(file, ext)) {
      return Response.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const text = await extractText(file, ext);

    if (!text) {
      return Response.json({ error: 'No text could be extracted from file' }, { status: 422 });
    }

    return Response.json({ text, fileName: file.name });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNSUPPORTED') {
      return Response.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    console.error('Upload error:', error);
    return Response.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
