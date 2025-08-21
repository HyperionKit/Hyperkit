import { NextRequest, NextResponse } from 'next/server'
import { projectStorage } from '../../../../../lib/storage'
import { ProjectFile } from '../../../../../lib/prompt-new'

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string; filename: string[] } }
) {
  try {
    const { projectId, filename } = await params
    
    if (!projectId || !filename || filename.length === 0) {
      return NextResponse.json(
        { error: 'Project ID and filename are required' },
        { status: 400 }
      )
    }

    // Get project from memory storage
    const project = projectStorage.get(projectId)
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Build the requested file path
    const requestedFilePath = filename.join('/')
    
    // Find the file in the project
    const file = project.files.find((f: ProjectFile) => f.path === requestedFilePath)
    
    if (!file) {
      // If specific file not found, try to serve index.html for SPA routing
      const indexFile = project.files.find((f: ProjectFile) => f.path === 'index.html')
      if (indexFile && requestedFilePath !== 'index.html') {
        return new NextResponse(indexFile.content, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      }
      
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Determine content type
    const actualFilename = filename[filename.length - 1]
    const contentType = getContentType(actualFilename)
    
    return new NextResponse(file.content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('Serve file error:', error)
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    )
  }
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'html':
      return 'text/html'
    case 'js':
      return 'application/javascript'
    case 'css':
      return 'text/css'
    case 'json':
      return 'application/json'
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    case 'ico':
      return 'image/x-icon'
    default:
      return 'text/plain'
  }
}
