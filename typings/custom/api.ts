export enum ECommitAction {
    UPSERT = 'upsert',
    REMOVE = 'remove',
}

export interface ICommitFile {
    action: ECommitAction;
    path: string;
    id: number;
}

export interface IGuardAPI {
    getFileInfo(baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<any>;
    getFileRawData(baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<any>;
    upsertFile(baseUrl: string, repoPath: string, filePath: string, content: string): Promise<any>;
    deleteFile(baseUrl: string, repoPath: string, filePath: string): Promise<any>;
    getFileHistory(baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<any>;
    downloadRepo(baseUrl: string, repoPath: string, ref?: string): Promise<any>;
    commitFiles(baseUrl: string, repoPath: string, files: ICommitFile[]): Promise<any>;
    getFilesUnderFolder(baseUrl: string, repoPath: string, folderPath: string, recursive: boolean): Promise<any>;
}

export interface IAPI {
    guard: IGuardAPI;
}
