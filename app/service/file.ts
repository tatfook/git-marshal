import { Service } from 'egg';
import * as _ from 'lodash';

export default class FileService extends Service {
    public async upsertFile(fileFullPath: string, content: string) {
        const { repo, guard, filePath } = await this.getDataFromFilePath(fileFullPath);
        return this.app.api.guard.upsertFile(guard.url, repo.path, filePath, content);
    }

    public async deleteFile(fileFullPath: string) {
        const { repo, guard, filePath } = await this.getDataFromFilePath(fileFullPath);
        return this.app.api.guard.deleteFile(guard.url, repo.path, filePath);
    }

    public async getFileHistory(fileFullPath: string, commitId?: string) {
        const { repo, guard, filePath } = await this.getDataFromFilePath(fileFullPath);
        return this.app.api.guard.getFileHistory(guard.url, repo.path, filePath, commitId);
    }

    public async getFileInfo(fileFullPath: string, commitId?: string) {
        const { repo, guard, filePath } = await this.getDataFromFilePath(fileFullPath);
        return this.app.api.guard.getFileInfo(guard.url, repo.path, filePath, commitId);
    }

    public async getFileRawData(fileFullPath: string, commitId?: string) {
        const { repo, guard, filePath } = await this.getDataFromFilePath(fileFullPath);
        return this.app.api.guard.getFileRawData(guard.url, repo.path, filePath, commitId);
    }

    private async getDataFromFilePath(fileFullPath: string) {
        const { ctx } = this;
        fileFullPath = _.trim(fileFullPath, ' /');
        const repo = await ctx.service.repo.getRepoByFullPath(fileFullPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        const filePath = fileFullPath.slice(repo.path.length + 1);

        return { repo, guard, filePath };
    }
}
