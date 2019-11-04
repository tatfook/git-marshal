import { Service } from 'egg';
import * as _ from 'lodash';
import { KEEP } from '../common/const/git';
import { ICommitFile, ECommitAction, IGitObject, ICommitter } from '../../typings/custom/api';
import { IRepo, IGuard } from '../../typings/custom/model';

export default class FolderService extends Service {
    public async createFolder(folderFullPath: string, committer?: ICommitter) {
        const { ctx } = this;
        const filePath = _.trim(folderFullPath, ' /') + '/' + KEEP;
        return ctx.service.file.upsertFile(filePath, '', committer);
    }

    public async getFiles(folderFullPath: string, recursive: boolean = false) {
        const { ctx } = this;
        const { repo, guard, folderPath } = await this.getDataFromFolderPath(folderFullPath);
        return ctx.app.api.guard.getFilesUnderFolder(guard.url, repo.path, folderPath, recursive);
    }

    // Warning: will overwrite files under new folder
    public async moveFolder(folderFullPath: string, newFoldFullPath: string, committer?: ICommitter) {
        // move all files and sub holders from one to the other folder
        const { ctx } = this;
        const { repo, guard, folderPath } = await this.getDataFromFolderPath(folderFullPath);
        const folderFiles = await ctx.app.api.guard.getFilesUnderFolder(guard.url, repo.path, folderPath, true);
        if (_.startsWith(newFoldFullPath, repo.path)) {
            let newFolderPath = newFoldFullPath.slice(repo.path.length + 1);
            if (folderPath === '') newFolderPath = newFolderPath + '/'; // eg: abc.txt => files/abc.txt
            const files: ICommitFile[] = this.genMovingFilesCommands(folderFiles, folderPath, newFolderPath);
            return ctx.app.api.guard.commitFiles(guard.url, repo.path, files, committer);
        } else {
            return ctx.throw('Only support moving folders in the same repo');
        }
    }

    public async deleteFolder(folderFullPath: string, committer?: ICommitter) {
        // delete all files under the folder and sub holders
        const { ctx } = this;
        const { repo, guard, folderPath } = await this.getDataFromFolderPath(folderFullPath);
        const folderFiles = await ctx.app.api.guard.getFilesUnderFolder(guard.url, repo.path, folderPath, true);
        const files: ICommitFile[] = this.genDeletingFilesCommands(folderFiles);
        return ctx.app.api.guard.commitFiles(guard.url, repo.path, files, committer);
    }

    private async getDataFromFolderPath(folderFullPath: string): Promise<{ repo: IRepo; guard: IGuard; folderPath: string }> {
        const { ctx } = this;
        folderFullPath = _.trim(folderFullPath, ' /');
        const repo = await ctx.service.repo.getRepoByFullPath(folderFullPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        const folderPath = folderFullPath.slice(repo.path.length + 1);
        return { repo, guard, folderPath };
    }

    private genMovingFilesCommands(folderFiles: IGitObject[], folderPath: string, newFolderPath: string): ICommitFile[] {
        const files = folderFiles.map((file): ICommitFile[] => {
            if (file.isTree) {
                return this.genMovingFilesCommands(file.children || [], folderPath, newFolderPath); // handling sub folder
            } else {
                return [
                    {
                        action: ECommitAction.UPSERT,
                        path: _.replace(file.path, folderPath, newFolderPath), // new file path
                        id: file.id,
                    },
                    {
                        action: ECommitAction.REMOVE,
                        path: file.path,
                        id: file.id,
                    },
                ];
            }
        });
        return _.flatten(files);
    }

    private genDeletingFilesCommands(folderFiles: any[]): ICommitFile[] {
        const files = folderFiles.map((file): ICommitFile | ICommitFile[] => {
            if (file.isTree) {
                return this.genDeletingFilesCommands(file.children); // handling sub folder
            } else {
                return {
                    action: ECommitAction.REMOVE,
                    path: file.path,
                    id: file.id,
                };
            }
        });
        return _.flatten(files);
    }
}
