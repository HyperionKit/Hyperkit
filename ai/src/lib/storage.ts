import { ProjectFile } from './prompt-new'

// In-memory storage for built projects
export const projectStorage = new Map<string, { files: ProjectFile[], timestamp: number }>()

// Clean up old projects (older than 1 hour)
export function cleanupOldProjects() {
  const oneHour = 60 * 60 * 1000
  const now = Date.now()
  
  for (const [projectId, project] of projectStorage.entries()) {
    if (now - project.timestamp > oneHour) {
      projectStorage.delete(projectId)
    }
  }
}
