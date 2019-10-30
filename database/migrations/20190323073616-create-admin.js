'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { BIGINT, STRING, DATE } = Sequelize;

        return queryInterface.createTable(
            'admins',
            {
                id: {
                    type: BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },

                username: {
                    type: STRING(64),
                    unique: true,
                    allowNull: false,
                },

                password: {
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
            },
            {
                underscored: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_bin',
            },
        );
    },

    down: queryInterface => {
        return queryInterface.dropTable('admins');
    },
};
