import { Service } from 'egg';
import * as _ from 'lodash';
import API from '../common/api';
import { ICommitFile, ECommitAction, ICommitter } from '../../typings/custom/api';

export default class FileService extends Service {
    public async upsertFile(repoPath: string, filePath: string, content: string, encoding?: string, committer?: ICommitter) {
        const { ctx } = this;
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        filePath = _.trim(filePath, ' /');
        return API.guard.upsertFile(guard.url, repo.path, filePath, content, encoding, committer);
    }

    public async deleteFile(repoPath: string, filePath: string, committer?: ICommitter) {
        const { ctx } = this;
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        filePath = _.trim(filePath, ' /');
        return API.guard.deleteFile(guard.url, repo.path, filePath, committer);
    }

    public async moveFile(repoPath: string, filePath: string, newFilePath: string, committer?: ICommitter) {
        const { ctx } = this;
        if (!newFilePath) ctx.throw('invalid new file path');
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        filePath = _.trim(filePath, ' /');
        newFilePath = _.trim(newFilePath, ' /');
        const file = await API.guard.getFileInfo(guard.url, repo.path, filePath);
        const files: ICommitFile[] = [
            {
                action: ECommitAction.UPSERT,
                path: newFilePath,
                id: file.id,
            },
            {
                action: ECommitAction.REMOVE,
                path: filePath,
                id: file.id,
            },
        ];
        return API.guard.commitFiles(guard.url, repo.path, files, committer);
    }

    public async getFileHistory(repoPath: string, filePath: string, commitId?: string) {
        const { ctx } = this;
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        filePath = _.trim(filePath, ' /');
        return API.guard.getFileHistory(guard.url, repo.path, filePath, commitId);
    }

    public async getFileInfo(repoPath: string, filePath: string, commitId?: string) {
        const { ctx } = this;
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        filePath = _.trim(filePath, ' /');
        return API.guard.getFileInfo(guard.url, repo.path, filePath, commitId);
    }

    public async getFileRawData(repoPath: string, filePath: string, commitId?: string) {
        const { ctx } = this;
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        filePath = _.trim(filePath, ' /');
        return API.guard.getFileRawData(guard.url, repo.path, filePath, commitId);
    }
}
