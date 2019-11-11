import { Application, IBoot } from 'egg';

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
        if (process.env.NODE_ENV !== 'test') await this.app.model.Guard.reloadCache();
    }

    async beforeClose() {
        // Do some thing before app close.
    }
}
