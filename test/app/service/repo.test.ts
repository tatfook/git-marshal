import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/repo.test.ts', () => {
    let ctx: Context;
    before(() => {
        ctx = app.mockContext();
    });

    describe('#create repo', () => {
        describe('# with valid space and guard', () => {
            let space: any;
            let repo: any;
            beforeEach(async () => {
                space = await app.factory.create('space', { userId: 1 });
                repo = await app.factory.create('repo', {}, { space });
            });

            it('should create a new repo if it not exists', async () => {
                const newRepo = await ctx.service.repo.createRepo(1, repo.name + 'abc');
                assert(newRepo);
                assert(newRepo.id !== repo.id);
            });

            it('should failed to create a new repo if it exists', async () => {
                try {
                    await ctx.service.repo.createRepo(1, repo.name);
                    assert.fail('except fail to create same repo!');
                } catch (e) {
                    const count = await ctx.model.Repo.count();
                    assert(count === 1);
                }
            });
        });

        it('should failed to create a new repo if guard is not exists', async () => {
            await app.factory.create('space', { userId: 1 });
            try {
                await ctx.service.repo.createRepo(1, 'abc');
                assert.fail('except fail to create same repo!');
            } catch (e) {
                const count = await ctx.model.Repo.count();
                assert(count === 0);
            }
        });

        it('should failed to create a new repo if space is not exists', async () => {
            await app.factory.create('guard');
            try {
                await ctx.service.repo.createRepo(1, 'abc');
                assert.fail('except fail to create same repo!');
            } catch (e) {
                const count = await ctx.model.Repo.count();
                assert(count === 0);
            }
        });
    });

    describe('#getRepoByFilePath', () => {
        let repo: any;
        beforeEach(async () => {
            repo = await app.factory.create('repo');
        });

        describe('should return repo with valid repo file path', () => {
            it('spaceName/repoName/fileName', async () => {
                const resRepo = await ctx.service.repo.getRepoByFilePath(repo.path + '/abc.jpg');
                assert(resRepo.id === repo.id);
            });
            it('/spaceName/repoName/fileName', async () => {
                const resRepo = await ctx.service.repo.getRepoByFilePath('/' + repo.path + '/abc.jpg');
                assert(resRepo.id === repo.id);
            });
        });

        describe('should failed to return repo if filepath is invalid', () => {
            it('spaceName/repoName', async () => {
                try {
                    await ctx.service.repo.getRepoByFilePath(repo.path);
                    assert.fail('except fail to get repo!');
                } catch (e) {
                    assert(e.message === 'invalid file path');
                }
            });
            it('/spaceName/repoName', async () => {
                try {
                    await ctx.service.repo.getRepoByFilePath('/' + repo.path);
                    assert.fail('except fail to get repo!');
                } catch (e) {
                    assert(e.message === 'invalid file path');
                }
            });
            it('spaceName/repoName/', async () => {
                try {
                    await ctx.service.repo.getRepoByFilePath(repo.path);
                    assert.fail('except fail to get repo!');
                } catch (e) {
                    assert(e.message === 'invalid file path');
                }
            });
            it('filename', async () => {
                try {
                    await ctx.service.repo.getRepoByFilePath('abc.jpg');
                    assert.fail('except fail to get repo!');
                } catch (e) {
                    assert(e.message === 'invalid file path');
                }
            });
            it('with invalid repo path', async () => {
                try {
                    await ctx.service.repo.getRepoByFilePath(repo.path + 'aaa/bb.md');
                    assert.fail('except fail to get repo!');
                } catch (e) {
                    assert(e.message === 'repo not found');
                }
            });
        });

        describe('#cache', () => {
            let repo: any;
            beforeEach(async () => {
                repo = await app.factory.create('repo');
            });
            it('return data if cached', async () => {
                await ctx.service.repo.cacheRepoByPath(repo);
                const cachedRepo = await ctx.service.repo.getCachedRepoByPath(repo.path);
                assert(cachedRepo.id === repo.id);
            });
            it('return null if not cached', async () => {
                const cachedRepo = await ctx.service.repo.getCachedRepoByPath(repo.path);
                assert(cachedRepo === undefined);
            });
        });
    });
});
