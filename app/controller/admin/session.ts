import { Controller } from 'egg';

export default class AdminSessionController extends Controller {
    private async ensureAdmin() {
        const admin = await this.ctx.service.admin.current();
        if (!admin) this.ctx.throw(404, 'invalid admin');
    }

    public async sighIn() {
        const { username, password } = this.ctx.params;
        this.ctx.body = await this.ctx.service.admin.login(username, password);
    }

    public async sighOut() {
        await this.ensureAdmin();
        this.ctx.body = await this.ctx.service.admin.logout();
    }

    public async current() {
        await this.ensureAdmin();
        this.ctx.body = await this.ctx.service.admin.current();
    }
}
