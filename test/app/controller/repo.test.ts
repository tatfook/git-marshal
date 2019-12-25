import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/repo.test.ts', () => {
    let guard;
    beforeEach(async () => {
        guard = await app.factory.create('guard');
    });
    describe('#POST /repos', () => {
        it('should create new repo', async () => {
            const result = await app
                .httpRequest()
                .post('/repos')
                .send({
                    space: 'space',
                    name: 'demo',
                })
                .expect(200);
            assert(result.body.space !== 'space');
        });
        it('should failed if repo already exist', async () => {
            const repo = await app.factory.create('repo', {}, { guard });
            await app
                .httpRequest()
                .post('/repos')
                .send({
                    space: repo.space,
                    name: repo.name,
                })
                .expect(500);
        });
        it('should failed with invalid space', async () => {
            await app
                .httpRequest()
                .post('/repos')
                .send({
                    name: 'repo',
                })
                .expect(422);
        });
        it('should failed with invalid name', async () => {
            await app
                .httpRequest()
                .post('/repos')
                .send({
                    space: 'space',
                })
                .expect(422);
        });
    });

    describe('#GET /repos/download', () => {
        let repo;
        beforeEach(async () => {
            repo = await app.factory.create('repo', {}, { guard });
        });
        it('should downlaod repo data', async () => {
            const result = await app
                .httpRequest()
                .get('/repos/download')
                .send({
                    repoPath: repo.path,
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed if repo not exist', async () => {
            await app
                .httpRequest()
                .get('/repos/download')
                .send({
                    repoPath: repo.path + 'abc',
                })
                .expect(500);
        });
        it('should failed without repoPath', async () => {
            await app
                .httpRequest()
                .get('/repos/download')
                .expect(422);
        });
    });

    describe('#GET /repos', () => {
        let repo;
        beforeEach(async () => {
            repo = await app.factory.create('repo', {}, { guard });
        });
        it('should return repo info', async () => {
            const result = await app
                .httpRequest()
                .get('/repos')
                .send({
                    repoPath: repo.path,
                })
                .expect(200);
            assert(result.body.path === repo.path);
        });
        it('should failed if repo not exist', async () => {
            await app
                .httpRequest()
                .get('/repos')
                .send({
                    repoPath: repo.path + 'abc',
                })
                .expect(500);
        });
        it('should failed without repoPath', async () => {
            await app
                .httpRequest()
                .get('/repos')
                .expect(422);
        });
    });

    describe('#DELETE /repos', () => {
        let repo;
        beforeEach(async () => {
            repo = await app.factory.create('repo', {}, { guard });
        });
        it('should delete repo', async () => {
            const result = await app
                .httpRequest()
                .delete('/repos')
                .send({
                    repoPath: repo.path,
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed if repo not exist', async () => {
            await app
                .httpRequest()
                .delete('/repos')
                .send({
                    repoPath: repo.path + 'abc',
                })
                .expect(500);
        });
        it('should failed without repoPath', async () => {
            await app
                .httpRequest()
                .delete('/repos')
                .expect(422);
        });
    });

    describe('#POST /repos/rename', () => {
        let repo;
        beforeEach(async () => {
            repo = await app.factory.create('repo', {}, { guard });
        });
        it('should rename a repo', async () => {
            const result = await app
                .httpRequest()
                .post('/repos/rename')
                .send({
                    repoPath: repo.path,
                    newRepoName: repo.name + 'bac',
                })
                .expect(200);
            assert(result.body.name === repo.name + 'bac');
            assert(result.body.path === repo.path + 'bac');
        });
        it('should failed if repo not exist', async () => {
            await app
                .httpRequest()
                .post('/repos/rename')
                .send({
                    repoPath: repo.path + 'abc',
                    newRepoName: repo.name + 'bac',
                })
                .expect(500);
        });
        it('should failed without repoPath', async () => {
            await app
                .httpRequest()
                .post('/repos/rename')
                .send({
                    newRepoName: repo.name + 'bac',
                })
                .expect(422);
        });
        it('should failed without new repo name', async () => {
            await app
                .httpRequest()
                .post('/repos/rename')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('#POST /repos/sync', () => {
        let repo;
        const repoUrl = 'http://git.kp.com/gitlab_www_hello/demo.git';
        beforeEach(async () => {
            repo = await app.factory.create('repo', {}, { guard });
        });
        it('should sync repo from gitlab', async () => {
            const result = await app
                .httpRequest()
                .post('/repos/sync')
                .send({
                    repoPath: repo.path,
                    gitlabRepoUrl: repoUrl,
                })
                .expect(200);
            assert(result.body);
        });
        it('should failed if repo not exist', async () => {
            await app
                .httpRequest()
                .post('/repos/sync')
                .send({
                    repoPath: repo.path + 'abc',
                    gitlabRepoUrl: repoUrl,
                })
                .expect(500);
        });
        it('should failed without repoPath', async () => {
            await app
                .httpRequest()
                .post('/repos/sync')
                .send({
                    gitlabRepoUrl: repoUrl,
                })
                .expect(422);
        });
        it('should failed without gitlab repo url', async () => {
            await app
                .httpRequest()
                .post('/repos/sync')
                .send({
                    repoPath: repo.path,
                })
                .expect(422);
        });
    });

    describe('#GET /repos/commitInfo', () => {
        let repo;
        beforeEach(async () => {
            repo = await app.factory.create('repo', {}, { guard });
        });
        it('should get repo commit info', async () => {
            const result = await app
                .httpRequest()
                .get('/repos/commitInfo')
                .send({
                    repoPath: repo.path,
                })
                .expect(200);
            assert(result.body.message);
        });
        it('should get repo commit info with commit id', async () => {
            const result = await app
                .httpRequest()
                .get('/repos/commitInfo')
                .send({
                    repoPath: repo.path,
                    commitId: 'a03c42e2b15a802638adbcb730dd15c8a3afe528',
                })
                .expect(200);
            assert(result.body.message);
        });
        it('should get repo commit info with ref', async () => {
            const result = await app
                .httpRequest()
                .get('/repos/commitInfo')
                .send({
                    repoPath: repo.path,
                    ref: 'master',
                })
                .expect(200);
            assert(result.body.message);
        });
        it('should failed if repo not exist', async () => {
            await app
                .httpRequest()
                .get('/repos/commitInfo')
                .send({
                    repoPath: repo.path + 'abc',
                })
                .expect(500);
        });
        it('should failed without repoPath', async () => {
            await app
                .httpRequest()
                .get('/repos/commitInfo')
                .expect(422);
        });
    });
});
