import { default as axios } from 'axios';
import * as _ from 'lodash';
import { IGuardAPI, ICommitFile, IFileInfo, IGitObject, ICommitInfo, ICommitter } from '../../../typings/custom/api';

const downloadRepo = async (baseUrl: string, repoPath: string, ref?: string): Promise<string> => {
    const result = await axios.get(`${baseUrl}/file/archive`, {
        params: {
            repopath: repoPath,
            ref,
        },
        responseType: 'stream',
    });
    return result.data;
};

const deleteRepo = async (baseUrl: string, repoPath: string) => {
    const result = await axios.delete(`${baseUrl}/repo`, {
        data: {
            repopath: repoPath,
        },
    });
    return result.data;
};

const renameRepo = async (baseUrl: string, repoPath: string, newRepoPath: string) => {
    const result = await axios.post(`${baseUrl}/repo/rename`, {
        oldRepoPath: repoPath,
        newRepoPath,
    });
    return result.data;
};

const syncGitlabRepo = async (baseUrl: string, repoPath: string, gitlabRepoUrl: string, forceSync: boolean = false) => {
    const result = await axios.post(`${baseUrl}/repo/sync`, {
        repopath: repoPath,
        gitlabRepoUrl,
        forceSync,
    });
    return result.data;
};

const getFileInfo = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<IFileInfo> => {
    const result = await axios.get(`${baseUrl}/file/info`, {
        params: {
            repopath: repoPath,
            filepath: filePath,
            commitId,
        },
    });
    const data: IFileInfo = _.pick(result.data, ['id', 'commitId', 'size', 'binary', 'date', 'committer']);
    return data;
};

const getFileData = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<string> => {
    const result = await axios.get(`${baseUrl}/file`, {
        params: {
            repopath: repoPath,
            filepath: filePath,
            commitId,
        },
    });
    return result.data;
};

const getFileRawData = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<string> => {
    const result = await axios.get(`${baseUrl}/file/raw`, {
        params: {
            repopath: repoPath,
            filepath: filePath,
            commitId,
        },
        responseType: 'stream',
    });
    return result.data;
};

const upsertFile = async (
    baseUrl: string,
    repoPath: string,
    filePath: string,
    content: string,
    encoding: string = 'utf8',
    committer?: ICommitter,
): Promise<string> => {
    const result = await axios.post(`${baseUrl}/file`, {
        repopath: repoPath,
        filepath: filePath,
        encoding,
        content,
        committer,
    });
    return result.data;
};

const deleteFile = async (baseUrl: string, repoPath: string, filePath: string, committer?: ICommitter): Promise<boolean> => {
    const result = await axios.delete(`${baseUrl}/file`, {
        data: {
            repopath: repoPath,
            filepath: filePath,
            committer,
        },
    });
    return result.data;
};

const getFileHistory = async (baseUrl: string, repoPath: string, filePath: string, commitId?: string): Promise<ICommitInfo[]> => {
    const result = await axios.get(`${baseUrl}/file/history`, {
        params: {
            repopath: repoPath,
            filepath: filePath,
            commitId,
        },
    });
    return result.data;
};

const commitFiles = async (baseUrl: string, repoPath: string, files: ICommitFile[], committer?: ICommitter) => {
    const result = await axios.post(`${baseUrl}/file/commit`, {
        repopath: repoPath,
        files,
        committer,
    });
    return result.data;
};

const getFilesUnderFolder = async (
    baseUrl: string,
    repoPath: string,
    folderPath: string,
    recursive?: boolean,
    commitId?: string,
    ref?: string,
): Promise<IGitObject[]> => {
    const result = await axios.get(`${baseUrl}/file/tree`, {
        params: {
            repopath: repoPath,
            filepath: folderPath,
            recursive,
            commitId,
            ref,
        },
    });
    return result.data;
};

const getCommitInfo = async (baseUrl: string, repoPath: string, commitId?: string, ref?: string): Promise<ICommitInfo> => {
    const result = await axios.get(`${baseUrl}/repo/commitInfo`, {
        params: {
            repopath: repoPath,
            commitId,
            ref,
        },
    });
    return result.data;
};

export default {
    downloadRepo,
    deleteRepo,
    renameRepo,
    syncGitlabRepo,
    getFileInfo,
    getFileData,
    getFileRawData,
    upsertFile,
    deleteFile,
    getFileHistory,
    commitFiles,
    getFilesUnderFolder,
    getCommitInfo,
} as IGuardAPI;
