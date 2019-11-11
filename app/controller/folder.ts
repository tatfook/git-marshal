import { Controller } from 'egg';
import { DEFAULT_COMMITTER } from '../common/const/git';

export default class FolderController extends Controller {
    public async create() {
        const { repoPath, folderPath, committer = DEFAULT_COMMITTER } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.createFolder(repoPath, folderPath, { name: committer });
    }

    public async files() {
        const { repoPath, folderPath, recursive } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.getFiles(repoPath, folderPath, recursive);
    }

    public async destroy() {
        const { repoPath, folderPath, committer = DEFAULT_COMMITTER } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.deleteFolder(repoPath, folderPath, { name: committer });
    }

    public async move() {
        const { repoPath, folderPath, newFolderPath, committer = DEFAULT_COMMITTER } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.moveFolder(repoPath, folderPath, newFolderPath, { name: committer });
    }
}
