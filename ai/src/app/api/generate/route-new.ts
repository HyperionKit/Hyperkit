import { NextRequest, NextResponse } from 'next/server'
import { generateProjectStructure, ProjectFile } from '../../../lib/prompt-new'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Generate the project structure
    const projectFiles = generateProjectStructure(prompt)
    
    // For API compatibility, return the main HTML file content
    const indexFile = projectFiles.find(f => f.path === 'index.html')
    
    return NextResponse.json({
      content: indexFile?.content || '',
      projectFiles, // Include all files for the new build system
      success: true
    })

  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
