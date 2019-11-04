import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
    const config: PowerPartial<EggAppConfig> = {};

    // change to your own sequelize configurations
    config.sequelize = {
        dialect: 'mysql',
        database: 'marshal_test',
    };

    config.redis = {
        client: {
            host: '127.0.0.1',
            port: 6379,
            password: '',
            db: 9,
        },
        agent: true,
    };

    config.mockAPI = {
        guard: {
            url: 'http://10.28.18.44:3001/mock/39',
        },
    };

    return config;
};
