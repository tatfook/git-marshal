import { Controller } from 'egg';

export default class AdminCacheManager extends Controller {
    private async ensureAdmin() {
        const admin = await this.ctx.service.admin.current();
        if (!admin) this.ctx.throw(404, 'invalid admin');
    }

    public async reloadAllCache() {
        await this.ensureAdmin();
        const { ctx } = this;
        await ctx.service.guard.reloadCache();
    }

    public async reloadGuardCache() {
        await this.ensureAdmin();
        const { ctx } = this;
        await ctx.service.guard.reloadCache();
    }
}
