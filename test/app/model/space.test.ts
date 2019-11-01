import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/model/space.test.ts', () => {
    it('#unique name', async () => {
        const space = await app.factory.create('space');
        try {
            await app.model.Space.create({ userId: space.userId, name: space.name });
            assert.fail('except fail to create same space!');
        } catch (e) {
            const count = await app.model.Space.count();
            assert(count === 1);
        }
    });

    it('#allow a user to have many spaces', async () => {
        const space = await app.factory.create('space');
        const spaceNew = await app.model.Space.create({ userId: space.userId, name: space.name + 'New' });
        assert(spaceNew);
        assert(space.id !== spaceNew.id);
        assert(space.userId === spaceNew.userId);
    });

    describe('#cache', () => {
        let space: any;
        beforeEach(async () => {
            space = await app.factory.create('space');
        });
        it('return data if cached', async () => {
            await app.model.Space.cacheSpaceByUserId(space);
            const cachedspace = await app.model.Space.getCachedSpaceByUserId(space.userId);
            assert(cachedspace && cachedspace.id === space.id);
        });

        it('return null if not cached', async () => {
            const cachedSpace = await app.model.Space.getCachedSpaceByUserId(space.userId);
            assert(cachedSpace === null);
        });
    });
});
