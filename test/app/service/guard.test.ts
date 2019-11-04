import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/guard.test.ts', () => {
    let ctx: Context;
    before(async () => {
        ctx = app.mockContext();
    });

    describe('have guards', () => {
        let guardOne: any;
        let guardTwo: any;
        beforeEach(async () => {
            guardOne = await app.factory.create('guard', { repoCount: 2 });
            guardTwo = await app.factory.create('guard', { repoCount: 1 });
        });

        it('#findById', async () => {
            const guard = await ctx.service.guard.findById(guardOne.id);
            assert(guard.id === guardOne.id);
        });

        it('#getRandomGuard', async () => {
            const guard = await ctx.service.guard.getRandomGuard();
            assert(guard);
            assert(guard.id === guardOne.id || guard.id === guardTwo.id);
        });

        it('#getGuardWithLessRepos', async () => {
            const guard = await ctx.service.guard.getGuardWithLessRepos();
            assert(guard);
            assert(guard.id === guardTwo.id);
        });
    });

    describe('have no guards', () => {
        it('#findById', async () => {
            try {
                await ctx.service.guard.findById(1);
                assert.fail('except fail to find guard!');
            } catch (e) {
                assert(e.message === 'invalid id');
            }
        });

        it('#getRandomGuard', async () => {
            try {
                await ctx.service.guard.getRandomGuard();
                assert.fail('except fail to get random guard!');
            } catch (e) {
                assert(e.message === '!!!operation error!!!');
            }
        });

        it('#getGuardWithLessRepos', async () => {
            try {
                await ctx.service.guard.getGuardWithLessRepos();
                assert.fail('except fail to get guard!');
            } catch (e) {
                assert(e.message === '!!!operation error!!!');
            }
        });
    });
});
