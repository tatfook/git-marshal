import { Controller } from 'egg';
import * as mime from 'mime';
import * as _path from 'path';

export default class FileController extends Controller {
    /**
     * POST /files (update or insert a file)
     * @param {string} repoPath path of repo
     * @param {string} filePath path of file
     * @param {string=} content file content
     * @param {string=} committer name of operator
     * @param {string=} encoding name of operator
     * @returns commit id
     */
    public async upsert() {
        const { ctx } = this;
        ctx.validate(
            {
                repoPath: 'string',
                filePath: 'string',
                content: 'string?',
                committer: 'string?',
                encoding: 'string?',
            },
            ctx.params,
        );
        const { repoPath, filePath, content, encoding, committer } = ctx.params;
        ctx.body = await ctx.service.file.upsertFile(repoPath, filePath, content, encoding, { name: committer });
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
        ctx.validate(
            {
                repoPath: 'string',
                filePath: 'string',
                commitId: 'string?',
            },
            ctx.params,
        );
        const { repoPath, filePath, commitId } = ctx.params;
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
        ctx.validate(
            {
                repoPath: 'string',
                filePath: 'string',
                commitId: 'string?',
            },
            ctx.params,
        );
        const { repoPath, filePath, commitId } = ctx.params;
        ctx.body = await ctx.service.file.getFileRawData(repoPath, filePath, commitId);
        const filename = _path.basename(filePath);
        const mimeType = mime.getType(filename);
        if (mimeType) {
            ctx.set('Content-Type', mimeType);
            this.ctx.set('Content-Description', 'File Transfer');
            this.ctx.set('Content-Transfer-Encoding', 'binary');
            if (mimeType.match('image') || mimeType.match('text')) {
                ctx.set('Content-Disposition', `inline; filename=${filename}`);
            } else {
                ctx.set('Content-Disposition', `attachment; filename=${filename}`);
            }
        } else {
            ctx.error('Invalid File Type');
        }
    }

    /**
     * GET /files (get file data)
     * @param {String} repoPath path of repo
     * @param {String} filePath path of file
     * @param {String=} commitId get info of a specific commitId
     * @returns file data
     */
    public async show() {
        const { ctx } = this;
        ctx.validate(
            {
                repoPath: 'string',
                filePath: 'string',
                commitId: 'string?',
            },
            ctx.params,
        );
        const { repoPath, filePath, commitId } = ctx.params;
        ctx.body = await ctx.service.file.getFileData(repoPath, filePath, commitId);
    }

    /**
     * GET /files/info (get file info)
     * @param {String} repoPath path of repo
     * @param {String} filePath path of file
     * @param {String=} commitId get info of a specific commitId
     * @returns file info
     */
    public async info() {
        const { ctx } = this;
        ctx.validate(
            {
                repoPath: 'string',
                filePath: 'string',
                commitId: 'string?',
            },
            ctx.params,
        );
        const { repoPath, filePath, commitId } = ctx.params;
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
        ctx.validate(
            {
                repoPath: 'string',
                filePath: 'string',
                committer: 'string?',
            },
            ctx.params,
        );
        const { repoPath, filePath, committer } = ctx.params;
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
        ctx.validate(
            {
                repoPath: 'string',
                filePath: 'string',
                newFilePath: 'string',
                committer: 'string?',
            },
            ctx.params,
        );
        const { repoPath, filePath, newFilePath, committer } = ctx.params;
        ctx.body = await ctx.service.file.moveFile(repoPath, filePath, newFilePath, { name: committer });
    }
}
