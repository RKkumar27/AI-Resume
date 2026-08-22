const fs = require('fs');
const mammoth = require('mammoth');

/**
 * Universal PDF Buffer Text Parser supporting all pdf-parse module versions (v1, v2, CommonJS/ESM).
 */
const parsePdfBuffer = async (dataBuffer) => {
  const pdfModule = require('pdf-parse');
  
  // 1. If v1 function signature: pdfParse(buffer)
  if (typeof pdfModule === 'function') {
    const data = await pdfModule(dataBuffer);
    return data.text || '';
  }
  
  // 2. If v2 class signature: new PDFParse(Uint8Array)
  if (pdfModule.PDFParse) {
    const uint8 = new Uint8Array(dataBuffer);
    const parser = new pdfModule.PDFParse(uint8);
    const res = await parser.getText();
    return typeof res === 'string' ? res : (res.text || '');
  }
  
  // 3. Fallback default export check
  if (pdfModule.default) {
    if (typeof pdfModule.default === 'function') {
      const data = await pdfModule.default(dataBuffer);
      return data.text || '';
    }
    if (pdfModule.default.PDFParse) {
      const uint8 = new Uint8Array(dataBuffer);
      const parser = new pdfModule.default.PDFParse(uint8);
      const res = await parser.getText();
      return typeof res === 'string' ? res : (res.text || '');
    }
  }

  throw new Error('Unsupported pdf-parse module exports.');
};

/**
 * Extracts raw document text from PDF or DOCX file path.
 * Logs extraction telemetry (text length, preview snippet) and throws
 * explicit errors if file cannot be read or contains no extractable text.
 */
const parseDocumentText = async (filePath, originalName) => {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('Resume file path does not exist on server storage.');
  }

  const ext = (originalName || filePath).split('.').pop().toLowerCase();
  let extractedText = '';

  try {
    if (ext === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      extractedText = await parsePdfBuffer(dataBuffer);
    } else if (ext === 'docx' || ext === 'doc') {
      const docxResult = await mammoth.extractRawText({ path: filePath });
      extractedText = docxResult.value || '';
    } else {
      throw new Error(`Unsupported document extension: .${ext}. Only PDF and DOCX files are allowed.`);
    }
  } catch (err) {
    console.error(`[Parser Service Error]: Text extraction failed for file "${originalName}":`, err.message);
    throw new Error(`Failed to parse text from ${originalName}: ${err.message}`);
  }

  // Clean whitespace
  extractedText = extractedText.replace(/\s+/g, ' ').trim();

  if (!extractedText || extractedText.length < 10) {
    console.warn(`[Parser Service Warning]: Minimal text extracted from "${originalName}".`);
    throw new Error(`No readable text content could be extracted from "${originalName}". Please ensure the document is not an image-only scan or encrypted PDF.`);
  }

  console.log(`[Parser Service Telemetry]: Successfully extracted ${extractedText.length} characters from "${originalName}". Preview: "${extractedText.substring(0, 120)}..."`);

  return extractedText;
};

module.exports = { parseDocumentText };
