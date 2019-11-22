import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';
import { IGuard, IRepo } from '../../../typings/custom/model';

describe('test/app/service/repo.test.ts', () => {
    let ctx: Context;
    let guard: IGuard;
    let repo: IRepo;
    let guardMorkAPI: string;
    before(() => {
        ctx = app.mockContext();
        guardMorkAPI = app.config.mockAPI.guard.url;
    });
    beforeEach(async () => {
        guard = await app.factory.create('guard', { url: guardMorkAPI });
        repo = await app.factory.create('repo', {}, { guard });
    });

    describe('#create repo', () => {
        describe('# with valid guard', () => {
            it('should create a new repo if it not exists', async () => {
                const newRepo = await ctx.service.repo.createRepo(repo.space, repo.name + 'abc');
                assert(newRepo);
                assert(newRepo.id !== repo.id);
            });

            it('should failed to create a new repo if it exists', async () => {
                try {
                    await ctx.service.repo.createRepo(repo.space, repo.name);
                    assert.fail('except fail to create same repo!');
                } catch (e) {
                    const count = await ctx.model.Repo.count();
                    assert(count === 1);
                }
            });
        });

        it('should failed to create a new repo if guard is not exists', async () => {
            await repo.destroy();
            await guard.destroy();
            try {
                await ctx.service.repo.createRepo('hey', 'abc');
                assert.fail('except fail to create same repo!');
            } catch (e) {
                const count = await ctx.model.Repo.count();
                assert(count === 0);
            }
        });
    });

    describe('#download repo', () => {
        it('should return repo data', async () => {
            const result = await ctx.service.repo.downloadRepo(repo.path);
            assert(result);
        });

        it('should failed with invalid repo path', async () => {
            const errMessage = 'except fail to download an invalid repo!';
            try {
                await ctx.service.repo.downloadRepo(repo.path + 'aaa');
                assert.fail(errMessage);
            } catch (e) {
                assert(e.message !== errMessage);
            }
        });
    });

    describe('#delete repo', () => {
        it('should success to delete an exist repo', async () => {
            const result = await ctx.service.repo.deleteRepo(repo.path);
            assert(result);
        });

        it('should failed with invalid repo path', async () => {
            const errMessage = 'except fail to delete an invalid repo!';
            try {
                await ctx.service.repo.deleteRepo(repo.path + 'aaa');
                assert.fail(errMessage);
            } catch (e) {
                assert(e.message !== errMessage);
            }
        });
    });

    describe('#rename repo', () => {
        it('should rename a repo', async () => {
            const newName = repo.name + 'aaa';
            await ctx.service.repo.renameRepo(repo.path, newName);
            const newRepo = await app.model.Repo.findOne({ where: { id: repo.id } });
            assert(newRepo && newRepo.name === newName);
        });

        it('should failed to rename a new repo if it exists', async () => {
            const errMessage = 'except fail to rename an unexisted repo!';
            const newName = repo.name + 'aaa';
            try {
                await ctx.service.repo.renameRepo(repo.path + 'aaa', newName);
                assert.fail(errMessage);
            } catch (e) {
                assert(e.message !== errMessage);
            }
        });
    });
});
