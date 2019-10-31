import { Service } from 'egg';
import { SPACE_PREFIX } from '../common/const/redis';

export default class SpaceService extends Service {
    public async findByUserId(userId: number) {
        let space = await this.getCachedSpaceByUserId(userId);
        if (!space) {
            space = await this.ctx.model.Space.findOne({ where: { userId } });
            if (!space) return this.ctx.throw('invalid userId');
            this.cacheSpaceByUserId(space);
        }
        return space;
    }

    public async cacheSpaceByUserId(space) {
        return this.app.redis.set(SPACE_PREFIX + space.userId, JSON.stringify(space));
    }

    public async getCachedSpaceByUserId(userId: number) {
        const jsonStr = await this.app.redis.get(SPACE_PREFIX + userId);
        if (jsonStr) return JSON.parse(jsonStr);
    }

    public async reloadCache() {
        const spaces = await this.ctx.model.Space.findAll();
        spaces.forEach(space => {
            this.cacheSpaceByUserId(space);
        });
    }
}
