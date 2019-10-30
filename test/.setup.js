'use strict';

const { app } = require('egg-mock/bootstrap');
const factories = require('./factories');

before(() => factories(app));

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
