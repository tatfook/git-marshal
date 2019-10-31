import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    redis: {
        enable: false,
        package: 'egg-redis',
    },
};

export default plugin;
