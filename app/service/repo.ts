import { Service } from 'egg';
import { REPO_PREFIX } from '../common/const/redis';

export default class RepoService extends Service {
    async createRepo(userId: number, repoName: string) {
        const { ctx } = this;
        const namespace = await ctx.service.namespace.findByUserId(userId);
        const guard = await ctx.service.guard.getRandomGuard();
        const repo = await ctx.model.Repo.create({
            guardId: guard.id,
            namespaceId: namespace.id,
            name: repoName,
        });
        this.cacheRepo(repo);
        return repo;
    }

    // input: /a/b/c or a/b/c
    // return: a/b
    private getRepoPath(filePath: string) {
        const arr = filePath.trim().split('/');
        if (arr[0] === '') arr.shift();
        if (arr.length < 3) return this.ctx.throw('invalid file path'); // tslint:disable-line
        return arr[0] + '/' + arr[1];
    }

    async getRepoByFilePath(filePath: string) {
        const { ctx } = this;
        const path = this.getRepoPath(filePath);
        let repo = await this.getCachedRepo(path);
        if (!repo) {
            repo = await ctx.model.Repo.findOne({ where: { path } });
            if (!repo) return this.ctx.throw('repo not found');
            this.cacheRepo(repo);
        }
        return repo;
    }

    public async cacheRepo(repo) {
        // cache for 24 hours
        return this.app.redis.set(REPO_PREFIX + repo.path, JSON.stringify(repo), 'EX', 3600 * 24); // tslint:disable-line
    }

    public async getCachedRepo(repoPath: string) {
        const jsonStr = await this.app.redis.get(REPO_PREFIX + repoPath);
        if (jsonStr) return JSON.parse(jsonStr);
    }
}
