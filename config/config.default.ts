import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1886632349809_3780';

    // add your egg config in here
    config.middleware = [];

    config.cors = {
        origin: '*',
    };

    config.security = {
        xframe: {
            enable: false,
        },
        csrf: {
            enable: false,
        },
    };

    config.bcrypt = {
        saltRounds: 10, // default 10
    };

    config.validate = {
        convert: true,
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
    };
};
