import * as assert from 'assert';
import * as fs from 'fs';
import { app } from 'egg-mock/bootstrap';
import { IRepo } from '../../../typings/custom/model';

describe('test/app/controller/file.test.ts', () => {
    let repo: IRepo;
    beforeEach(async () => {
        repo = await app.factory.create('repo');
    });
    describe('#POST /files', () => {
        it('should insert a file if not exist', async () => {
            const result = await app
                .httpRequest()
                .post('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    content: 'hello',
                })
                .expect(200);
            assert(result.body);
        });
        it('should update a file if already exist', async () => {
            await app
                .httpRequest()
                .post('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    content: 'hello',
                })
                .expect(200);
            const result = await app
                .httpRequest()
                .post('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    content: 'hello world',
                })
                .expect(200);
            assert(result.body);
        });
        it('should insert a file with committer', async () => {
            const result = await app
                .httpRequest()
                .post('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    content: 'hello',
                    committer: 'admin',
                })
                .expect(200);
            assert(result.body);
        });
        it('should insert a file without content', async () => {
            const result = await app
                .httpRequest()
                .post('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed while missing repoPath', async () => {
            await app
                .httpRequest()
                .post('/files')
                .send({
                    filePath: 'a.md',
                    content: 'hello',
                })
                .expect(422);
        });
        it('should failed while missing filePath', async () => {
            await app
                .httpRequest()
                .post('/files')
                .send({
                    repoPath: repo.path,
                    content: 'hello',
                })
                .expect(422);
        });
    });

    describe('#POST /files/binary', () => {
        let streamData;
        beforeEach(async () => {
            streamData = fs.readFileSync('test/tmp/hello.zip');
        });
        it('should insert a file if not exist', async () => {
            const result = await app
                .httpRequest()
                .post('/files/binary')
                .send(streamData)
                .query({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            assert(result.body);
        });
        it('should update a file if already exist', async () => {
            await app
                .httpRequest()
                .post('/files/binary')
                .send(streamData)
                .query({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            const result = await app
                .httpRequest()
                .post('/files/binary')
                .send(streamData)
                .query({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            assert(result.body);
        });
        it('should insert a file with committer', async () => {
            const result = await app
                .httpRequest()
                .post('/files/binary')
                .send(streamData)
                .query({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    committer: 'admin',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed while missing repoPath', async () => {
            await app
                .httpRequest()
                .post('/files/binary')
                .send(streamData)
                .query({
                    filePath: 'a.md',
                })
                .expect(422);
        });
        it('should failed while missing filePath', async () => {
            await app
                .httpRequest()
                .post('/files/binary')
                .send(streamData)
                .query({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('#GET /files/history', () => {
        it('should return file history', async () => {
            const result = await app
                .httpRequest()
                .get('/files/history')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            assert(result.body[0]);
        });
        it('should return file history with commitId', async () => {
            const result = await app
                .httpRequest()
                .get('/files/history')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    commitId: 'asdver3e23ferfdgd',
                })
                .expect(200);
            assert(result.body[0]);
        });
        it('should failed while missing repoPath', async () => {
            await app
                .httpRequest()
                .get('/files/history')
                .send({
                    filePath: 'a.md',
                })
                .expect(422);
        });
        it('should failed while missing filePath', async () => {
            await app
                .httpRequest()
                .get('/files/history')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('#GET /files', () => {
        it('should return file data', async () => {
            const result = await app
                .httpRequest()
                .get('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            assert(result.body);
        });
        it('should return file data with commitId', async () => {
            const result = await app
                .httpRequest()
                .get('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    commitId: 'fsdf21435fgeerg',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed while missing repoPath', async () => {
            await app
                .httpRequest()
                .get('/files')
                .send({
                    filePath: 'a.md',
                })
                .expect(422);
        });
        it('should failed while missing filePath', async () => {
            await app
                .httpRequest()
                .get('/files')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('#GET /files/raw', () => {
        it('should return file raw data', async () => {
            const result = await app
                .httpRequest()
                .get('/files/raw')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            assert(result.body);
        });
        it('should return file raw data with commitId', async () => {
            const result = await app
                .httpRequest()
                .get('/files/raw')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    commitId: 'fsdf21435fgeerg',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed while missing repoPath', async () => {
            await app
                .httpRequest()
                .get('/files/raw')
                .send({
                    filePath: 'a.md',
                })
                .expect(422);
        });
        it('should failed while missing filePath', async () => {
            await app
                .httpRequest()
                .get('/files/raw')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('#GET /files/info', () => {
        it('should return file info data', async () => {
            const result = await app
                .httpRequest()
                .get('/files/info')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            assert(result.body.id);
        });
        it('should return file info data with commitId', async () => {
            const result = await app
                .httpRequest()
                .get('/files/info')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    commitId: 'fsdf21435fgeerg',
                })
                .expect(200);
            assert(result.body.id);
        });
        it('should failed while missing repoPath', async () => {
            await app
                .httpRequest()
                .get('/files/info')
                .send({
                    filePath: 'a.md',
                })
                .expect(422);
        });
        it('should failed while missing filePath', async () => {
            await app
                .httpRequest()
                .get('/files/info')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('#DELETE /files', () => {
        it('should return deleted commitId', async () => {
            const result = await app
                .httpRequest()
                .delete('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                })
                .expect(200);
            assert(result.body);
        });
        it('should return deleted commitId with committer', async () => {
            const result = await app
                .httpRequest()
                .delete('/files')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    committer: 'admin',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed while missing repoPath', async () => {
            await app
                .httpRequest()
                .delete('/files')
                .send({
                    filePath: 'a.md',
                })
                .expect(422);
        });
        it('should failed while missing filePath', async () => {
            await app
                .httpRequest()
                .delete('/files')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('#POST /files/move', () => {
        it('should move file', async () => {
            const result = await app
                .httpRequest()
                .post('/files/move')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    newFilePath: 'b.md',
                })
                .expect(200);
            assert(result.body);
        });
        it('should move file with committer', async () => {
            const result = await app
                .httpRequest()
                .post('/files/move')
                .send({
                    repoPath: repo.path,
                    filePath: 'a.md',
                    newFilePath: 'b.md',
                    committer: 'admin',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed while missing repoPath', async () => {
            await app
                .httpRequest()
                .post('/files/move')
                .send({
                    filePath: 'a.md',
                })
                .expect(422);
        });
        it('should failed while missing filePath', async () => {
            await app
                .httpRequest()
                .post('/files/move')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });
});
