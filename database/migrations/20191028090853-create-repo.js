'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { BIGINT, STRING, DATE } = Sequelize;

        return queryInterface.createTable(
            'repos',
            {
                id: {
                    type: BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },

                guardId: {
                    type: BIGINT,
                    allowNull: false,
                },

                namespaceId: {
                    type: BIGINT,
                    allowNull: false,
                },

                name: {
                    type: STRING(16),
                    allowNull: false,
                },

                path: {
                    // repo full path: namespace/repoName
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
            },
            {
                underscored: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_bin',
            },
        );
    },

    down: queryInterface => {
        return queryInterface.dropTable('repos');
    },
};
