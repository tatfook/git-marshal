'use strict';

const { app } = require('egg-mock/bootstrap');
const factories = require('./factories');
const Redis = require('ioredis-mock');

before(() => {
    factories(app);
    app.redis = new Redis();
});

afterEach(async () => {
    await app.redis.flushdb();
    await app.model.truncate({ restartIdentity: true });
});
