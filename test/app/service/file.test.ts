import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';
import { IRepo } from '../../../typings/custom/model';

describe('test/app/service/file.test.ts', () => {
    let ctx: Context;
    let repo: IRepo;
    before(() => {
        ctx = app.mockContext();
    });
    beforeEach(async () => {
        repo = await app.factory.create('repo');
    });

    describe('#upsertFile', () => {
        it('should upsert valid file', async () => {
            const data = await ctx.service.file.upsertFile(repo.path, 'hey.txt', 'hello');
            assert(data);
        });

        it('should not upsert file path belongs to no repo', async () => {
            try {
                await ctx.service.file.upsertFile(repo.path + 'fake', 'test.txt', 'hello');
                assert.fail('should fail to upsert file');
            } catch (e) {
                assert(e.message === 'repo not found');
            }
        });
    });

    describe('#deleteFile', () => {
        it('should delete valid file', async () => {
            const data = await ctx.service.file.deleteFile(repo.path, 'hey.txt');
            assert(data);
        });

        it('should not delete file path belongs to no repo', async () => {
            try {
                await ctx.service.file.deleteFile(repo.path + 'fake', 'test.txt');
                assert.fail('should fail to delete file');
            } catch (e) {
                assert(e.message === 'repo not found');
            }
        });
    });

    describe('#moveFile', () => {
        it('should move file to the new path', async () => {
            const data = await ctx.service.file.moveFile(repo.path, 'hey.txt', 'ho.txt');
            assert(data);
        });

        it('should not move file to a invalid file path', async () => {
            try {
                await ctx.service.file.moveFile(repo.path, 'hey.txt', '');
                assert.fail('should fail to move file');
            } catch (e) {
                assert(e.message === 'invalid new file path');
            }
        });
    });
    describe('#getFileHistory', () => {
        it('should return history of a valid file', async () => {
            const data = await ctx.service.file.getFileHistory(repo.path, 'hey.txt');
            assert(data);
        });

        it('should not return history if file path belongs to no repo', async () => {
            try {
                await ctx.service.file.getFileHistory(repo.path + 'fake', 'test.txt');
                assert.fail('should fail to delete file');
            } catch (e) {
                assert(e.message === 'repo not found');
            }
        });
    });
    describe('#getFileInfo', () => {
        it('should return info of a valid file', async () => {
            const data = await ctx.service.file.getFileInfo(repo.path, 'hey.txt');
            assert(data);
        });

        it('should not return info if file path belongs to no repo', async () => {
            try {
                await ctx.service.file.getFileInfo(repo.path + 'fake', 'test.txt');
                assert.fail('should fail to delete file');
            } catch (e) {
                assert(e.message === 'repo not found');
            }
        });
    });
    describe('#getFileRawData', () => {
        it('should return raw data of a valid file', async () => {
            const data = await ctx.service.file.getFileRawData(repo.path, 'hey.txt');
            assert(data);
        });

        it('should not return raw data if file path belongs to no repo', async () => {
            try {
                await ctx.service.file.getFileRawData(repo.path + 'fake', 'test.txt');
                assert.fail('should fail to delete file');
            } catch (e) {
                assert(e.message === 'repo not found');
            }
        });
    });
});
