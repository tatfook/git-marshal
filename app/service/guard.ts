import { Service } from 'egg';

export default class GuardService extends Service {
    async getGuard(guardId: number) {
        return this.ctx.model.Guard.findOne({ where: { id: guardId } });
    }

    async getRandomGuard() {
        const count = await this.ctx.model.Guard.count();
        const offset = Math.ceil(Math.random() * count);
        return this.ctx.model.Guard.findOne({ offset });
    }
}
