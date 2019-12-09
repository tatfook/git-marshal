import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/folder.test.ts', () => {
    let repo;
    beforeEach(async () => {
        repo = await app.factory.create('repo');
    });

    describe('# POST /folders', () => {
        it('should create folder', async () => {
            const result = await app
                .httpRequest()
                .post('/folders')
                .send({
                    repoPath: repo.path,
                    folderPath: 'hello',
                })
                .expect(200);
            assert(result.body);
        });
        it('should create folder with committer', async () => {
            const result = await app
                .httpRequest()
                .post('/folders')
                .send({
                    repoPath: repo.path,
                    folderPath: 'hello',
                    committer: 'admin',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed without repo path', async () => {
            await app
                .httpRequest()
                .post('/folders')
                .send({
                    folderPath: 'hello',
                })
                .expect(422);
        });
        it('should failed without folder path', async () => {
            await app
                .httpRequest()
                .post('/folders')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('# GET /folders/files', () => {
        it('should return file list', async () => {
            const result = await app
                .httpRequest()
                .get('/folders/files')
                .send({
                    repoPath: repo.path,
                })
                .expect(200);
            assert(result.body[0]);
        });
        it('should return file list with foldpath', async () => {
            const result = await app
                .httpRequest()
                .get('/folders/files')
                .send({
                    repoPath: repo.path,
                    folderPath: 'hello',
                })
                .expect(200);
            assert(result.body[0]);
        });
        it('should return file list with recursive', async () => {
            await app
                .httpRequest()
                .post('/folders')
                .send({
                    repoPath: repo.path,
                    recursive: true,
                })
                .expect(422);
        });
        it('should failed without repo path', async () => {
            await app
                .httpRequest()
                .post('/folders')
                .expect(422);
        });
    });

    describe('# DELETE /folders', () => {
        it('should delete folder', async () => {
            const result = await app
                .httpRequest()
                .delete('/folders')
                .send({
                    repoPath: repo.path,
                    folderPath: 'hello',
                })
                .expect(200);
            assert(result.body);
        });
        it('should delete folder with committer', async () => {
            const result = await app
                .httpRequest()
                .delete('/folders')
                .send({
                    repoPath: repo.path,
                    folderPath: 'hello',
                    committer: 'admin',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed without repo path', async () => {
            await app
                .httpRequest()
                .delete('/folders')
                .send({
                    folderPath: 'hello',
                })
                .expect(422);
        });
        it('should failed without folder path', async () => {
            await app
                .httpRequest()
                .delete('/folders')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('# POST /folders/move', () => {
        it('should move folder', async () => {
            const result = await app
                .httpRequest()
                .post('/folders/move')
                .send({
                    repoPath: repo.path,
                    folderPath: 'hello',
                    newFolderPath: 'world',
                })
                .expect(200);
            assert(result.body);
        });
        it('should delete folder with committer', async () => {
            const result = await app
                .httpRequest()
                .post('/folders/move')
                .send({
                    repoPath: repo.path,
                    folderPath: 'hello',
                    newFolderPath: 'world',
                    committer: 'admin',
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed without repo path', async () => {
            await app
                .httpRequest()
                .post('/folders/move')
                .send({
                    folderPath: 'hello',
                    newFolderPath: 'world',
                })
                .expect(422);
        });
        it('should failed without folder path', async () => {
            await app
                .httpRequest()
                .post('/folders/move')
                .send({
                    repoPath: repo.path,
                    newFolderPath: 'world',
                })
                .expect(422);
        });
        it('should failed without new folder path', async () => {
            await app
                .httpRequest()
                .post('/folders/move')
                .send({
                    repoPath: repo.path,
                    folderPath: 'hello',
                })
                .expect(422);
        });
    });
});
