import { Controller } from 'egg';

export default class FolderController extends Controller {
    public async create() {
        const { path, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.createFolder(path, { name: committer });
    }

    public async files() {
        const { path, recursive } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.getFiles(path, recursive);
    }

    public async destroy() {
        const { path, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.deleteFolder(path, { name: committer });
    }

    public async move() {
        const { path, newPath, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.moveFolder(path, newPath, { name: committer });
    }
}
