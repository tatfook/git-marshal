import * as Sequelize from 'sequelize';
import { Application } from 'egg';
import { IGuard } from '../common/interface/model';

const { BIGINT, INTEGER, STRING, DATE } = Sequelize;

type GuardInstance = typeof Sequelize.Model & (new (values?: object, options?: Sequelize.BuildOptions) => IGuard);

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
    const Model = app.model.define('guards', schema, schemaOption) as GuardInstance;

    return Model;
};
