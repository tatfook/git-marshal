import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/model/repo.test.ts', () => {
    it('#hook after create and before destroy', async () => {
        const guard = await app.factory.create('guard');
        assert(guard.repoCount === 0);
        const repo = await app.factory.create('repo', {}, { guard });
        await guard.reload();
        assert(guard.repoCount === 1);
        await repo.destroy();
        await guard.reload();
        assert(guard.repoCount === 0);
    });

    describe('#cache', () => {
        let repo: any;
        beforeEach(async () => {
            repo = await app.factory.create('repo');
        });
        it('return data if cached', async () => {
            await app.model.Repo.cacheRepoByPath(repo);
            const cachedRepo = await app.model.Repo.getCachedRepoByPath(repo.path);
            assert(cachedRepo && cachedRepo.id === repo.id);
        });
        it('return null if not cached', async () => {
            const cachedRepo = await app.model.Repo.getCachedRepoByPath(repo.path);
            assert(cachedRepo === null);
        });
    });
});
