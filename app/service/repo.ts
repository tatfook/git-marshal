import { Service } from 'egg';
import { REPO_PREFIX } from '../common/const/redis';
import * as _ from 'lodash';

export default class RepoService extends Service {
    async createRepo(userId: number, repoName: string) {
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
        this.cacheRepoByPath(repo);
        return repo;
    }

    private buildRepoPath(space, repoName) {
        return space.name + '/' + repoName;
    }

    // input: /a/b/c or a/b/c
    // return: a/b
    private getRepoPath(filePath: string) {
        const arr = _.trim(filePath, ' /').split('/');
        if (arr.length > 2) return arr[0] + '/' + arr[1]; // tslint:disable-line
    }

    async getRepoByFilePath(filePath: string) {
        const { ctx } = this;
        const path = this.getRepoPath(filePath);
        if (!path) return this.ctx.throw('invalid file path');
        let repo = await this.getCachedRepoByPath(path);
        if (!repo) {
            repo = await ctx.model.Repo.findOne({ where: { path } });
            if (!repo) return this.ctx.throw('repo not found');
            this.cacheRepoByPath(repo);
        }
        return repo;
    }

    public async cacheRepoByPath(repo) {
        // cache for 24 hours
        return this.app.redis.set(REPO_PREFIX + repo.path, JSON.stringify(repo), 'EX', 3600 * 24); // tslint:disable-line
    }

    public async getCachedRepoByPath(repoPath: string) {
        const jsonStr = await this.app.redis.get(REPO_PREFIX + repoPath);
        if (jsonStr) return JSON.parse(jsonStr);
    }
}
