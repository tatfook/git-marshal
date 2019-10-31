import { Service } from 'egg';
import { v4 as uuid } from 'uuid';
import { ADMIN_PREFIX } from '../common/const/redis';

export default class AdminService extends Service {
    public async login(username: string, password: string) {
        const { ctx } = this;
        const admin = await ctx.model.Admin.findOne({ where: { username } });
        if (!admin) return ctx.throw(404, 'admin not found');

        const isValid = await ctx.compare(password, admin.password);
        if (!isValid) return ctx.throw(404, 'wrong password');
        return await this.applyToken(admin.id);
    }

    private async applyToken(id: number) {
        // prettier-ignore
        const token: string = uuid().split('-').join('');
        // tslint:disable-next-line:no-magic-numbers
        const expire: number = 3600 * 24 * 10; // second
        // tslint:disable-next-line:no-magic-numbers
        const expireAt = Date.now() + expire * 1000 /* ms */;
        await this.ctx.app.redis.hset(ADMIN_PREFIX + token, 'id', id);
        await this.ctx.app.redis.hset(ADMIN_PREFIX + token, 'expireAt', expireAt);
        await this.ctx.app.redis.expire(ADMIN_PREFIX + token, expire);
        return { token, expireAt };
    }

    public async logout() {
        const { ctx } = this;
        const token: string = ctx.headers.token;
        if (token === '') return ctx.throw(404, 'Missing user token');
        await ctx.app.redis.hdel(ADMIN_PREFIX + token);
        return true;
    }

    public async current() {
        const { ctx } = this;
        const token: string = ctx.headers.token;
        if (!token) return ctx.throw(404, 'Missing user token');
        const _id = await ctx.app.redis.hget(ADMIN_PREFIX + token, 'id');
        if (!_id) return ctx.throw(404, 'invalid token');
        const admin = await ctx.model.Admin.findOne({ where: { id: _id } });
        if (!admin) return ctx.throw(404, 'admin is not found');
        admin.password = undefined;
        return admin;
    }
}
