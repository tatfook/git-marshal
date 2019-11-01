import { Application, IBoot } from 'egg';
import API from './app/common/api';

export default class MarshalBoot implements IBoot {
    private readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    configWillLoad() {
        // Ready to call configDidLoad,
        // Config, plugin files are referred,
        // this is the last chance to modify the config.
    }

    configDidLoad() {
        // Config, plugin files have loaded.
    }

    async didLoad() {
        // All files have loaded, start plugin here.
        API(this.app);
    }

    async willReady() {
        // All plugins have started, can do some thing before app ready.
    }

    async didReady() {
        // Worker is ready, can do some things
        // don't need to block the app boot.
        // this.app;
    }

    async serverDidReady() {
        // Server is listening.
        await this.app.model.Guard.reloadCache();
    }

    async beforeClose() {
        // Do some thing before app close.
    }
}
