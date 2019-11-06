import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    sequelize: {
        enable: true,
        package: 'egg-sequelize',
    },
    redis: {
        enable: true,
        package: 'egg-redis',
    },
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    bcrypt: {
        enable: true,
        package: 'egg-bcrypt',
    },
    parameters: {
        enable: true,
        package: 'egg-parameters',
    },
    tracer: {
        enable: true,
        package: 'egg-tracer',
    },
};

export default plugin;
