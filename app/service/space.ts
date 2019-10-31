import { Service } from 'egg';
import { SPACE_PREFIX } from '../common/const/redis';
import { ISpace } from '../common/interface/model';

export default class SpaceService extends Service {
    public async createSpace(userId: number, spaceName: string) {
        const space = await this.ctx.model.Space.create({ userId, name: spaceName });
        if (!space) return this.ctx.throw('failed to create space');
        this.cacheSpaceByUserId(space);
        return space;
    }

    public async findByUserId(userId: number) {
        let space = await this.getCachedSpaceByUserId(userId);
        if (!space) {
            space = await this.ctx.model.Space.findOne({ where: { userId } });
            if (!space) return this.ctx.throw('invalid userId');
            this.cacheSpaceByUserId(space);
        }
        return space;
    }

    public async cacheSpaceByUserId(space: ISpace) {
        // cache for 7 days
        return this.app.redis.set(SPACE_PREFIX + space.userId, JSON.stringify(space), 'EX', 3600 * 24 * 7); // tslint:disable-line
    }

    public async getCachedSpaceByUserId(userId: number) {
        const jsonStr = await this.app.redis.get(SPACE_PREFIX + userId);
        if (jsonStr) {
            const jsonData = JSON.parse(jsonStr);
            return this.ctx.model.Space.build(jsonData);
        }
        return null;
    }
}
