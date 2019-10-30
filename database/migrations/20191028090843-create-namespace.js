'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { BIGINT, STRING, INTEGER, DATE } = Sequelize;

        return queryInterface.createTable(
            'namespaces',
            {
                id: {
                    type: BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },

                name: {
                    type: STRING(16),
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
            },
            {
                underscored: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_bin',
            },
        );
    },

    down: queryInterface => {
        return queryInterface.dropTable('namespaces');
    },
};
