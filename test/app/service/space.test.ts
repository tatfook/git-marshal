import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/space.test.ts', () => {
    let ctx: Context;
    before(async () => {
        ctx = app.mockContext();
    });

    describe('have spaces', () => {
        let spaceOne: any;
        beforeEach(async () => {
            spaceOne = await app.factory.create('space');
        });

        it('#findByuserId', async () => {
            const space = await ctx.service.space.findByUserId(spaceOne.userId);
            assert(space.id === spaceOne.id);
        });
    });

    describe('have no spaces', () => {
        it('#findByuserId', async () => {
            try {
                await ctx.service.space.findByUserId(1);
                assert.fail('except fail to find space!');
            } catch (e) {
                assert(e.message === 'invalid userId');
            }
        });
    });

    describe('#cache', () => {
        let space: any;
        beforeEach(async () => {
            space = await app.factory.create('space');
        });
        it('return data if cached', async () => {
            await ctx.service.space.cacheSpaceByUserId(space);
            const cachedspace = await ctx.service.space.getCachedSpaceByUserId(space.userId);
            assert(cachedspace.id === space.id);
        });

        it('return null if not cached', async () => {
            const cachedSpace = await ctx.service.space.getCachedSpaceByUserId(space.userId);
            assert(cachedSpace === undefined);
        });

        it('return data if reload cached', async () => {
            await ctx.service.space.reloadCache();
            const cachedspace = await ctx.service.space.getCachedSpaceByUserId(space.userId);
            assert(cachedspace.id === space.id);
        });
    });
});
