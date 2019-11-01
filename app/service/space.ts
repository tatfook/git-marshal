import { Service } from 'egg';

export default class SpaceService extends Service {
    public async createSpace(userId: number, spaceName: string) {
        const { ctx } = this;
        const space = await ctx.model.Space.create({ userId, name: spaceName });
        if (!space) return ctx.throw('failed to create space');
        ctx.model.Space.cacheSpaceByUserId(space);
        return space;
    }

    public async findByUserId(userId: number) {
        const { ctx } = this;
        let space = await ctx.model.Space.getCachedSpaceByUserId(userId);
        if (!space) {
            space = await ctx.model.Space.findOne({ where: { userId } });
            if (!space) return ctx.throw('invalid userId');
            ctx.model.Space.cacheSpaceByUserId(space);
        }
        return space;
    }
}
