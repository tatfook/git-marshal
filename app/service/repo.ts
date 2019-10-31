import { Service } from 'egg';
import * as _ from 'lodash';
import { REPO_PREFIX } from '../common/const/redis';
import { IRepo, ISpace } from '../common/interface/model';

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
        this.cacheRepoByPath(repo);
        return repo;
    }

    public async downloadRepo(repoPath: string, ref?: string) {
        const { ctx } = this;
        const repo = await this.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        const result = await this.ctx.curl(`${guard.url}/file/archive`, {
            data: {
                repopath: repo.path,
                ref,
            },
        });
        return result.data;
    }

    private buildRepoPath(space: ISpace, repoName: string) {
        return space.name + '/' + repoName;
    }

    // filePath: /a/b/c or a/b/c
    // return: a/b
    public getRepoPath(filePath: string) {
        const arr = _.trim(filePath, ' /').split('/');
        if (arr.length > 1) return arr[0] + '/' + arr[1];
    }

    public async getRepoByFullPath(fullPath: string) {
        const repoPath = this.getRepoPath(fullPath);
        if (!repoPath) return this.ctx.throw('invalid file path');
        return await this.getRepoByPath(repoPath);
    }

    public async getRepoByPath(repoPath: string) {
        let repo = await this.getCachedRepoByPath(repoPath);
        if (!repo) {
            repo = await this.ctx.model.Repo.findOne({ where: { path: repoPath } });
            if (!repo) return this.ctx.throw('repo not found');
            this.cacheRepoByPath(repo);
        }
        return repo;
    }

    public async cacheRepoByPath(repo: IRepo) {
        // cache for 24 hours
        return this.app.redis.set(REPO_PREFIX + repo.path, JSON.stringify(repo), 'EX', 3600 * 24); // tslint:disable-line
    }

    public async getCachedRepoByPath(repoPath: string) {
        const jsonStr = await this.app.redis.get(REPO_PREFIX + repoPath);
        if (jsonStr) {
            const jsonData = JSON.parse(jsonStr);
            return this.ctx.model.Repo.build(jsonData);
        }
        return null;
    }
}
