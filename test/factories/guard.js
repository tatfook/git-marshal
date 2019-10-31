const { factory } = require('factory-girl');

module.exports = app => {
    factory.define('guard', app.model.Guard, {
        name: factory.sequence('Guard.name', n => `guard_${n}`),
        url: factory.sequence('Guard.url', n => `http://127.0.0.1/guard_${n}`),
        repoCount: 0,
    });
};
