import { Controller } from 'egg';
import * as _ from 'lodash';
import * as Pluralize from 'pluralize';

export default class ResourceBaseController extends Controller {
    private async ensureAdmin() {
        const admin = await this.ctx.service.admin.current();
        if (!admin) this.ctx.throw(404, 'invalid admin');
    }

    private async getResource() {
        const { resources } = this.ctx.params;
        const resource = this.ctx.model[_.upperFirst(Pluralize.singular(resources))];
        if (!resource) this.ctx.throw(400, 'args error');
        return resource;
    }

    async search() {
        await this.ensureAdmin();
        const resource = await this.getResource();
        const query = this.ctx.request.body || {};
        const list = await resource.findAndCount(query);
        this.ctx.body = list;
    }

    async index() {
        await this.ensureAdmin();
        const resource = await this.getResource();
        const query = this.ctx.query || {};
        const list = await resource.findAndCount({ where: query });
        this.ctx.body = list;
    }

    async show() {
        await this.ensureAdmin();
        const resource = await this.getResource();
        const { ctx } = this;
        const id = _.toNumber(ctx.params.id);
        if (!id) ctx.throw(400, 'args error');
        const data = await resource.findOne({ where: { id } });
        ctx.body = data;
    }

    async create() {
        await this.ensureAdmin();
        const resource = await this.getResource();
        const { ctx } = this;
        const attributes = ctx.request.body;
        const data = await resource.create(attributes);
        ctx.body = data;
    }

    async update() {
        await this.ensureAdmin();
        const resource = await this.getResource();
        const { ctx } = this;
        const params = ctx.request.body;
        const id = _.toNumber(ctx.params.id);
        if (!id) ctx.throw(400, 'args error');
        const data = await resource.update(params, {
            individualHooks: true,
            where: { id },
        });
        ctx.body = data;
    }

    async destroy() {
        await this.ensureAdmin();
        const resource = await this.getResource();
        const { ctx } = this;
        const id = _.toNumber(ctx.params.id);
        if (!id) ctx.throw(400, 'args error');
        const data = await resource.destroy({ where: { id } });
        ctx.body = data;
    }

    async destroyAll() {
        await this.ensureAdmin();
        const resource = await this.getResource();
        const { ctx } = this;
        const params = ctx.request.body;
        const ids = params.ids || [];
        const data = await resource.destroy({ where: { id: ids } });
        ctx.body = data;
    }
}
