export enum ECommitAction {
    UPSERT = 'upsert',
    REMOVE = 'remove',
}

export interface ICommitFile {
    action: ECommitAction;
    path: string;
    id: string;
}

export interface ICommitter {
    name: string;
    email?: string;
}

export interface IFileInfo {
    id: string;
    commitId: string;
    size: number;
    binary: boolean;
    date: string;
    committer: ICommitter;
}

export interface IGitObject {
    id: string;
    name: string;
    path: string;
    isTree: boolean;
    isBlob: boolean;
    children?: IGitObject[];
}

export interface IHistoryInfo {
    commitId: string;
    date: string;
    message: string;
    committer: ICommitter;
}

export interface IGuardAPI {
    downloadRepo(baseUrl: string, repoPath: string, ref?: string): Promise<string>;
    deleteRepo(baseUrl: string, repoPath: string);
    renameRepo(baseUrl: string, repoPath: string, newRepoPath: string);
    syncGitlabRepo(baseUrl: string, repoPath: string, gitlabRepoUrl: string, forceSync?: boolean);
    getFileInfo(baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<IFileInfo>;
    getFileRawData(baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<string>;
    upsertFile(baseUrl: string, repoPath: string, filePath: string, content: string, committer?: ICommitter): Promise<string>;
    deleteFile(baseUrl: string, repoPath: string, filePath: string, committer?: ICommitter): Promise<boolean>;
    getFileHistory(baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<IHistoryInfo[]>;
    commitFiles(baseUrl: string, repoPath: string, files: ICommitFile[], committer?: ICommitter): Promise<boolean>;
    getFilesUnderFolder(baseUrl: string, repoPath: string, folderPath: string, recursive?: boolean, ref?: string): Promise<IGitObject[]>;
}

export interface IAPI {
    guard: IGuardAPI;
}
