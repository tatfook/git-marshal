import { Service } from 'egg';
import * as _ from 'lodash';

export default class FileService extends Service {
    public async upsertFile(filePath: string, content: string) {
        const { repo, guard, fileName } = await this.getDataFromFilePath(filePath);
        const result = await this.ctx.curl(`${guard.url}/file`, {
            method: 'POST',
            data: {
                repopath: repo.path,
                filepath: fileName,
                encoding: 'utf8',
                content,
            },
        });
        return result.data;
    }

    public async deleteFile(filePath: string) {
        const { repo, guard, fileName } = await this.getDataFromFilePath(filePath);
        const result = await this.ctx.curl(`${guard.url}/file`, {
            method: 'DELETE',
            data: {
                repopath: repo.path,
                filepath: fileName,
            },
        });
        return result.data;
    }

    public async getHistory(filePath: string, commitId?: string, maxCount: number = 10) {
        const { repo, guard, fileName } = await this.getDataFromFilePath(filePath);
        const result = await this.ctx.curl(`${guard.url}/file/history`, {
            data: {
                repopath: repo.path,
                filepath: fileName,
                commitId,
                maxCount,
            },
        });
        return result.data;
    }

    public async getFileInfo(filePath: string, commitId?: string) {
        const { repo, guard, fileName } = await this.getDataFromFilePath(filePath);
        const result = await this.ctx.curl(`${guard.url}/file`, {
            data: {
                repopath: repo.path,
                filepath: fileName,
                commitId,
            },
        });
        return result.data;
    }

    public async getRawData(filePath: string, commitId?: string) {
        const { repo, guard, fileName } = await this.getDataFromFilePath(filePath);
        const result = await this.ctx.curl(`${guard.url}/file/raw`, {
            data: {
                repopath: repo.path,
                filepath: fileName,
                commitId,
            },
        });
        return result.data;
    }

    public async getDataFromFilePath(filePath: string) {
        const { ctx } = this;
        filePath = _.trim(filePath, ' /');
        const repo = await ctx.service.repo.getRepoByFullPath(filePath);
        const guard = await ctx.service.guard.findById(repo.guardId);
        const fileName = filePath.slice(repo.path.length + 1);

        return { repo, guard, fileName };
    }
}
