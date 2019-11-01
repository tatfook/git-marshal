import * as Sequelize from 'sequelize';
import { Application } from 'egg';
import { SPACE_PREFIX } from '../common/const/redis';
import { ISpace } from '../../typings/custom/model';

const { BIGINT, INTEGER, STRING, DATE } = Sequelize;

type SpaceInstance = typeof Sequelize.Model & {
    new (values?: object, options?: Sequelize.BuildOptions): ISpace;
    cacheSpaceByUserId(space: ISpace): Promise<any>;
    getCachedSpaceByUserId(userId: number): Promise<ISpace | null>;
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

    userId: {
        type: BIGINT,
        allowNull: true,
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
    const Model = app.model.define('spaces', schema, schemaOption) as SpaceInstance;

    Model.cacheSpaceByUserId = async (space: ISpace) => {
        // cache for 7 days
        return app.redis.set(SPACE_PREFIX + space.userId, JSON.stringify(space), 'EX', 3600 * 24 * 7); // tslint:disable-line
    };

    Model.getCachedSpaceByUserId = async (userId: number) => {
        const jsonStr = await app.redis.get(SPACE_PREFIX + userId);
        if (jsonStr) {
            const jsonData = JSON.parse(jsonStr);
            return app.model.Space.build(jsonData);
        }
        return null;
    };
    return Model;
};
