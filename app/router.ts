import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/', controller.home.index);

    router.post('/admin/login', controller.admin.session.sighIn);
    router.post('/admin/logout', controller.admin.session.sighOut);
    router.get('/admin/current', controller.admin.session.current);

    router.post('/admin/:resources/search', controller.admin.resource.search);
    router.delete('/admin/:resources/destroyAll', controller.admin.resource.destroyAll);
    router.resources('/admin/:resources', '/admin/:resources', controller.admin.resource);

    router.post('/repos', controller.repo.create);
    router.get('/repos', controller.repo.show);
    router.delete('/repos', controller.repo.destroy);
    router.post('/repos/rename', controller.repo.rename);
    router.get('/repos/download', controller.repo.download);
    router.post('/repos/sync', controller.repo.sync);
    router.get('/repos/commitInfo', controller.repo.commitInfo);

    router.post('/folders', controller.folder.create);
    router.delete('/folders', controller.folder.destroy);
    router.get('/folders/files', controller.folder.files);
    router.post('/folders/move', controller.folder.move);

    router.post('/files', controller.file.upsert);
    router.delete('/files', controller.file.destroy);
    router.get('/files/history', controller.file.history);
    router.get('/files', controller.file.show);
    router.get('/files/info', controller.file.info);
    router.get('/files/raw', controller.file.raw);
    router.post('/files/move', controller.file.move);
};
