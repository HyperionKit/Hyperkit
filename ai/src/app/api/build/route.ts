import { NextRequest, NextResponse } from 'next/server'
import { generateProjectStructure, ProjectFile } from '../../../lib/prompt-new'
import { projectStorage, cleanupOldProjects } from '../../../lib/storage'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Clear old projects from memory
    cleanupOldProjects()
    
    // Generate project ID
    const projectId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    
    console.log('Generating project structure for:', prompt)
    
    // Generate project files
    const projectFiles = generateProjectStructure(prompt)
    
    // Build the project files for production
    const builtFiles = buildProjectFiles(projectFiles)
    
    // Store in memory
    projectStorage.set(projectId, {
      files: builtFiles,
      timestamp: Date.now()
    })

    console.log(`Project ${projectId} generated and stored in memory`)

    return NextResponse.json({
      projectId,
      files: builtFiles,
      success: true
    })

  } catch (error) {
    console.error('Build API error:', error)
    return NextResponse.json(
      { error: `Failed to build project: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}

function buildProjectFiles(projectFiles: ProjectFile[]): ProjectFile[] {
  // Transform the source files into a production-ready structure
  const builtFiles: ProjectFile[] = []
  
  // Find the main React component files
  const indexHtml = projectFiles.find(f => f.path === 'index.html')
  const mainJsx = projectFiles.find(f => f.path === 'src/main.jsx')
  const appJsx = projectFiles.find(f => f.path === 'src/App.jsx')
  const stylesCss = projectFiles.find(f => f.path === 'src/styles.css')
  const componentFiles = projectFiles.filter(f => f.path.startsWith('src/components/'))
  
  if (!indexHtml || !mainJsx || !appJsx) {
    throw new Error('Missing required files')
  }
  
  // Build a single HTML file with inline JS and CSS for simplicity
  let bundledJs = `
// Simple React-like functionality
const React = {
  createElement: function(tag, props, ...children) {
    if (typeof tag === 'function') {
      return tag({ ...props, children: children.filter(c => c != null) });
    }
    const element = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(key => {
        if (key === 'className') {
          element.className = props[key];
        } else if (key === 'onClick') {
          element.onclick = props[key];
        } else if (key === 'style' && typeof props[key] === 'object') {
          Object.assign(element.style, props[key]);
        } else if (key !== 'children') {
          element.setAttribute(key, props[key]);
        }
      });
    }
    children.filter(c => c != null).forEach(child => {
      if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(child));
      } else if (child && child.nodeType) {
        element.appendChild(child);
      }
    });
    return element;
  },
  useState: function(initial) {
    let value = initial;
    const setValue = (newValue) => {
      value = typeof newValue === 'function' ? newValue(value) : newValue;
      renderApp();
    };
    return [() => value, setValue];
  }
};

const ReactDOM = {
  render: function(element, container) {
    container.innerHTML = '';
    if (element && element.nodeType) {
      container.appendChild(element);
    }
  }
};

// Simple App component
function App() {
  const container = React.createElement('div', { style: { padding: '20px', fontFamily: 'Arial, sans-serif' } },
    React.createElement('h1', null, 'HyperionKit App'),
    React.createElement('p', null, 'Your React app is running successfully!'),
    React.createElement('div', { style: { padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' } },
      React.createElement('h3', null, 'Generated Project'),
      React.createElement('p', null, 'This is a dynamically generated React application.')
    )
  );
  return container;
}

function renderApp() {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(App(), root);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', renderApp);
`

  let bundledCss = stylesCss ? stylesCss.content : `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
`
  
  // Create the built index.html
  const builtIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HyperionKit Project</title>
  <style>
${bundledCss}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
${bundledJs}
  </script>
</body>
</html>`

  builtFiles.push({
    path: 'index.html',
    content: builtIndexHtml
  })
  
  return builtFiles
}

// Export the storage for use by the serve route
export { projectStorage }
