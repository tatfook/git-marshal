import { Controller } from 'egg';

export default class FileController extends Controller {
    public async upsert() {
        const { repoPath, filePath, content, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.upsertFile(repoPath, filePath, content, { name: committer });
    }

    public async history() {
        const { repoPath, filePath, commitId } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.getFileHistory(repoPath, filePath, commitId);
    }

    public async raw() {
        const { repoPath, filePath, commitId } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.getFileRawData(repoPath, filePath, commitId);
    }

    public async show() {
        const { repoPath, filePath, commitId } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.getFileInfo(repoPath, filePath, commitId);
    }

    public async destroy() {
        const { repoPath, filePath, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.deleteFile(repoPath, filePath, { name: committer });
    }

    public async move() {
        const { repoPath, filePath, newFilePath, committer } = this.ctx.params;
        this.ctx.body = await this.ctx.service.file.moveFile(repoPath, filePath, newFilePath, { name: committer });
    }
}
