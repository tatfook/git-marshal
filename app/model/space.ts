import * as Sequelize from 'sequelize';
import { Application } from 'egg';
import { ISpace } from '../common/interface/model';

const { BIGINT, INTEGER, STRING, DATE } = Sequelize;

type SpaceInstance = typeof Sequelize.Model & (new (values?: object, options?: Sequelize.BuildOptions) => ISpace);

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

    return Model;
};
