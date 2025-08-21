'use client'

import { useEffect, useRef, useState } from 'react'

interface PreviewProps {
  content: string;
}

interface ProjectFile {
  path: string;
  content: string;
}

interface BuildResponse {
  projectId: string;
  files: ProjectFile[];
  success: boolean;
  error?: string;
  fallback?: boolean;
}

export default function Preview({ content }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildError, setBuildError] = useState<string | null>(null)
  const [projectUrl, setProjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (content) {
      buildAndServeProject(content)
    }
  }, [content])

  const buildAndServeProject = async (prompt: string) => {
    setIsBuilding(true)
    setBuildError(null)
    setProjectUrl(null)

    try {
      console.log('Building project for prompt:', prompt)

      // Call the build API
      const response = await fetch('/api/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`Build API failed: ${response.status}`)
      }

      const buildResult: BuildResponse = await response.json()
      
      if (buildResult.success) {
        // Project built successfully, create iframe URL
        const url = `/api/serve/${buildResult.projectId}/index.html`
        setProjectUrl(url)
        console.log('Project built successfully, serving at:', url)
      } else if (buildResult.fallback) {
        // Build failed but we have fallback files, create a blob URL
        console.log('Build failed, using fallback source files')
        const indexFile = buildResult.files.find(f => f.path === 'index.html')
        if (indexFile) {
          createBlobUrl(buildResult.files)
        } else {
          throw new Error('No index.html found in fallback files')
        }
      } else {
        throw new Error(buildResult.error || 'Build failed')
      }

    } catch (error) {
      console.error('Build error:', error)
      setBuildError(error instanceof Error ? error.message : String(error))
      
      // Fallback to simple HTML generation
      try {
        const fallbackHtml = generateFallbackHtml(prompt)
        const blob = new Blob([fallbackHtml], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        setProjectUrl(url)
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError)
        setBuildError('Failed to generate preview')
      }
    } finally {
      setIsBuilding(false)
    }
  }

  const createBlobUrl = (files: ProjectFile[]) => {
    // Find the main HTML file
    const indexFile = files.find(f => f.path === 'index.html' || f.path === 'src/index.html')
    
    if (!indexFile) {
      throw new Error('No HTML file found')
    }

    // Create a modified HTML with inline scripts and styles
    let htmlContent = indexFile.content

    // Inline CSS files
    const cssFiles = files.filter(f => f.path.endsWith('.css'))
    cssFiles.forEach(cssFile => {
      htmlContent = htmlContent.replace(
        new RegExp(`<link[^>]*href=["']?\\.?/?${cssFile.path.replace(/\//g, '\\/')}["']?[^>]*>`, 'g'),
        `<style>${cssFile.content}</style>`
      )
    })

    // Inline JS files (for simple cases)
    const jsFiles = files.filter(f => f.path.endsWith('.js') || f.path.endsWith('.jsx'))
    jsFiles.forEach(jsFile => {
      if (jsFile.path.includes('main.jsx') || jsFile.path.includes('main.js')) {
        htmlContent = htmlContent.replace(
          new RegExp(`<script[^>]*src=["']?\\.?/?${jsFile.path.replace(/\//g, '\\/')}["']?[^>]*></script>`, 'g'),
          `<script type="module">${jsFile.content}</script>`
        )
      }
    })

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    setProjectUrl(url)
  }

  const generateFallbackHtml = (prompt: string): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .title {
            font-size: 3rem;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        .button {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }
        .button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">${prompt}</h1>
        <p class="subtitle">Powered by HyperionKit - Web3 Made Simple</p>
        <button class="button" onclick="alert('🚀 Welcome to the future of Web3!')">
            Get Started
        </button>
    </div>
</body>
</html>`
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <div className="flex items-center gap-2">
          {isBuilding && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Building project...</span>
            </div>
          )}
          {buildError && (
            <div className="text-red-600 text-sm">
              ⚠️ {buildError}
            </div>
          )}
          {projectUrl && !isBuilding && (
            <div className="text-green-600 text-sm">
              ✅ Project ready
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative">
        {projectUrl ? (
          <iframe
            ref={iframeRef}
            src={projectUrl}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            title="Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center text-gray-500">
              {isBuilding ? (
                <div>
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Building your Web3 application...</p>
                </div>
              ) : (
                <p>Enter a prompt to generate your Web3 application</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
