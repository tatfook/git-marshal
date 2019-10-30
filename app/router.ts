import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    router.get('/', controller.home.index);

    router.post('/admin/signIn', controller.admin.session.sighIn);
    router.get('/admin/current', controller.admin.session.current);
    router.post('/admin/refreshToken', controller.admin.session.refreshToken);

    router.post('/admin/:resources/search', controller.admin.resource.search);
    router.delete('/admin/:resources/destroyAll', controller.admin.resource.destroyAll);
    router.resources('/admin/:resources', '/admin/:resources', controller.admin.resource);

    // router.post('/admin/cacheManager/reloadAllCache', controller.admin.cacheManager);
};
