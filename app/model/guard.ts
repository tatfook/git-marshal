import * as Sequelize from 'sequelize';
import { Application } from 'egg';
import { IGuard } from '../../typings/custom/model';
import { GUARD_PREFIX } from '../common/const/redis';

const { BIGINT, INTEGER, STRING, DATE } = Sequelize;

type IGuardInstance = typeof Sequelize.Model & {
    new (values?: object, options?: Sequelize.BuildOptions): IGuard;
    cacheGuard(guard: IGuard): Promise<string>;
    getCachedGuard(id: number): Promise<IGuard | null>;
    reloadCache(): Promise<any>;
};

const schema = {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(64),
        unique: true,
        allowNull: false,
    },

    url: {
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(100),
        allowNull: false,
    },

    repoCount: {
        // repo counter
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
    },

    createdAt: {
        type: DATE,
        allowNull: false,
    },

    updatedAt: {
        type: DATE,
        allowNull: false,
    },
};

const schemaOption = {
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
};

export default (app: Application) => {
    const Model = app.model.define('guards', schema, schemaOption) as IGuardInstance;

    Model.cacheGuard = async (guard: IGuard) => {
        return app.redis.set(GUARD_PREFIX + guard.id, JSON.stringify(guard));
    };

    Model.getCachedGuard = async (id: number) => {
        const jsonStr = await app.redis.get(GUARD_PREFIX + id);
        if (jsonStr) {
            const jsonData = JSON.parse(jsonStr);
            return app.model.Guard.build(jsonData);
        }
        return null;
    };

    Model.reloadCache = async () => {
        // clean the cache data first, makesure there's no deleted guard
        const guardKeys = await app.redis.keys(GUARD_PREFIX + '*');
        const pipeline = app.redis.pipeline();
        guardKeys.forEach(key => {
            pipeline.del(key);
        });

        // load all available guards
        const guards = await app.model.Guard.findAll();
        guards.forEach(guard => {
            pipeline.set(GUARD_PREFIX + guard.id, JSON.stringify(guard));
        });
        await pipeline.exec();
    };

    return Model;
};
