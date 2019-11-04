import { Service } from 'egg';

export default class GuardService extends Service {
    public async findById(id: number) {
        const { ctx } = this;
        let guard: any = await ctx.model.Guard.getCachedGuard(id);
        if (!guard) {
            guard = await ctx.model.Guard.findOne({ where: { id } });
            if (!guard) return this.ctx.throw('invalid id');
            ctx.model.Guard.cacheGuard(guard);
        }
        return guard;
    }

    public async getRandomGuard() {
        const count = await this.ctx.model.Guard.count();
        if (count === 0) this.ctx.throw('!!!operation error!!!');
        const offset = Math.ceil(Math.random() * (count - 1));
        const guard = await this.ctx.model.Guard.findOne({ offset });
        if (!guard) return this.ctx.throw('!!!operation error!!!');
        return guard;
    }

    public async getGuardWithLessRepos() {
        const guard = await this.ctx.model.Guard.findOne({ order: [['repoCount', 'asc']] });
        if (!guard) return this.ctx.throw('!!!operation error!!!');
        return guard;
    }
}
