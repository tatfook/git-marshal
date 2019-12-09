import { Controller } from 'egg';

export default class RepoController extends Controller {
    /**
     * POST /repos (create repo)
     * @param {string} space repo namespace
     * @param {string} name repo name
     * @returns commit id
     */
    public async create() {
        const { ctx } = this;
        const { space, name } = ctx.params;
        ctx.validate({
            space: { type: 'string', required: true },
            name: { type: 'string', required: true },
        });
        ctx.body = await ctx.service.repo.createRepo(space, name);
    }

    /**
     * GET /repos/download (download repo)
     * @param {string} repoPath path of repo
     * @param {string=} ref ref of repo
     * @returns repo zip data
     */
    public async download() {
        const { ctx } = this;
        const { repoPath, ref } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            ref: { type: 'string', required: false },
        });
        ctx.body = await ctx.service.repo.downloadRepo(repoPath, ref);
    }

    /**
     * GET /repos (get repo info)
     * @param {string} repoPath path of repo
     * @returns repo info
     */
    public async show() {
        const { ctx } = this;
        const { repoPath } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
        });
        ctx.body = await ctx.service.repo.getRepoByPath(repoPath);
    }

    /**
     * DELETE /repos (delete repo)
     * @param {string} repoPath path of repo
     * @returns repo info
     */
    public async destroy() {
        const { ctx } = this;
        const { repoPath } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
        });
        ctx.body = await ctx.service.repo.deleteRepo(repoPath);
    }

    /**
     * POST /repos/rename (rename a repo)
     * @param {string} repoPath path of repo, eg: space/name
     * @param {string} newRepoName new name of a repo, eg: newname
     * @returns success or fail
     */
    public async rename() {
        const { ctx } = this;
        const { repoPath, newRepoName } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            newRepoName: { type: 'string', required: true },
        });
        ctx.body = await ctx.service.repo.renameRepo(repoPath, newRepoName);
    }

    /**
     * POST /repos/sync (sync a repo from gitlab)
     * @param {string} repoPath path of repo
     * @param {string} gitlabRepoUrl new name of a repo, eg: newname
     * @returns success or fail
     */
    public async sync() {
        const { ctx } = this;
        const { repoPath, gitlabRepoUrl } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            gitlabRepoUrl: { type: 'string', required: true },
        });
        ctx.body = await ctx.service.repo.syncGitlabRepo(repoPath, gitlabRepoUrl);
    }
}
