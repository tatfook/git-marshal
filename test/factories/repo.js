const { factory } = require('factory-girl');

module.exports = app => {
    factory.define('repo', app.model.Repo, async options => {
        const guard = options.guard || (await factory.create('guard'));
        const repoName = await factory.chance('word', { length: 10 })();
        const spaceName = await factory.chance('word', { length: 10 })();
        const path = `${spaceName}/${repoName}`;
        return {
            guardId: guard.id,
            space: spaceName,
            name: repoName,
            path,
        };
    });
};
