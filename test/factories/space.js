const { factory } = require('factory-girl');

module.exports = app => {
    factory.define('space', app.model.Space, {
        name: factory.sequence('Space.name', n => `name_${n}`),
        userId: factory.sequence('Space.userId', n => n),
        repoCount: 0,
    });
};
