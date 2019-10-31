import { Controller } from 'egg';

export default class FolderController extends Controller {
    public async create() {
        const { path } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.createFolder(path);
    }

    public async files() {
        const { path } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.getFiles(path);
    }

    public async destroy() {
        const { path } = this.ctx.params;
        this.ctx.body = await this.ctx.service.folder.deleteFolder(path);
    }
}