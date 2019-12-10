import { Controller } from 'egg';

export default class FolderController extends Controller {
    /**
     * POST /folders (create folder)
     * @param {String} repoPath path of repo
     * @param {String} folderPath path of folder
     * @param {String=} committer name of operator
     * @returns commit id of the .keep file
     */
    public async create() {
        const { ctx } = this;
        ctx.validate(
            {
                repoPath: 'string',
                folderPath: 'string',
                committer: 'string?',
            },
            ctx.params,
        );
        const { repoPath, folderPath, committer } = ctx.params;
        ctx.body = await ctx.service.folder.createFolder(repoPath, folderPath, { name: committer });
    }

    /**
     * GET /folders/files (get files under folder)
     * @param {String} repoPath path of repo
     * @param {String=} folderPath path of folder
     * @param {Boolean=} recursive enable it to get subfolder files
     * @returns tree of folder files
     */
    public async files() {
        const { ctx } = this;
        ctx.validate(
            {
                repoPath: 'string',
                folderPath: 'string?',
                recursive: 'boolean?',
            },
            ctx.params,
        );
        const { repoPath, folderPath, recursive } = ctx.params;
        ctx.body = await ctx.service.folder.getFiles(repoPath, folderPath, recursive);
    }

    /**
     * DELETE /folders (delete folder)
     * @param {String} repoPath path of repo
     * @param {String} folderPath path of folder
     * @param {String=} committer name of operator
     * @returns commit id
     */
    public async destroy() {
        const { ctx } = this;
        ctx.validate(
            {
                repoPath: 'string',
                folderPath: 'string',
                committer: 'string?',
            },
            ctx.params,
        );
        const { repoPath, folderPath, committer } = ctx.params;
        ctx.body = await ctx.service.folder.deleteFolder(repoPath, folderPath, { name: committer });
    }

    /**
     * POST /folders/move (delete folder)
     * @param {String} repoPath path of repo
     * @param {String} folderPath path of folder
     * @param {String} newFolderPath path of new folder
     * @param {String=} committer name of operator
     * @returns commit id
     */
    public async move() {
        const { ctx } = this;
        ctx.validate(
            {
                repoPath: 'string',
                folderPath: 'string',
                newFolderPath: 'string',
                committer: 'string?',
            },
            ctx.params,
        );
        const { repoPath, folderPath, newFolderPath, committer } = ctx.params;
        ctx.body = await ctx.service.folder.moveFolder(repoPath, folderPath, newFolderPath, { name: committer });
    }
}
