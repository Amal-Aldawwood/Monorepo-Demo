import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { siteId, name, port } = body;
    
    if (!siteId || !name || !port) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, name, and port are required' },
        { status: 400 }
      );
    }
    
    // Ensure siteId and port are numbers
    const siteIdNumber = typeof siteId === 'string' ? parseInt(siteId, 10) : siteId;
    const portNumber = typeof port === 'string' ? parseInt(port, 10) : port;
    
    // Get the script path - we need to calculate it relative to the server's working directory
    // This assumes the script is in the repository root's scripts directory
    const scriptPath = path.join(process.cwd(), '..', '..', 'scripts', 'generate-site.js');
    
    // Execute the generator script
    const { stdout, stderr } = await execAsync(
      `node ${scriptPath} ${siteIdNumber} "${name}" ${portNumber}`
    );
    
    // Log the output for debugging
    console.log('Site generator output:', stdout);
    
    if (stderr && stderr.trim() !== '') {
      console.warn('Site generator warnings:', stderr);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Site files generated successfully',
      output: stdout,
      warnings: stderr || null
    });
  } catch (error) {
    console.error('Error generating site files:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate site files',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};
