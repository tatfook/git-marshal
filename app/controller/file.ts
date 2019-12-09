import { Controller } from 'egg';

export default class FileController extends Controller {
    /**
     * POST /files (update or insert a file)
     * @param {string} repoPath path of repo
     * @param {string} filePath path of file
     * @param {string} content file content
     * @param {string=} committer name of operator
     * @returns commit id
     */
    public async upsert() {
        const { ctx } = this;
        const { repoPath, filePath, content, committer } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            filePath: { type: 'string', required: true },
            content: { type: 'string', required: true },
            committer: { type: 'string', required: false },
        });
        ctx.body = await ctx.service.file.upsertFile(repoPath, filePath, content, { name: committer });
    }

    /**
     * GET /files/history (get history of a file)
     * @param {String} repoPath path of repo
     * @param {String} filePath path of file
     * @param {String=} commitId get history before commitId
     * @returns arrays of history record
     */
    public async history() {
        const { ctx } = this;
        const { repoPath, filePath, commitId } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            filePath: { type: 'string', required: true },
            commitId: { type: 'string', required: false },
        });
        ctx.body = await ctx.service.file.getFileHistory(repoPath, filePath, commitId);
    }

    /**
     * GET /files/raw (get raw data of a file)
     * @param {String} repoPath path of repo
     * @param {String} filePath path of file
     * @param {String=} commitId get raw data of a specific commitId
     * @returns raw string
     */
    public async raw() {
        const { ctx } = this;
        const { repoPath, filePath, commitId } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            filePath: { type: 'string', required: true },
            commitId: { type: 'string', required: false },
        });
        ctx.body = await ctx.service.file.getFileRawData(repoPath, filePath, commitId);
    }

    /**
     * GET /files (get file info)
     * @param {String} repoPath path of repo
     * @param {String} filePath path of file
     * @param {String=} commitId get info of a specific commitId
     * @returns file info
     */
    public async show() {
        const { ctx } = this;
        const { repoPath, filePath, commitId } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            filePath: { type: 'string', required: true },
            commitId: { type: 'string', required: false },
        });
        ctx.body = await ctx.service.file.getFileInfo(repoPath, filePath, commitId);
    }

    /**
     * DELETE /files (delete a file)
     * @param {string} repoPath path of repo
     * @param {string} filePath path of file
     * @param {string=} committer name of operator
     * @returns commit id
     */
    public async destroy() {
        const { ctx } = this;
        const { repoPath, filePath, committer } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            filePath: { type: 'string', required: true },
            committer: { type: 'string', required: false },
        });
        ctx.body = await ctx.service.file.deleteFile(repoPath, filePath, { name: committer });
    }

    /**
     * POST /files/move (update or insert a file)
     * @param {string} repoPath path of repo
     * @param {string} filePath path of file
     * @param {string} newFilePath path of new file
     * @param {string=} committer name of operator
     * @returns commit id
     */
    public async move() {
        const { ctx } = this;
        const { repoPath, filePath, newFilePath, committer } = ctx.params;
        ctx.validate({
            repoPath: { type: 'string', required: true },
            filePath: { type: 'string', required: true },
            newFilePath: { type: 'string', required: true },
            committer: { type: 'string', required: false },
        });
        ctx.body = await ctx.service.file.moveFile(repoPath, filePath, newFilePath, { name: committer });
    }
}
