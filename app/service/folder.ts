import { Service } from 'egg';
import * as _ from 'lodash';
import { KEEP } from '../common/const/git';
import { ICommitFile, ECommitAction } from '../../typings/custom/api';

export default class FolderService extends Service {
    public async createFolder(folderFullPath: string) {
        const { ctx } = this;
        const filePath = _.trim(folderFullPath, ' /') + '/' + KEEP;
        return ctx.service.file.upsertFile(filePath, '');
    }

    public async getFiles(folderFullPath: string, recursive: boolean = false) {
        const { ctx } = this;
        const { repo, guard, folderPath } = await this.getDataFromFolderPath(folderFullPath);
        return ctx.app.api.guard.getFilesUnderFolder(guard.url, repo.path, folderPath, recursive);
    }

    // public async moveFolder(folderPath: string, newFoldPath: string) {
    //      // move all files from one to the other folder
    // }

    public async deleteFolder(folderFullPath: string) {
        // delete all files
        const { ctx } = this;
        const { repo, guard, folderPath } = await this.getDataFromFolderPath(folderFullPath);
        const folderFiles = await ctx.app.api.guard.getFilesUnderFolder(guard.url, repo.path, folderPath, true);
        const files: ICommitFile[] = folderFiles
            .filter(file => file.isBlob)
            .map(file => {
                return {
                    action: ECommitAction.REMOVE,
                    path: file.path,
                    id: file.id,
                } as ICommitFile;
            });
        return ctx.app.api.guard.commitFiles(guard.url, repo.path, files);
    }

    private async getDataFromFolderPath(folderFullPath: string) {
        const { ctx } = this;
        folderFullPath = _.trim(folderFullPath, ' /');
        const repo = await ctx.service.repo.getRepoByFullPath(folderFullPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        const folderPath = folderFullPath.slice(repo.path.length + 1);
        return { repo, guard, folderPath };
    }
}
