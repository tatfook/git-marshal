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
});
