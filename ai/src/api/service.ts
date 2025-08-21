import { SYSTEM_PROMPT, AI_MODELS } from '@/constants';
import { GeneratedProject, ProjectFile } from '@/types';

export class AIService {
  private currentModel: string = 'gpt-5';

  public switchModel(modelId: string) {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (!model || !model.available) {
      throw new Error(`Model ${modelId} is not available`);
    }
    
    this.currentModel = modelId;
  }

  public async generateProject(prompt: string, model?: string): Promise<GeneratedProject> {
    if (!this.isProjectPrompt(prompt)) {
      throw new Error('Sorry, I can only help with project generation. Please describe a web application you\'d like me to create.');
    }

    const selectedModel = model || this.currentModel;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate project');
      }

      const data = await response.json();
      
      // Handle both old and new API responses
      if (data.projectFiles) {
        // New API response with project structure
        return this.parseProjectStructureResponse(data.projectFiles, prompt);
      } else {
        // Old API response with just HTML content
        return this.parseProjectResponse(data.content, prompt);
      }
    } catch (error) {
      console.error('Project generation failed:', error);
      throw new Error('Failed to generate project. Please try again with a different prompt.');
    }
  }

  private isProjectPrompt(prompt: string): boolean {
    const projectKeywords = [
      'create', 'build', 'make', 'generate', 'develop',
      'app', 'application', 'website', 'project', 'game',
      'dashboard', 'interface', 'platform', 'tool',
      'dapp', 'defi', 'nft', 'wallet', 'crypto', 'blockchain'
    ];

    const lowerPrompt = prompt.toLowerCase();
    return projectKeywords.some(keyword => lowerPrompt.includes(keyword));
  }

  private parseProjectResponse(response: string, originalPrompt: string): GeneratedProject {
    let htmlContent = response.trim();
    htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    
    const projectName = this.generateProjectName(originalPrompt);
    
    const files: ProjectFile[] = [
      {
        path: 'index.html',
        content: htmlContent,
        type: 'file'
      },
      {
        path: 'README.md',
        content: this.generateReadme(projectName, originalPrompt),
        type: 'file'
      },
      {
        path: 'package.json',
        content: this.generatePackageJson(projectName),
        type: 'file'
      }
    ];

    return {
      id: `project_${Date.now()}`,
      name: projectName,
      description: originalPrompt,
      files,
      createdAt: new Date(),
      htmlContent
    };
  }

  private generateProjectName(prompt: string): string {
    const words = prompt.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 3);
    
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'HyperionKit Project';
  }

  private parseProjectStructureResponse(projectFiles: any[], prompt: string): GeneratedProject {
    const projectName = this.generateProjectName(prompt);
    
    // Find the main HTML file
    const indexFile = projectFiles.find((f: any) => f.path === 'index.html');
    const htmlContent = indexFile?.content || '';
    
    // Convert project files to the expected format
    const files: ProjectFile[] = projectFiles.map((file: any) => ({
      path: file.path,
      content: file.content,
      type: 'file' as const
    }));

    // Add README if not present
    if (!files.find(f => f.path.toLowerCase().includes('readme'))) {
      files.push({
        path: 'README.md',
        content: this.generateReadme(projectName, prompt),
        type: 'file' as const
      });
    }

    return {
      id: `project_${Date.now()}`,
      name: projectName,
      htmlContent,
      files,
      createdAt: new Date(),
      description: prompt
    };
  }

  private generateReadme(projectName: string, description: string): string {
    return `# ${projectName}

    ${description}

    ## About
    This project was generated using HyperionKit AI, featuring integrated blockchain components for seamless Web3 functionality.

    ## Features
    - Modern responsive design
    - Integrated blockchain wallet connectivity
    - Pre-built DeFi components (Swap, Bridge, Staking, Faucet)
    - Ready-to-deploy HTML application

    ## Getting Started
    1. Open \`index.html\` in your browser
    2. Connect your wallet using the ConnectWallet component
    3. Interact with the blockchain features

    ## Components Used
    - **ConnectWallet**: Easy wallet connection
    - **Swap**: Token swapping functionality
    - **Bridge**: Cross-chain bridging
    - **Staking**: Token staking features
    - **Faucet**: Testnet token claiming

    ## Technologies
    - HTML5, CSS3, JavaScript
    - HyperionKit Components
    - Web3 Integration

    Built with ❤️ using HyperionKit AI
    `;
  }

  private generatePackageJson(projectName: string): string {
    return JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      description: "Generated with HyperionKit AI",
      main: "index.html",
      scripts: {
        start: "npx serve .",
        build: "echo 'No build step required for static HTML'"
      },
      dependencies: {
        hyperionkit: "^1.0.0"
      },
      devDependencies: {
        serve: "^14.0.0"
      },
      keywords: ["hyperionkit", "web3", "blockchain", "dapp"],
      author: "HyperionKit AI",
      license: "MIT"
    }, null, 2);
  }
}

export const aiService = new AIService();
