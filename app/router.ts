import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/', controller.home.index);

    router.post('/admin/signIn', controller.admin.session.sighIn);
    router.get('/admin/current', controller.admin.session.current);

    router.post('/admin/:resources/search', controller.admin.resource.search);
    router.delete('/admin/:resources/destroyAll', controller.admin.resource.destroyAll);
    router.resources('/admin/:resources', '/admin/:resources', controller.admin.resource);

    // router.post('/admin/cacheManager/reloadAllCache', controller.admin.cacheManager);

    router.post('/spaces/register', controller.space.register);

    router.post('/repos', controller.repo.create);
    router.get('/repos/download', controller.repo.download);

    router.post('/folders', controller.folder.create);
    router.delete('/folders', controller.folder.destroy);
    router.get('/folders/files', controller.folder.files);

    router.post('/files', controller.file.upsert);
    router.delete('/files', controller.file.destroy);
    router.get('/files/history', controller.file.history);
    router.get('/files/raw', controller.file.raw);
};
