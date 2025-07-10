import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(filePath: string): Promise<string> {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    try {
        switch (fileExtension) {
            case '.pdf':
                return await extractTextFromPDF(filePath);
            case '.doc':
            case '.docx':
                return await extractTextFromDOCX(filePath);
            default:
                throw new Error(`Unsupported file type: ${fileExtension}`);
        }
    } catch (error) {
        console.error(`Error extracting text from ${filePath}:`, error);
        throw new Error(`Failed to extract text from ${fileExtension} file`);
    }
}

async function extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

async function extractTextFromDOCX(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
}

export function validateFileType(filename: string): boolean {
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = path.extname(filename).toLowerCase();
    return allowedExtensions.includes(fileExtension);
}

export function getFileSize(filePath: string): number {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        console.error('Error getting file size:', error);
        return 0;
    }
}

export function cleanUpFile(filePath: string): void {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error cleaning up file ${filePath}:`, error);
    }
}
