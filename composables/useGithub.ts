import { Octokit } from '@octokit/rest'

export class GitHubService {
  private octokit: Octokit

  constructor() {
    const config = useRuntimeConfig()

    const token = config.public.githubToken
    this.octokit = new Octokit({
      auth: token,
    })
  }

  async getFileContent(owner: string, repo: string, path: string, ref?: string) {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref, // branch/commit SHA (optional)
      })

      if (Array.isArray(response.data)) {
        throw new TypeError('Path points to a directory, not a file')
      }

      if (response.data.type !== 'file') {
        throw new Error('Path does not point to a file')
      }

      // Decode base64 content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8')

      return {
        content,
        sha: response.data.sha,
        size: response.data.size,
        downloadUrl: response.data.download_url,
      }
    }
    catch (error) {
      console.error('Error fetching file:', error)
      throw error
    }
  }

  async getDirectoryContents(owner: string, repo: string, path: string = '') {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      })

      if (!Array.isArray(response.data)) {
        throw new TypeError('Path points to a file, not a directory')
      }

      return response.data.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        sha: item.sha,
        downloadUrl: item.download_url,
      }))
    }
    catch (error) {
      console.error('Error fetching directory:', error)
      throw error
    }
  }
}
