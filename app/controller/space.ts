import { Controller } from 'egg';

export default class SpaceController extends Controller {
    public async register() {
        const { userId, spaceName } = this.ctx.params;
        this.ctx.body = await this.ctx.service.space.createSpace(userId, spaceName);
    }
}