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
});
