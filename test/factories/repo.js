const { factory } = require('factory-girl');
const faker = require('faker');

module.exports = app => {
    factory.define('repo', app.model.Repo, async options => {
        const guard = options.guard || (await factory.create('guard'));
        const space = options.space || (await factory.create('space'));
        const repoName = faker.lorem.word();
        return {
            guardId: guard.id,
            spaceId: space.id,
            name: repoName,
            path: space.name + '/' + repoName,
        };
    });
};
