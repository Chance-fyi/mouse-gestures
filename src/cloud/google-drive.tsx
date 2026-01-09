import { requestPermissions } from "~utils/common"

export class GoogleDrive {
  name: string = "Google Drive"

  private async getToken(interactive = true): Promise<string> {
    return new Promise((resolve, reject) => {
      requestPermissions(["identity"]).then(() => {
        chrome.identity.getAuthToken({ interactive }, (token) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
          else resolve(token)
        })
      })
    })
  }

  async uploadFile(filename: string, content: string | Blob): Promise<string> {
    const token = await this.getToken()
    const metadata = {
      name: filename,
      parents: ["appDataFolder"]
    }

    const form = new FormData()
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    )
    if (typeof content === "string") {
      form.append(
        "file",
        new Blob([content], { type: "application/octet-stream" })
      )
    } else {
      form.append("file", content)
    }

    const res = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form
      }
    )
    const data = await res.json()
    if (!data.id) throw new Error("Upload failed")
    return data.id
  }

  async listFiles(pageSize = 20): Promise<Array<{ id: string; name: string }>> {
    const token = await this.getToken()
    let pageToken: string | undefined = undefined
    const allFiles: Array<{ id: string; name: string }> = []

    while (true) {
      const url = new URL("https://www.googleapis.com/drive/v3/files")
      url.searchParams.set("pageSize", String(pageSize))
      url.searchParams.set("spaces", "appDataFolder")
      url.searchParams.set("fields", "nextPageToken, files(id,name)")
      if (pageToken) url.searchParams.set("pageToken", pageToken)

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()

      if (data.files) allFiles.push(...data.files)

      if (!data.nextPageToken) break
      pageToken = data.nextPageToken
    }

    return allFiles
  }

  async downloadFile(fileId: string): Promise<Blob> {
    const token = await this.getToken()
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(`Download failed: ${res.status}`)
    return await res.blob()
  }

  async deleteFile(fileId: string): Promise<void> {
    const token = await this.getToken()
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}`
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
  }
}
