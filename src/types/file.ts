// File related types

export interface FileInfo {
  file_id: string;
  file_name: string;
  file_size: number;
  file_url: string;
  uploaded_at: string;
  user_id: string;
}

export interface FileUploadResponse {
  file_id: string;
  file_url: string;
  message: string;
}

export interface FileState {
  files: FileInfo[];
  loading: boolean;
  uploadFile: (file: File) => Promise<void>;
  fetchFiles: () => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
}
