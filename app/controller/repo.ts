import { Controller } from 'egg';

export default class RepoController extends Controller {
    public async create() {
        const { ctx } = this;
        const { space, name } = ctx.params;
        ctx.body = await ctx.service.repo.createRepo(space, name);
    }

    public async download() {
        const { ctx } = this;
        const { repoPath, ref } = ctx.params;
        ctx.body = await ctx.service.repo.downloadRepo(repoPath, ref);
    }

    public async show() {
        const { ctx } = this;
        const { repoPath } = ctx.params;
        ctx.body = await ctx.service.repo.getRepoByPath(repoPath);
    }

    public async destroy() {
        const { ctx } = this;
        const { repoPath } = ctx.params;
        ctx.body = await ctx.service.repo.deleteRepo(repoPath);
    }

    public async rename() {
        const { ctx } = this;
        const { repoPath, newRepoName } = ctx.params;
        ctx.body = await ctx.service.repo.renameRepo(repoPath, newRepoName);
    }
}
