import { Service } from 'egg';
import * as _ from 'lodash';
import { KEEP } from '../common/const/git';

export default class FolderService extends Service {
    public async createFolder(folderPath: string) {
        const { ctx } = this;
        const filePath = _.trim(folderPath, ' /') + '/' + KEEP;
        return ctx.service.file.upsertFile(filePath, '');
    }

    public async getFiles(folderPath: string, recursive: boolean = false) {
        const { ctx } = this;
        folderPath = _.trim(folderPath, ' /');
        const repo = await ctx.service.repo.getRepoByFullPath(folderPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        const folderName = folderPath.slice(repo.path.length + 1);
        const result = await this.ctx.curl(`${guard.url}/file/raw`, {
            data: {
                repopath: repo.path,
                filepath: folderName,
                recursive,
            },
        });
        return result.data;
    }

    // public async moveFolder(folderPath: string, newFoldPath: string) {
    //      // move all files from one to the other folder
    // }

    public async deleteFolder(folderPath: string) {
        // delete all files
        const { ctx } = this;
        const repo = await ctx.service.repo.getRepoByFullPath(folderPath);
        const guard = await ctx.service.guard.findById(repo.guardId);

        const folderFiles = await this.getFiles(folderPath, true);
        const files = folderFiles
            .filter(file => file.isBlob)
            .map(file => {
                return {
                    action: 'delete',
                    path: file.path,
                    id: file.id,
                };
            });

        const result = await this.ctx.curl(`${guard.url}/file/commit`, {
            method: 'POST',
            data: {
                repopath: repo.path,
                files,
            },
        });
        return result.data;
    }
}
