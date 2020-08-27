import * as Sequelize from 'sequelize';
import { Application } from 'egg';
import { IRepo } from '../../typings/custom/model';

const { BIGINT, STRING, DATE } = Sequelize;

type RepoInstance = typeof Sequelize.Model & {
    new (values?: object, options?: Sequelize.BuildOptions): IRepo;
    associate(): void;
};

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

    space: {
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(48),
        allowNull: false,
    },

    name: {
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(128),
        allowNull: false,
    },

    path: {
        // repo full path: space/name
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(180),
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

    Model.associate = () => {
        app.model.Repo.belongsTo(app.model.Guard);
    };

    Model.addHook('afterCreate', async (instance: IRepo) => {
        // update counter
        await app.model.Guard.increment(['repoCount'], {
            by: 1,
            where: { id: instance.guardId },
        });
    });

    Model.addHook('beforeDestroy', async (instance: IRepo) => {
        // update counter
        await app.model.Guard.increment(['repoCount'], {
            by: -1,
            where: { id: instance.guardId },
        });
    });

    return Model;
};
