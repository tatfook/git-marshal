import { Application } from 'egg';
import { IGuardAPI, ICommitFile, IFileInfo, IGitObject, IHistoryInfo, ICommitter } from '../../../typings/custom/api';

const buildGuardAPI = (app: Application): IGuardAPI => {
    const getFileInfo = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<IFileInfo> => {
        const result = await app.curl(`${baseUrl}/file`, {
            dataType: 'json',
            data: {
                repopath: repoPath,
                filepath: filePath,
                commitId,
            },
        });
        return result.data;
    };

    const getFileRawData = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<string> => {
        const result = await app.curl(`${baseUrl}/file/raw`, {
            data: {
                repopath: repoPath,
                filepath: filePath,
                commitId,
            },
        });
        return result.data;
    };

    const upsertFile = async (baseUrl: string, repoPath: string, filePath: string, content: string, committer?: ICommitter): Promise<string> => {
        const result = await app.curl(`${baseUrl}/file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                repopath: repoPath,
                filepath: filePath,
                encoding: 'utf8',
                content,
                committer,
            },
        });
        return result.data;
    };

    const deleteFile = async (baseUrl: string, repoPath: string, filePath: string, committer?: ICommitter): Promise<boolean> => {
        const result = await app.curl(`${baseUrl}/file`, {
            method: 'DELETE',
            data: {
                repopath: repoPath,
                filepath: filePath,
                committer,
            },
        });
        return result.data;
    };

    const getFileHistory = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<IHistoryInfo[]> => {
        const result = await app.curl(`${baseUrl}/file/history`, {
            dataType: 'json',
            data: {
                repopath: repoPath,
                filepath: filePath,
                commitId,
            },
        });
        return result.data;
    };

    const downloadRepo = async (baseUrl: string, repoPath: string, ref?: string): Promise<string> => {
        const result = await app.curl(`${baseUrl}/file/archive`, {
            data: {
                repopath: repoPath,
                ref,
            },
        });
        return result.data;
    };

    const commitFiles = async (baseUrl: string, repoPath: string, files: ICommitFile[], committer?: ICommitter) => {
        const result = await app.curl(`${baseUrl}/file/commit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                repopath: repoPath,
                files,
                committer,
            },
        });
        return result.data;
    };

    const getFilesUnderFolder = async (baseUrl: string, repoPath: string, folderPath: string, recursive: boolean = false): Promise<IGitObject[]> => {
        const result = await app.curl(`${baseUrl}/file/tree`, {
            dataType: 'json',
            data: {
                repopath: repoPath,
                filepath: folderPath,
                recursive,
            },
        });
        return result.data;
    };

    return {
        getFileInfo,
        getFileRawData,
        upsertFile,
        deleteFile,
        getFileHistory,
        downloadRepo,
        commitFiles,
        getFilesUnderFolder,
    };
};

export default buildGuardAPI;
