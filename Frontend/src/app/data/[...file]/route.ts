import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string[] } }
) {
  try {
    const filePath = params.file.join('/');
    const fullPath = path.join(process.cwd(), 'src', 'mocks', 'data', filePath);
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error serving data file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}