const { factory } = require('factory-girl');

module.exports = app => {
    factory.define('guard', app.model.Guard, {
        name: factory.sequence('Guard.name', n => `guard_${n}`),
        url: app.config.mockAPI.guard.url,
        repoCount: 0,
    });
};
