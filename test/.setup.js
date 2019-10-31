'use strict';

const { app } = require('egg-mock/bootstrap');
const factories = require('./factories');
const Redis = require('ioredis-mock');

before(() => {
    factories(app);
    app.redis = new Redis();
});

afterEach(async () => {
    // clear database after each test case
    await Promise.all([
        app.redis.flushdb(),
        // define your own model.destroy here
        app.model.Admin.destroy({ truncate: true, force: true }),
        app.model.Guard.destroy({ truncate: true, force: true }),
        app.model.Space.destroy({ truncate: true, force: true }),
        app.model.Repo.destroy({ truncate: true, force: true }),
    ]);
});
