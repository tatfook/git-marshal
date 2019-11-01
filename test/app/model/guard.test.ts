import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/model/guard.test.ts', () => {
    describe('#cache', () => {
        let guard: any;
        beforeEach(async () => {
            guard = await app.factory.create('guard');
        });
        it('return data if cached', async () => {
            await app.model.Guard.cacheGuard(guard);
            const cachedGuard = await app.model.Guard.getCachedGuard(guard.id);
            assert(cachedGuard && cachedGuard.id === guard.id);
        });

        it('return null if not cached', async () => {
            const cachedGuard = await app.model.Guard.getCachedGuard(guard.id);
            assert(cachedGuard === null);
        });

        it('return data if reload cached', async () => {
            await app.model.Guard.reloadCache();
            const cachedGuard = await app.model.Guard.getCachedGuard(guard.id);
            assert(cachedGuard && cachedGuard.id === guard.id);
        });

        it('will remove the deleted guard from cache after reload', async () => {
            await app.model.Guard.cacheGuard(guard);
            await guard.destroy();
            await app.model.Guard.reloadCache();
            const cachedGuard = await app.model.Guard.getCachedGuard(guard.id);
            assert(cachedGuard === null);
        });
    });
});
