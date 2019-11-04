import { Controller } from 'egg';

export default class FileController extends Controller {
    public async upsert() {
        const { path, content, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.upsertFile(path, content, { name: committer });
    }

    public async history() {
        const { path, commitId } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.getFileHistory(path, commitId);
    }

    public async raw() {
        const { path, commitId } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.getFileRawData(path, commitId);
    }

    public async show() {
        const { path, commitId } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.getFileInfo(path, commitId);
    }

    public async destroy() {
        const { path, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.deleteFile(path, { name: committer });
    }

    public async move() {
        const { path, newPath, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.moveFile(path, newPath, { name: committer });
    }
}
