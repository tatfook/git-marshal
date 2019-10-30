import { Service } from 'egg';
import { GUARD_PREFIX } from '../common/const/redis';

export default class GuardService extends Service {
    public async findById(id: number) {
        let guard = await this.getCachedGuard(id);
        if (!guard) {
            guard = await this.ctx.model.Guard.findOne({ where: { id } });
            if (!guard) return this.ctx.throw('invalid id');
            this.cacheGuard(guard);
        }
        return guard;
    }

    public async getRandomGuard() {
        const count = await this.ctx.model.Guard.count();
        if (count === 0) this.ctx.throw('no guard service available');
        const offset = Math.ceil(Math.random() * (count - 1));
        const guard = await this.ctx.model.Guard.findOne({ offset });
        if (!guard) return this.ctx.throw('!!!operation error!!!');
        return guard;
    }

    public async cacheGuard(guard) {
        return this.app.redis.set(GUARD_PREFIX + guard.id, JSON.stringify(guard));
    }

    public async getCachedGuard(id: number) {
        const jsonStr = await this.app.redis.get(GUARD_PREFIX + id);
        if (jsonStr) return JSON.parse(jsonStr);
    }

    public async reloadCache() {
        const guards = await this.ctx.model.Guard.findAll();
        guards.forEach(guard => {
            this.cacheGuard(guard);
        });
    }
}
