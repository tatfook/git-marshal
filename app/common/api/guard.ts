import { Application } from 'egg';
import { IGuardAPI, ICommitFile } from '../../../typings/custom/api';

const buildGuardAPI = (app: Application) => {
    const getFileInfo = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string) => {
        const result = await app.curl(`${baseUrl}/file`, {
            data: {
                repopath: repoPath,
                filepath: filePath,
                commitId,
            },
        });
        return result.data;
    };

    const getFileRawData = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string) => {
        const result = await app.curl(`${baseUrl}/file/raw`, {
            data: {
                repopath: repoPath,
                filepath: filePath,
                commitId,
            },
        });
        return result.data;
    };

    const upsertFile = async (baseUrl: string, repoPath: string, filePath: string, content: string) => {
        const result = await app.curl(`${baseUrl}/file`, {
            method: 'POST',
            data: {
                repopath: repoPath,
                filepath: filePath,
                encoding: 'utf8',
                content,
            },
        });
        return result.data;
    };

    const deleteFile = async (baseUrl: string, repoPath: string, filePath: string) => {
        const result = await app.curl(`${baseUrl}/file`, {
            method: 'DELETE',
            data: {
                repopath: repoPath,
                filepath: filePath,
            },
        });
        return result.data;
    };

    const getFileHistory = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string) => {
        const result = await app.curl(`${baseUrl}/file/history`, {
            data: {
                repopath: repoPath,
                filepath: filePath,
                commitId,
            },
        });
        return result.data;
    };

    const downloadRepo = async (baseUrl: string, repoPath: string, ref?: string) => {
        const result = await app.curl(`${baseUrl}/file/archive`, {
            data: {
                repopath: repoPath,
                ref,
            },
        });
        return result.data;
    };

    const commitFiles = async (baseUrl: string, repoPath: string, files: ICommitFile[]) => {
        const result = await app.curl(`${baseUrl}/file/commit`, {
            method: 'POST',
            data: {
                repopath: repoPath,
                files,
            },
        });
        return result.data;
    };

    const getFilesUnderFolder = async (baseUrl: string, repoPath: string, folderPath: string, recursive: boolean = false) => {
        const result = await app.curl(`${baseUrl}/file/tree`, {
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
    } as IGuardAPI;
};

export default buildGuardAPI;