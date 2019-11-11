import { Controller } from 'egg';

export default class RepoController extends Controller {
    public async create() {
        const { userId, name } = this.ctx.params;
        this.ctx.body = await this.ctx.service.repo.createRepo(userId, name);
    }

    public async download() {
        const { repoPath, ref } = this.ctx.params;
        this.ctx.body = await this.ctx.service.repo.downloadRepo(repoPath, ref);
    }
}
