import * as bcrypt from 'bcryptjs';
import * as Sequelize from 'sequelize';
import { Application } from 'egg';
import { IAdmin } from '../../typings/custom/model';

const { BIGINT, STRING, DATE } = Sequelize;

type AdminInstance = typeof Sequelize.Model & (new (values?: object, options?: Sequelize.BuildOptions) => IAdmin);

const schema = {
    id: {
        type: BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },

    username: {
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(64),
        unique: true,
        allowNull: false,
    },

    password: {
        // tslint:disable-next-line:no-magic-numbers
        type: STRING(64),
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
    const Model = app.model.define('admins', schema, schemaOption) as AdminInstance;

    Model.addHook('beforeCreate', (admin: IAdmin) => {
        if (admin.password) {
            admin.password = bcrypt.hashSync(admin.password);
        }
    });

    Model.addHook('beforeUpdate', (admin: IAdmin) => {
        if (admin.password) {
            admin.password = bcrypt.hashSync(admin.password);
        }
    });

    return Model;
};
