import * as Sequelize from 'sequelize';
import { Application } from 'egg';

const { BIGINT, INTEGER, STRING, DATE } = Sequelize;

interface INamespace extends Sequelize.Model {
    id?: number;
    name: string;
    userId: string;
    repoCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type NamespaceInstance = typeof Sequelize.Model & (new (values?: object, options?: Sequelize.BuildOptions) => INamespace);

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
    const Model = app.model.define('namespaces', schema, schemaOption) as NamespaceInstance;

    return Model;
};
