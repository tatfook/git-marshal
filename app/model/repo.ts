import * as Sequelize from 'sequelize';
import { Application } from 'egg';
import { IRepo } from '../common/interface/model';

const { BIGINT, STRING, DATE } = Sequelize;

type RepoInstance = typeof Sequelize.Model & (new (values?: object, options?: Sequelize.BuildOptions) => IRepo);

const schema = {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },

    guardId: {
        type: BIGINT,
        allowNull: false,
    },

    spaceId: {
        type: BIGINT,
        allowNull: false,
    },

    name: {
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(16),
        allowNull: false,
    },

    path: {
        // repo full path: namespace/repoName
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(36),
        allowNull: false,
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
    const Model = app.model.define('repos', schema, schemaOption) as RepoInstance;

    Model.addHook('afterCreate', async (instance: IRepo) => {
        await app.model.Space.increment(['repoCount'], {
            by: 1,
            where: { id: instance.spaceId },
        });
        await app.model.Guard.increment(['repoCount'], {
            by: 1,
            where: { id: instance.guardId },
        });
    });

    Model.addHook('beforeDestroy', async (instance: IRepo) => {
        await app.model.Space.increment(['repoCount'], {
            by: -1,
            where: { id: instance.spaceId },
        });
        await app.model.Guard.increment(['repoCount'], {
            by: -1,
            where: { id: instance.guardId },
        });
    });

    return Model;
};
