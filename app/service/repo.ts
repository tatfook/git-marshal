import { Service } from 'egg';
import * as _ from 'lodash';
import API from '../common/api';

export default class RepoService extends Service {
    public async createRepo(spaceName: string, repoName: string) {
        const { ctx } = this;
        const guard = await ctx.service.guard.getGuardWithLessRepos();
        const repo = await ctx.model.Repo.create({
            guardId: guard.id,
            space: spaceName,
            name: repoName,
            path: this.buildRepoPath(spaceName, repoName),
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

    public async deleteRepo(repoPath: string) {
        const { ctx } = this;
        const repo = await this.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        await API.guard.deleteRepo(guard.url, repo.path);
        return repo.destroy();
    }

    public async renameRepo(repoPath, newRepoName) {
        const { ctx } = this;
        const repo = await this.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        const newRepoPath = this.buildRepoPath(repo.space, newRepoName);
        await API.guard.renameRepo(guard.url, repoPath, newRepoPath);
        return repo.update({ path: newRepoPath, name: newRepoName });
    }

    public async syncGitlabRepo(repoPath: string, gitlabRepoUrl: string) {
        const { ctx } = this;
        const repo = await this.getRepoByPath(repoPath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        return API.guard.syncGitlabRepo(guard.url, repo.path, gitlabRepoUrl);
    }

    private buildRepoPath(spaceName: string, repoName: string) {
        return spaceName + '/' + repoName;
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
