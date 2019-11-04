import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';
import { ECommitAction } from '../../../typings/custom/api';
import { IGuard, IRepo } from '../../../typings/custom/model';

describe('test/app/service/folder.test.ts', () => {
    let ctx: Context;
    let guardMorkAPI: string;
    before(() => {
        ctx = app.mockContext();
        guardMorkAPI = app.config.mockAPI.guard.url;
    });

    describe('#genMovingFilesCommands', () => {
        const folderFiles = [
            {
                name: 'dir',
                path: 'test/dir',
                isTree: true,
                isBlob: false,
                id: 'fba472b77f419246d51bd92be1d80f5f37e0004d',
                children: [
                    {
                        name: 'file',
                        path: 'test/dir/file',
                        isTree: false,
                        isBlob: true,
                        id: '95d09f2b10159347eece71399a7e2e907ea3df4f',
                    },
                ],
            },
            {
                name: 'file',
                path: 'test/file',
                isTree: false,
                isBlob: true,
                id: '2c19fd3e206988435d29310faf66dc5176ec822e',
            },
        ];
        it('should return flattened data while move files from normal folder to the other folder', () => {
            const folderPath = 'test';
            const newFolderPath = 'hello';
            const data = ctx.service.folder.genMovingFilesCommands(folderFiles, folderPath, newFolderPath);
            assert(data[0].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
            assert(data[0].path === 'hello/dir/file');
            assert(data[1].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
            assert(data[1].path === 'test/dir/file');
            assert(data[2].id === '2c19fd3e206988435d29310faf66dc5176ec822e');
            assert(data[2].path === 'hello/file');
        });

        it('should return flattened data while move files from root folder to the other folder', () => {
            const folderPath = '';
            const newFolderPath = 'hello/';
            const data = ctx.service.folder.genMovingFilesCommands(folderFiles, folderPath, newFolderPath);
            assert(data[0].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
            assert(data[0].path === 'hello/test/dir/file');
            assert(data[0].action === ECommitAction.UPSERT);
            assert(data[1].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
            assert(data[1].path === 'test/dir/file');
            assert(data[1].action === ECommitAction.REMOVE);
            assert(data[2].id === '2c19fd3e206988435d29310faf66dc5176ec822e');
            assert(data[2].path === 'hello/test/file');
        });

        it('should return empty array if folder paths are the same', () => {
            const folderPath = 'test';
            const newFolderPath = 'test';
            const data = ctx.service.folder.genMovingFilesCommands(folderFiles, folderPath, newFolderPath);
            assert(data.length === 0);
        });
    });

    describe('#genDeletingFilesCommands', () => {
        const folderFiles = [
            {
                name: 'dir',
                path: 'test/dir',
                isTree: true,
                isBlob: false,
                id: 'fba472b77f419246d51bd92be1d80f5f37e0004d',
                children: [
                    {
                        name: 'file',
                        path: 'test/dir/file',
                        isTree: false,
                        isBlob: true,
                        id: '95d09f2b10159347eece71399a7e2e907ea3df4f',
                    },
                ],
            },
            {
                name: 'file',
                path: 'test/file',
                isTree: false,
                isBlob: true,
                id: '2c19fd3e206988435d29310faf66dc5176ec822e',
            },
        ];
        it('should return flattened data while deleting files of a folder', () => {
            const data = ctx.service.folder.genDeletingFilesCommands(folderFiles);
            assert(data[0].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
            assert(data[0].path === 'test/dir/file');
            assert(data[0].action === ECommitAction.REMOVE);
            assert(data[1].id === '2c19fd3e206988435d29310faf66dc5176ec822e');
            assert(data[1].path === 'test/file');
            assert(data[1].action === ECommitAction.REMOVE);
        });
    });

    describe('mock repo', () => {
        let guard: IGuard;
        let repo: IRepo;
        beforeEach(async () => {
            guard = await app.factory.create('guard', { url: guardMorkAPI });
            repo = await app.factory.create('repo', {}, { guard });
        });
        it('#createFolder', async () => {
            const data = await ctx.service.folder.createFolder(repo.path + '/hey');
            assert(data);
        });
        describe('#getFiles', () => {
            it('recursive', async () => {
                const data = await ctx.service.folder.getFiles(repo.path + '/hey', true);
                assert(data);
            });
            it('not recursive', async () => {
                const data = await ctx.service.folder.getFiles(repo.path + '/hey');
                assert(data);
            });
        });
        describe('#moveFolder', () => {
            it('successed with different folders', async () => {
                const data = await ctx.service.folder.moveFolder(repo.path + '/hey', repo.path + '/ho');
                assert(data);
            });
            it('failed with different folders', async () => {
                try {
                    await ctx.service.folder.moveFolder(repo.path + '/hey', repo.path + '/hey');
                } catch (e) {
                    assert(e.message === 'should not move to the same folder');
                }
            });
            it('failed with different repo', async () => {
                const repo2 = await app.factory.create('repo', {}, { guard });
                try {
                    await ctx.service.folder.moveFolder(repo.path + '/hey', repo2.path + '/hey');
                } catch (e) {
                    assert(e.message === 'only support moving folders in the same repo');
                }
            });
        });
        it('#deleteFolder', async () => {
            const data = await ctx.service.folder.deleteFolder(repo.path + '/hey');
            assert(data);
        });
    });
});
