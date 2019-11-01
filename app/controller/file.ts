import { Controller } from 'egg';

export default class FileController extends Controller {
    public async upsert() {
        const { path, content } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.upsertFile(path, content);
    }

    public async history() {
        const { path, commitId } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.getFileHistory(path, commitId);
    }

    public async raw() {
        const { path, commitId } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.getFileRawData(path, commitId);
    }

    public async destroy() {
        const { path } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.deleteFile(path);
    }
}
