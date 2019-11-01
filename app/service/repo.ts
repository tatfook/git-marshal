import { Service } from 'egg';
import * as _ from 'lodash';
import { ISpace } from '../../typings/custom/model';

export default class RepoService extends Service {
    public async createRepo(userId: number, repoName: string) {
        const { ctx } = this;
        const space = await ctx.service.space.findByUserId(userId);
        const guard = await ctx.service.guard.getRandomGuard();
        const repo = await ctx.model.Repo.create({
            guardId: guard.id,
            spaceId: space.id,
            name: repoName,
            path: this.buildRepoPath(space, repoName),
        });
        if (!repo) ctx.throw('Failed to create repo');
        ctx.model.Repo.cacheRepoByPath(repo);
        return repo;
    }

    public async downloadRepo(repoPath: string, ref?: string) {
        const { ctx } = this;
        const repo = await this.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        return this.app.api.guard.downloadRepo(guard.url, repo.path, ref);
    }

    private buildRepoPath(space: ISpace, repoName: string) {
        return space.name + '/' + repoName;
    }

    // filePath: /a/b/c or a/b/c
    // return: a/b
    private getRepoPath(filePath: string) {
        const arr = _.trim(filePath, ' /').split('/');
        if (arr.length > 1) return arr[0] + '/' + arr[1];
    }

    public async getRepoByFullPath(fullPath: string) {
        const { ctx } = this;
        const repoPath = this.getRepoPath(fullPath);
        if (!repoPath) return ctx.throw('invalid file path');
        return await this.getRepoByPath(repoPath);
    }

    public async getRepoByPath(repoPath: string) {
        const { ctx } = this;
        let repo = await ctx.model.Repo.getCachedRepoByPath(repoPath);
        if (!repo) {
            repo = await ctx.model.Repo.findOne({ where: { path: repoPath } });
            if (!repo) return ctx.throw('repo not found');
            ctx.model.Repo.cacheRepoByPath(repo);
        }
        return repo;
    }
}
