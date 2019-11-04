import { Service } from 'egg';
import * as _ from 'lodash';
import { ICommitFile, ECommitAction, ICommitter } from '../../typings/custom/api';
import { IRepo, IGuard } from '../../typings/custom/model';

export default class FileService extends Service {
    public async upsertFile(fileFullPath: string, content: string, committer?: ICommitter) {
        const { repo, guard, filePath } = await this.getDataFromFilePath(fileFullPath);
        return this.app.api.guard.upsertFile(guard.url, repo.path, filePath, content, committer);
    }

    public async deleteFile(fileFullPath: string, committer?: ICommitter) {
        const { repo, guard, filePath } = await this.getDataFromFilePath(fileFullPath);
        return this.app.api.guard.deleteFile(guard.url, repo.path, filePath, committer);
    }

    // Waring: make sure the file path is full, eg: space/repo/file.txt
    public async moveFile(fileFullPath: string, newFileFullPath: string, committer?: ICommitter) {
        const { ctx } = this;
        const { repo, guard, filePath } = await this.getDataFromFilePath(fileFullPath);
        if (_.startsWith(newFileFullPath, repo.path)) {
            const newFilePath = newFileFullPath.slice(repo.path.length + 1);
            if (!newFilePath) this.ctx.throw('invalid new file path');
            const file = await this.app.api.guard.getFileInfo(guard.url, repo.path, filePath);
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
            return ctx.app.api.guard.commitFiles(guard.url, repo.path, files, committer);
        } else {
            return ctx.throw('only support moving files in the same repo');
        }
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

    private async getDataFromFilePath(fileFullPath: string): Promise<{ repo: IRepo; guard: IGuard; filePath: string }> {
        const { ctx } = this;
        fileFullPath = _.trim(fileFullPath, ' /');
        const repo = await ctx.service.repo.getRepoByFullPath(fileFullPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        const filePath = fileFullPath.slice(repo.path.length + 1);
        if (!filePath) this.ctx.throw('invalid file path');

        return { repo, guard, filePath };
    }
}
