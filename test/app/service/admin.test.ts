import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/admin.test.ts', () => {
    let ctx: Context;
    let token: string;

    before(async () => {
        ctx = app.mockContext();
    });

    it('#login', async () => {
        await ctx.model.Admin.create({ username: 'user1', password: '123123' });
        const result = await ctx.service.admin.login('user1', '123123');
        assert(result.token);
    });

    describe('with token', () => {
        beforeEach(async () => {
            await ctx.model.Admin.create({ username: 'user1', password: '123123' });
            const result = await ctx.service.admin.login('user1', '123123');
            token = result.token;
            ctx.headers.token = token;
        });

        it('#logout', async () => {
            const result = await ctx.service.admin.logout();
            assert(result === true);
        });

        it('#logout with invalid token', async () => {
            ctx.headers.token = token + 'aaa';
            const result = await ctx.service.admin.logout();
            assert(result === true);
        });
    });

    describe('without token', () => {
        it('#logout', async () => {
            ctx.headers.token = '';
            try {
                await ctx.service.admin.logout();
                assert.fail('except fail to logout!');
            } catch (e) {
                assert(e.message === 'Missing user token');
            }
        });
    });
});
