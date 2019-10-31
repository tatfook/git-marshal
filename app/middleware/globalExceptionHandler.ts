export default () => {
    return async (ctx, next) => {
        try {
            await next();
        } catch (e) {
            ctx.status = e.status || 500;
            ctx.body = {
                message: e.message || '服务器异常',
            };
        }
    };
};
