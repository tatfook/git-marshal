import { Service } from 'egg';
import * as _ from 'lodash';
import API from '../common/api';
import { KEEP } from '../common/const/git';
import { ICommitFile, ECommitAction, IGitObject, ICommitter } from '../../typings/custom/api';

export default class FolderService extends Service {
    public async createFolder(repoPath: string, folderPath: string, committer?: ICommitter) {
        const filePath = _.trim(folderPath, ' /') + '/' + KEEP;
        return this.ctx.service.file.upsertFile(repoPath, filePath, '', committer);
    }

    public async getFiles(repoPath: string, folderPath: string, recursive: boolean = false, ref: string = 'master') {
        const { ctx } = this;
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        folderPath = _.trim(folderPath, ' /');
        return API.guard.getFilesUnderFolder(guard.url, repo.path, folderPath, recursive, ref);
    }

    // Warning: will overwrite files under new folder
    public async moveFolder(repoPath: string, folderPath: string, newFolderPath: string, committer?: ICommitter) {
        // move all files and sub holders from one to the other folder
        const { ctx } = this;
        if (folderPath === newFolderPath) return ctx.throw('should not move to the same folder');
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        folderPath = _.trim(folderPath, ' /');
        const folderFiles = await API.guard.getFilesUnderFolder(guard.url, repo.path, folderPath, true);

        const files: ICommitFile[] = this.genMovingFilesCommands(folderFiles, folderPath, newFolderPath);
        return API.guard.commitFiles(guard.url, repo.path, files, committer);
    }

    public async deleteFolder(repoPath: string, folderPath: string, committer?: ICommitter) {
        // delete all files under the folder and sub holders
        const { ctx } = this;
        const repo = await ctx.service.repo.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        folderPath = _.trim(folderPath, ' /');
        const folderFiles = await API.guard.getFilesUnderFolder(guard.url, repo.path, folderPath, true);
        const files: ICommitFile[] = this.genDeletingFilesCommands(folderFiles, folderPath);
        return API.guard.commitFiles(guard.url, repo.path, files, committer);
    }

    public genMovingFilesCommands(folderFiles: IGitObject[], folderPath: string, newFolderPath: string): ICommitFile[] {
        if (folderPath === newFolderPath) return [];
        const files = folderFiles.map((file): ICommitFile[] => {
            if (file.isTree) {
                return this.genMovingFilesCommands(file.children || [], folderPath, newFolderPath); // handling sub folder
            } else {
                const oldFilePath = folderPath === '' ? file.path : `${folderPath}/${file.path}`;
                const newFilePath = newFolderPath === '' ? file.path : `${newFolderPath}/${file.path}`;
                return [
                    {
                        action: ECommitAction.UPSERT,
                        path: newFilePath,
                        id: file.id,
                    },
                    {
                        action: ECommitAction.REMOVE,
                        path: oldFilePath,
                        id: file.id,
                    },
                ];
            }
        });
        return _.flatten(files);
    }

    public genDeletingFilesCommands(folderFiles: any[], folderPath: string): ICommitFile[] {
        const files = folderFiles.map((file): ICommitFile | ICommitFile[] => {
            if (file.isTree) {
                return this.genDeletingFilesCommands(file.children || [], folderPath); // handling sub folder
            } else {
                const fileFullPath = folderPath === '' ? file.path : `${folderPath}/${file.path}`;
                return {
                    action: ECommitAction.REMOVE,
                    path: fileFullPath,
                    id: file.id,
                };
            }
        });
        return _.flatten(files);
    }
}
