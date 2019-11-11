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
});
