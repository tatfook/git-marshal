import { Service } from 'egg';
import * as _ from 'lodash';
import API from '../common/api';
import { ISpace } from '../../typings/custom/model';

export default class RepoService extends Service {
    public async createRepo(userId: number, repoName: string) {
        const { ctx } = this;
        const space = await ctx.service.space.findByUserId(userId);
        const guard = await ctx.service.guard.getGuardWithLessRepos();
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
        return API.guard.downloadRepo(guard.url, repo.path, ref);
    }

    private buildRepoPath(space: ISpace, repoName: string) {
        return space.name + '/' + repoName;
    }

    public async getRepoByPath(repoPath: string) {
        const { ctx } = this;
        repoPath = _.trim(repoPath, ' /');
        if (repoPath === '') ctx.throw('repo not found');
        let repo = await ctx.model.Repo.getCachedRepoByPath(repoPath);
        if (!repo) {
            repo = await ctx.model.Repo.findOne({ where: { path: repoPath } });
            if (!repo) return ctx.throw('repo not found');
            ctx.model.Repo.cacheRepoByPath(repo);
        }
        return repo;
    }
}
