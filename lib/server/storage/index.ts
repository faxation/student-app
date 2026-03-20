import path from "path";
import fs from "fs/promises";

export interface StorageAdapter {
  upload(key: string, buffer: Buffer, contentType: string): Promise<string>;
  getUrl(key: string): string;
  delete(key: string): Promise<void>;
}

/**
 * Local filesystem adapter for V1 dev.
 * Swap this with an S3/GCS adapter for production.
 */
class LocalStorageAdapter implements StorageAdapter {
  private baseDir: string;

  constructor() {
    this.baseDir = process.env.UPLOAD_DIR || "./uploads";
  }

  async upload(key: string, buffer: Buffer, _contentType: string) {
    const filePath = path.join(this.baseDir, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    return key;
  }

  getUrl(key: string) {
    return `/api/files/${key}`;
  }

  async delete(key: string) {
    const filePath = path.join(this.baseDir, key);
    await fs.unlink(filePath).catch(() => {});
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();
