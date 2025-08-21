export interface ProjectFile {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

export interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  createdAt: Date;
  htmlContent: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

export interface AppState {
  currentProject: GeneratedProject | null;
  chatMessages: ChatMessage[];
  isGenerating: boolean;
  selectedModel: string;
  error: string | null;
}

export interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  children?: FileStructure[];
  content?: string;
}
