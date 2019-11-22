const { factory } = require('factory-girl');
const faker = require('faker');

module.exports = app => {
    factory.define('repo', app.model.Repo, async options => {
        const guard = options.guard || (await factory.create('guard'));
        const repoName = faker.lorem.word();
        const spaceName = faker.lorem.word();
        return {
            guardId: guard.id,
            space: spaceName,
            name: repoName,
            path: spaceName + '/' + repoName,
        };
    });
};
