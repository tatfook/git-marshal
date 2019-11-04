// import * as assert from 'assert';
// import { Context } from 'egg';
// import { app } from 'egg-mock/bootstrap';

// describe('test/app/service/repo.test.ts', () => {
//     let ctx: Context;
//     before(() => {
//         ctx = app.mockContext();
//     });

//     describe('#genMovingFilesCommands', () => {
//         const folderFiles = [
//             {
//                 name: 'dir',
//                 path: 'test/dir',
//                 filemode: 16384,
//                 isTree: true,
//                 isBlob: false,
//                 id: 'fba472b77f419246d51bd92be1d80f5f37e0004d',
//                 children: [
//                     {
//                         name: 'file',
//                         path: 'test/dir/file',
//                         filemode: 33188,
//                         isTree: false,
//                         isBlob: true,
//                         id: '95d09f2b10159347eece71399a7e2e907ea3df4f',
//                     },
//                 ],
//             },
//             {
//                 name: 'file',
//                 path: 'test/file',
//                 filemode: 33188,
//                 isTree: false,
//                 isBlob: true,
//                 id: '95d09f2b10159347eece71399a7e2e907ea3df4f',
//             },
//         ];
//         it('should return flattened data while move files from normal folder to the other folder', () => {
//             const folderPath = 'test';
//             const newFolderPath = 'hello';
//             const data = ctx.service.folder.genMovingFilesCommands(folderFiles, folderPath, newFolderPath);
//             assert(data[0].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
//             assert(data[0].path === 'hello/dir/file');
//             assert(data[1].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
//             assert(data[1].path === 'test/dir/file');
//             assert(data[2].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
//             assert(data[2].path === 'hello/file');
//         });

//         it('should return flattened data while move files from root folder to the other folder', () => {
//             const folderPath = '';
//             const newFolderPath = 'hello/'; //
//             const data = ctx.service.folder.genMovingFilesCommands(folderFiles, folderPath, newFolderPath);
//             assert(data[0].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
//             assert(data[0].path === 'hello/test/dir/file');
//             assert(data[1].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
//             assert(data[1].path === 'test/dir/file');
//             assert(data[2].id === '95d09f2b10159347eece71399a7e2e907ea3df4f');
//             assert(data[2].path === 'hello/test/file');
//         });
//     });
// });
