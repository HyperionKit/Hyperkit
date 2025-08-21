import { GeneratedProject } from '@/types';

export class FileService {
  public static downloadProject(project: GeneratedProject): void {
    try {
      // Create a zip-like structure using JSZip would be ideal, but for simplicity,
      // we'll create individual file downloads
      this.downloadAsZip(project);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download project files');
    }
  }

  private static downloadAsZip(project: GeneratedProject): void {
    // For now, we'll download each file separately
    // In production, you might want to use JSZip library
    project.files.forEach(file => {
      if (file.type === 'file') {
        this.downloadFile(file.content, file.path);
      }
    });
  }

  private static downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public static async publishProject(project: GeneratedProject): Promise<{ success: boolean; url?: string }> {
    try {
      // This would integrate with your actual publishing service
      // For now, we'll simulate a successful publish
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const projectUrl = `https://hyperionkit.xyz/projects/${project.id}`;
      
      return {
        success: true,
        url: projectUrl
      };
    } catch (error) {
      console.error('Publish failed:', error);
      return {
        success: false
      };
    }
  }

  public static saveToLocalStorage(project: GeneratedProject): void {
    try {
      localStorage.setItem('hyperion_current_project', JSON.stringify(project));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  public static loadFromLocalStorage(): GeneratedProject | null {
    try {
      const stored = localStorage.getItem('hyperion_current_project');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  public static clearLocalStorage(): void {
    try {
      localStorage.removeItem('hyperion_current_project');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}
